"""The core intake -> physician-summary pipeline. Structured as four stages
(extract / triage / summarize / qa) that backend/pipeline/band_agent.py wires
up as LangGraph-style nodes. Each stage is a plain function here so it works
whether or not the langgraph/band packages are actually importable in the
running environment (see band_agent.py for why that matters)."""
import re
import unicodedata

from backend.pipeline import llm_client, redflag_rules

CLINICAL_SAFETY_NOTE = (
    "Verbatim supports intake, translation, summarization, and clinical decision support. "
    "Final diagnosis, treatment, and referral decisions must be reviewed and approved by a licensed healthcare professional."
)

REFERRAL_BY_CATEGORY = {
    "CARDIAC": "Cardiology",
    "RESPIRATORY": "Pulmonology",
    "NEURO": "Neurology",
    "GI": "Gastroenterology",
    "MSK_INJURY": "Orthopedics",
    "INFECTION": "Infectious Disease",
    "GENERAL": "Internal Medicine",
}

CATEGORY_DEFAULT_PRIORITY = {
    "CARDIAC": "EMERGENT",
    "NEURO": "EMERGENT",
    "RESPIRATORY": "URGENT",
    "GI": "URGENT",
    "INFECTION": "URGENT",
    "MSK_INJURY": "ROUTINE",
    "GENERAL": "ROUTINE",
}

CATEGORY_KEYWORDS = {
    "CARDIAC": ["pecho", "corazon", "corazón", "chest", "heart", "palpitat"],
    "RESPIRATORY": ["respirar", "aire", "tos", "breathe", "cough", "wheez", "asma", "asthma"],
    "NEURO": ["cabeza", "mareo", "head", "dizz", "vision", "numb", "faint"],
    "GI": ["estomago", "abdomen", "nausea", "stomach", "vomit", "diarrea", "diarrhea"],
    "MSK_INJURY": ["cai", "caida", "fell", "twisted", "tobillo", "ankle", "fractur"],
    "INFECTION": ["fiebre", "fever", "chills", "escalofrio", "infeccion", "infection"],
}


def _norm(s: str) -> str:
    s = (s or "").lower()
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def classify_category(transcript: list[dict]) -> str:
    patient_text = _norm(" ".join(t["text"] for t in transcript if t.get("who") == "patient"))
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(_norm(kw) in patient_text for kw in keywords):
            return category
    return "GENERAL"


def _fallback_extract(transcript: list[dict]) -> dict:
    """No LLM key configured — minimal viable extraction so the pipeline
    still produces *something* demoable, clearly labeled as a fallback."""
    patient_turns = [t["text"] for t in transcript if t.get("who") == "patient"]
    category = classify_category(transcript)
    severity_match = re.search(r"\b(10|[0-9])\s*(/|out of)?\s*10?\b", " ".join(patient_turns))
    return {
        "chief_complaint": patient_turns[0] if patient_turns else "Not specified",
        "duration": "Not specified",
        "severity": (severity_match.group(1) + "/10") if severity_match else "Not reported",
        "symptoms": patient_turns[1:] if len(patient_turns) > 1 else [],
        "medical_history": [],
        "medication": [],
        "allergy": "Not asked",
        "condition_category": category,
        "triage_priority": CATEGORY_DEFAULT_PRIORITY.get(category, "ROUTINE"),
        "emergency_flag": False,
    }


EXTRACTION_SYSTEM_PROMPT = """You are a clinical intake summarizer for Verbatim, a patient-intake \
assistant. You will be given a full transcript of a conversation between an \
intake assistant and a patient. The patient may have spoken in any language \
(not limited to Spanish or English) — read it in whatever language it's in. \
Extract a structured physician summary as a single JSON object with exactly \
these keys, with every value written in English regardless of the \
transcript's original language, since the reviewing physician reads English:

- chief_complaint (string, in English, patient's primary reason for the visit)
- duration (string, in English, e.g. "3 weeks" or "Not specified")
- severity (string, e.g. "7/10" or "Not reported")
- symptoms (array of short English strings, one per distinct symptom/finding)
- medical_history (array of short English strings; include anything inferable \
  from context, e.g. a medication implying a condition, and note it's inferred)
- medication (array of short English strings)
- allergy (string, in English)
- condition_category (one of: CARDIAC, RESPIRATORY, NEURO, GI, MSK_INJURY, \
  INFECTION, GENERAL)
- triage_priority (one of: EMERGENT, URGENT, ROUTINE)
- emergency_flag (boolean — true only if the patient describes a genuine \
  red-flag emergency symptom, e.g. chest pain radiating to the arm, can't \
  breathe, stroke signs, thunderclap headache, heavy bleeding, loss of \
  consciousness)

Be conservative and ground every field in what was actually said — do not \
invent symptoms or history that weren't mentioned or clearly implied. \
Respond with ONLY the JSON object."""


def extract_fields(transcript: list[dict]) -> dict:
    """Stage 1 (Extractor node): raw transcript -> structured fields."""
    if not llm_client.provider_configured():
        result = _fallback_extract(transcript)
        return result, "deterministic-fallback (no LLM key configured)"

    convo_text = "\n".join(f"{t['who'].upper()}: {t['text']}" for t in transcript)
    try:
        result, model = llm_client.complete_json(EXTRACTION_SYSTEM_PROMPT, convo_text)
        return result, model
    except (llm_client.LLMCallFailed, llm_client.LLMNotConfigured) as e:
        result = _fallback_extract(transcript)
        return result, f"deterministic-fallback (LLM call failed: {e})"


