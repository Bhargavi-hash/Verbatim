"""Deterministic keyword+negation red-flag safety net — ported from the
frontend's checkRedFlags()/clausesOf() logic. A compliance-grade intake app
shouldn't rely on LLM judgment alone for emergency detection: this runs
independently of the LLM triage node, and any disagreement between the two
is logged rather than silently dropped (see pipeline/extractor.py)."""
import re
import unicodedata

RED_FLAGS = [
    {"kw": ["brazo izquierdo", "se me va al brazo", "mandibula", "left arm", "radiating to my arm", "jaw"],
     "why": "pain radiating to arm/jaw"},
    {"kw": ["no puedo respirar", "no me llega el aire", "me ahogo", "can't breathe", "not getting enough air", "choking"],
     "why": "severe respiratory distress"},
    {"kw": ["no puedo hablar", "se me traba", "cara caida", "can't speak", "slurring", "face drooping"],
     "why": "possible stroke sign"},
    {"kw": ["peor dolor de cabeza", "worst headache"], "why": "thunderclap headache"},
    {"kw": ["mucha sangre", "sangrando mucho", "no para de sangrar", "a lot of blood", "bleeding a lot", "won't stop bleeding"],
     "why": "significant bleeding"},
    {"kw": ["me desmaye", "perdi el conocimiento", "i fainted", "passed out", "lost consciousness"],
     "why": "syncope"},
]

NEG = re.compile(r"\b(no|nunca|jamas|tampoco|sin|ningun|ninguna|niego|negativo|not|never|n't)\b")


def _norm(s: str) -> str:
    s = (s or "").lower()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return s


def _clauses(text: str) -> list[str]:
    parts = re.split(r"[,.;:!?]|\bpero\b|\baunque\b|\bsin embargo\b|\bbut\b", _norm(text))
    return [p.strip() for p in parts if p.strip()]


def check(transcript: list[dict]) -> list[str]:
    """Scan all patient turns for red-flag phrases, clause-by-clause, skipping
    clauses that are negated. Returns the list of matched "why" reasons."""
    patient_text = " . ".join(t["text"] for t in transcript if t.get("who") == "patient")
    clauses = _clauses(patient_text)
    hits = []
    for flag in RED_FLAGS:
        for clause in clauses:
            if NEG.search(clause):
                continue
            if any(_norm(kw) in clause for kw in flag["kw"]):
                hits.append(flag["why"])
                break
    return hits
