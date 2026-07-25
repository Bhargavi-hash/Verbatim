import re

from src.translator import translate_turn

RED_FLAG_PATTERNS = {
    "chest pain with radiation to left arm": [r"brazo izquierdo", r"brazo derecho"],
    "shortness of breath": [r"falta.{0,10}aire", r"no puedo respirar"],
    "acute onset within 3 hours": [r"esta ma[nñ]ana", r"hace \w+ horas"],
}

MEDICATION_INDICATIONS = {
    "lisinopril": "hypertension",
    "metformina": "type 2 diabetes",
    "metformin": "type 2 diabetes",
}


class PipelineError(Exception):
    pass


def _patient_turns(transcript: list[dict]) -> list[dict]:
    return [t for t in transcript if t.get("speaker") == "patient"]


def _find_red_flags(transcript: list[dict]) -> list[str]:
    flags = []
    full_text = " ".join(t["text"].lower() for t in _patient_turns(transcript))
    for label, patterns in RED_FLAG_PATTERNS.items():
        if any(re.search(p, full_text) for p in patterns):
            flags.append(label)
    return flags


def _field(value: str, source_span: str, source_turn: int, stated_by_patient: bool = True, note: str | None = None) -> dict:
    entry = {
        "value": translate_turn(value).translated_text if value else value,
        "source_span": source_span,
        "source_turn": source_turn,
        "stated_by_patient": stated_by_patient,
    }
    if note:
        entry["note"] = note
    return entry


def build_intake(session_id: str, patient_ref: str, transcript: list[dict]) -> dict:
    if not transcript:
        raise PipelineError("pipeline: transcript must not be empty")

    patient_turns = _patient_turns(transcript)
    if not patient_turns:
        raise PipelineError("pipeline: transcript has no patient turns")

    red_flags = _find_red_flags(transcript)
    triage_priority = "EMERGENT" if red_flags else "ROUTINE"

    intake: dict = {
        "session_id": session_id,
        "patient_ref": patient_ref,
        "language_spoken": "es",
        "triage_priority": triage_priority,
        "red_flags": red_flags,
    }

    # Chief complaint: first patient turn is the canonical entry point.
    first = patient_turns[0]
    intake["chief_complaint"] = _field(first["text"], first["text"], first["turn"])

    # current_medications + relevant_history (inferred indication)
    medications = []
    relevant_history = []
    for turn in patient_turns:
        for med, indication in MEDICATION_INDICATIONS.items():
            if med in turn["text"].lower():
                entry = _field(turn["text"], turn["text"], turn["turn"])
                entry["indication"] = indication
                medications.append(entry)
                relevant_history.append(
                    _field(
                        indication,
                        turn["text"],
                        turn["turn"],
                        stated_by_patient=False,
                        note="INFERRED from medication indication - not directly stated",
                    )
                )
    if medications:
        intake["current_medications"] = medications
    if relevant_history:
        intake["relevant_history"] = relevant_history

    intake["english_summary"] = translate_turn(
        " ".join(t["text"] for t in patient_turns)
    ).translated_text

    return intake