def triage(fields: dict, transcript: list[dict]) -> dict:
    """Stage 2 (Triage node): cross-check the LLM's emergency_flag against the
    deterministic keyword+negation safety net. Disagreements are surfaced,
    never silently overridden without a record of it."""
    rule_hits = redflag_rules.check(transcript)
    llm_said_emergency = bool(fields.get("emergency_flag"))
    rules_say_emergency = bool(rule_hits)

    disagreement = llm_said_emergency != rules_say_emergency
    emergency_flag = llm_said_emergency or rules_say_emergency  # rules can only escalate, never de-escalate silently

    priority = fields.get("triage_priority", "ROUTINE")
    if emergency_flag:
        priority = "EMERGENT"

    return {
        "emergency_flag": emergency_flag,
        "triage_priority": priority,
        "redflag_disagreement": disagreement,
        "rule_based_hits": rule_hits,
    }


def build_referral(condition_category: str, triage_priority: str, chief_complaint: str, symptoms: list[str]) -> dict:
    """Stage 3 (Summarizer node, referral portion)."""
    specialist = REFERRAL_BY_CATEGORY.get(condition_category, "Internal Medicine")
    needs_referral = triage_priority in ("EMERGENT", "URGENT")
    status = (
        f"Referral sent to {specialist} for further evaluation."
        if needs_referral
        else "No referral required at this time — routine follow-up recommended."
    )
    return {
        "specialist": specialist,
        "reasons": [chief_complaint, *symptoms],
        "status": status,
    }


def run_pipeline(transcript: list[dict]) -> dict:
    """Runs all four stages in order and returns everything needed to build a
    PhysicianSummary row. This is the function band_agent.py's LangGraph-style
    graph calls node-by-node when BAND/LangGraph aren't available, and the
    same function each node delegates to when they are."""
    fields, model_used = extract_fields(transcript)
    triage_result = triage(fields, transcript)
    referral = build_referral(
        fields.get("condition_category", "GENERAL"),
        triage_result["triage_priority"],
        fields.get("chief_complaint", ""),
        fields.get("symptoms", []),
    )

    summary = {
        "chief_complaint": fields.get("chief_complaint", "Not specified"),
        "duration": fields.get("duration", "Not specified"),
        "severity": fields.get("severity", "Not reported"),
        "symptoms": fields.get("symptoms", []),
        "medical_history": fields.get("medical_history", []),
        "medication": fields.get("medication", []),
        "allergy": fields.get("allergy", "Not asked"),
        "condition_category": fields.get("condition_category", "GENERAL"),
        "triage_priority": triage_result["triage_priority"],
        "emergency_flag": triage_result["emergency_flag"],
        "redflag_disagreement": triage_result["redflag_disagreement"],
        "referral_specialist": referral["specialist"],
        "referral_reasons": referral["reasons"],
        "referral_status": referral["status"],
        "clinical_safety_note": CLINICAL_SAFETY_NOTE,
        "model_used": model_used,
    }
    return summary


TRANSLATE_SYSTEM_PROMPT = """You are a medical document translator. Translate \
the given physician summary fields into {target_language}, preserving \
clinical meaning exactly — do not add, remove, or soften any information. \
Keep the same JSON keys and array structure as the input; translate only the \
string values. Respond with ONLY the JSON object."""


def translate_summary(summary: dict, target_language: str) -> dict:
    """On-demand translation of a stored physician summary into whatever
    language a doctor (or patient) selects from their language dropdown —
    not limited to Spanish/English. Falls back to the original (English)
    summary, tagged accordingly, if no LLM is configured or the call fails."""
    if not llm_client.provider_configured():
        return {**summary, "translation_note": f"No LLM configured — showing original English summary, not {target_language}."}

    translatable = {
        "chief_complaint": summary.get("chief_complaint"),
        "duration": summary.get("duration"),
        "severity": summary.get("severity"),
        "symptoms": summary.get("symptoms", []),
        "medical_history": summary.get("medical_history", []),
        "medication": summary.get("medication", []),
        "allergy": summary.get("allergy"),
        "referral_reasons": summary.get("referral_reasons", []),
        "referral_status": summary.get("referral_status"),
        "clinical_safety_note": summary.get("clinical_safety_note"),
    }
    import json as _json
    prompt = TRANSLATE_SYSTEM_PROMPT.format(target_language=target_language)
    try:
        translated, _model = llm_client.complete_json(prompt, _json.dumps(translatable))
        return {**summary, **translated, "translated_to": target_language}
    except (llm_client.LLMCallFailed, llm_client.LLMNotConfigured) as e:
        return {**summary, "translation_note": f"Translation to {target_language} failed: {e}"}


def translate_text(text: str, target_language: str) -> str:
    """On-demand translation of a single short string (e.g. the conductor's
    next question) into the patient's chosen language. Falls back to the
    original English text if no LLM is configured, the language is already
    English, or the call fails — same graceful-degradation pattern as
    translate_summary() above."""
    if not text or not target_language or target_language.lower() in ("en", "en-us", "english"):
        return text
    if not llm_client.provider_configured():
        return text
    try:
        prompt = (
            f"Translate the following short sentence into {target_language}, preserving "
            "clinical meaning exactly. Respond with ONLY the translated sentence, nothing else."
        )
        translated, _model = llm_client.complete_text(prompt, text)
        return translated.strip() or text
    except (llm_client.LLMCallFailed, llm_client.LLMNotConfigured):
        return text
