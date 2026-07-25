import json

import pytest

from src import llm_client, pipeline


@pytest.fixture(autouse=True)
def stub_llm(monkeypatch):
    monkeypatch.setattr(llm_client, "complete", lambda prompt: prompt.rsplit("\n\n", 1)[-1])


@pytest.fixture
def conversation():
    with open("sample_conversation_es.json", encoding="utf-8") as f:
        return json.load(f)


def test_build_intake_detects_emergent_red_flags(conversation):
    intake = pipeline.build_intake(
        session_id=conversation["session_id"],
        patient_ref=conversation["patient_ref"],
        transcript=conversation["transcript"],
    )

    assert intake["triage_priority"] == "EMERGENT"
    assert "shortness of breath" in intake["red_flags"]
    assert intake["chief_complaint"]["source_turn"] == 2


def test_build_intake_infers_history_from_medication(conversation):
    intake = pipeline.build_intake(
        session_id=conversation["session_id"],
        patient_ref=conversation["patient_ref"],
        transcript=conversation["transcript"],
    )

    history = intake["relevant_history"][0]
    assert history["value"] == "hypertension"
    assert history["stated_by_patient"] is False


def test_build_intake_raises_on_empty_transcript():
    with pytest.raises(pipeline.PipelineError):
        pipeline.build_intake(session_id="s", patient_ref="p", transcript=[])


def test_build_intake_no_red_flags_is_routine():
    transcript = [
        {"turn": 1, "speaker": "agent", "ts": "t", "text": "¿Por qué vino hoy?"},
        {"turn": 2, "speaker": "patient", "ts": "t", "text": "Me torcí el tobillo."},
    ]
    intake = pipeline.build_intake(session_id="s", patient_ref="p", transcript=transcript)
    assert intake["triage_priority"] == "ROUTINE"
    assert intake["red_flags"] == []
