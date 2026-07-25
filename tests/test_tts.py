import os

os.environ.setdefault("ELEVENLABS_API_KEY", "test-key")
os.environ.setdefault("ELEVENLABS_VOICE_PATIENT", "voice-patient")
os.environ.setdefault("ELEVENLABS_VOICE_DOCTOR", "voice-doctor")

import pytest

from src import tts


def test_speak_writes_audio_file(monkeypatch):
    monkeypatch.setattr(
        tts._client.text_to_speech, "convert", lambda **kwargs: iter([b"abc", b"def"])
    )

    speech = tts.speak("Hola, ¿cómo se siente?", language_code="es", play=False)

    assert os.path.exists(speech.audio_path)
    with open(speech.audio_path, "rb") as f:
        assert f.read() == b"abcdef"
    os.remove(speech.audio_path)


def test_speak_selects_voice_by_language(monkeypatch):
    seen = {}

    def _convert(**kwargs):
        seen.update(kwargs)
        return iter([b"x"])

    monkeypatch.setattr(tts._client.text_to_speech, "convert", _convert)

    speech = tts.speak("Hello", language_code="en", play=False)
    assert seen["voice_id"] == "voice-doctor"
    os.remove(speech.audio_path)


def test_speak_raises_on_empty_text():
    with pytest.raises(tts.TtsError):
        tts.speak("", language_code="es", play=False)


def test_speak_raises_on_api_failure(monkeypatch):
    def _raise(**kwargs):
        raise RuntimeError("timeout")

    monkeypatch.setattr(tts._client.text_to_speech, "convert", _raise)

    with pytest.raises(tts.TtsError):
        tts.speak("Hola", language_code="es", play=False)
