import pytest

from src import responder


def test_next_turn_asks_first_missing_field():
    state = {"transcript": [], "intake": {}}
    assert responder.next_turn(state) == "¿Cuál es el motivo principal de su visita hoy?"


def test_next_turn_skips_populated_fields():
    state = {"transcript": [], "intake": {"chief_complaint": {"value": "Chest pain"}}}
    assert responder.next_turn(state) == "¿Cuándo comenzó el dolor?"


def test_next_turn_prepends_emergent_notice():
    state = {"transcript": [], "intake": {"triage_priority": "EMERGENT"}}
    result = responder.next_turn(state)
    assert result.startswith(responder.EMERGENT_NOTICE)


def test_next_turn_returns_recap_when_all_fields_populated():
    intake = {field: {"value": "x"} for field, _ in responder.REQUIRED_FIELDS}
    intake["chief_complaint"] = {"value": "Chest pain"}
    state = {"transcript": [], "intake": intake}
    result = responder.next_turn(state)
    assert result.startswith("Gracias. Permítame confirmar")
    assert "Chest pain" in result


def test_next_turn_raises_on_missing_state_keys():
    with pytest.raises(responder.ResponderError):
        responder.next_turn({})
