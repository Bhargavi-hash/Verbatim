REQUIRED_FIELDS = [
    ("chief_complaint", "¿Cuál es el motivo principal de su visita hoy?"),
    ("onset", "¿Cuándo comenzó el dolor?"),
    ("severity_0_10", "En una escala del cero al diez, ¿qué tan intenso es el dolor?"),
    ("associated_symptoms", "¿Ha tenido náuseas, vómitos, fiebre o falta de aire?"),
    ("current_medications", "¿Está tomando algún medicamento actualmente?"),
    ("allergies", "¿Tiene alguna alergia a medicamentos?"),
]

EMERGENT_NOTICE = (
    "Entiendo, y por lo que me dice voy a avisar al equipo médico ahora mismo "
    "para que la atiendan de inmediato."
)


class ResponderError(Exception):
    pass


def _confirmation_recap(intake: dict) -> str:
    parts = []
    if "chief_complaint" in intake:
        parts.append(intake["chief_complaint"]["value"])
    return (
        "Gracias. Permítame confirmar que entendí correctamente. "
        + " ".join(parts)
        + " ¿Es correcto?"
    )


def next_turn(state: dict) -> str:
    if "transcript" not in state or "intake" not in state:
        raise ResponderError("respond: state must include 'transcript' and 'intake'")

    intake = state["intake"]

    for field, question in REQUIRED_FIELDS:
        if field not in intake:
            if intake.get("triage_priority") == "EMERGENT":
                return f"{EMERGENT_NOTICE} {question}"
            return question

    return _confirmation_recap(intake)
