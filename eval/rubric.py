"""LLM evaluation rubric: scores a (transcript, physician_summary) pair on
completeness, hallucination risk, and red-flag recall/precision. Used both
online (the QA node in backend/pipeline/band_agent.py, one score per real
conversation) and offline (eval/run_eval.py, replaying the golden dataset).

Kept dependency-free (stdlib + backend.pipeline.llm_client only) so it runs
the same way in both contexts.
"""
from backend.pipeline import llm_client, redflag_rules

RUBRIC_VERSION = "v1"

JUDGE_SYSTEM_PROMPT = """You are a clinical QA reviewer grading an AI intake \
system's output against the original patient transcript. Score the summary \
on three axes, each 0-10 (10 = best):

- completeness: does the summary capture everything clinically relevant that \
  the patient actually said?
- groundedness: is everything in the summary actually supported by the \
  transcript (10 = no hallucinated claims, 0 = summary invents things)?
- clarity: is the summary clear and useful for a physician skimming it?

Respond with ONLY a JSON object: {"completeness": N, "groundedness": N, \
"clarity": N, "notes": "one short sentence"}"""


def _judge_with_llm(transcript: list[dict], summary: dict) -> dict:
    convo_text = "\n".join(f"{t['who'].upper()}: {t['text']}" for t in transcript)
    summary_text = (
        f"Chief complaint: {summary.get('chief_complaint')}\n"
        f"Duration: {summary.get('duration')}\n"
        f"Severity: {summary.get('severity')}\n"
        f"Symptoms: {', '.join(summary.get('symptoms', []))}\n"
        f"Medical history: {', '.join(summary.get('medical_history', []))}\n"
        f"Medication: {', '.join(summary.get('medication', []))}\n"
        f"Allergy: {summary.get('allergy')}\n"
    )
    user = f"TRANSCRIPT:\n{convo_text}\n\nSUMMARY:\n{summary_text}"
    result, model = llm_client.complete_json(JUDGE_SYSTEM_PROMPT, user)
    return result, model


def _redflag_recall_precision(transcript: list[dict], summary: dict) -> dict:
    """Deterministic axis, no LLM needed: does the summary's emergency_flag
    agree with the independent keyword-based red-flag check?"""
    rule_hits = redflag_rules.check(transcript)
    rules_say_emergency = bool(rule_hits)
    summary_says_emergency = bool(summary.get("emergency_flag"))
    return {
        "rule_based_emergency": rules_say_emergency,
        "summary_emergency_flag": summary_says_emergency,
        "agree": rules_say_emergency == summary_says_emergency,
        "rule_hits": rule_hits,
    }


def score(transcript: list[dict], summary: dict) -> dict:
    redflag = _redflag_recall_precision(transcript, summary)

    if llm_client.provider_configured():
        try:
            judged, model = _judge_with_llm(transcript, summary)
        except (llm_client.LLMCallFailed, llm_client.LLMNotConfigured) as e:
            judged, model = {"completeness": None, "groundedness": None, "clarity": None,
                              "notes": f"LLM judge failed: {e}"}, "unavailable"
    else:
        judged, model = {"completeness": None, "groundedness": None, "clarity": None,
                          "notes": "No LLM configured — only the deterministic red-flag axis ran."}, "none"

    verdict = "pass"
    if not redflag["agree"]:
        verdict = "fail"  # a missed or over-called red flag is always a hard fail
    elif judged.get("groundedness") is not None and judged["groundedness"] < 6:
        verdict = "fail"
    elif judged.get("completeness") is not None and judged["completeness"] < 5:
        verdict = "review"

    return {
        "rubric_version": RUBRIC_VERSION,
        "model": model,
        "redflag": redflag,
        "judged": judged,
        "verdict": verdict,
    }
