import os
import types

os.environ.setdefault("ELEVENLABS_API_KEY", "test-key")

import pytest

from src import stt


class _FakeResult:
    def __init__(self, text, language_code="es"):
        self.text = text
        self.language_code = language_code


def test_transcribe_returns_transcript(tmp_path, monkeypatch):
    audio_path = tmp_path / "turn.wav"
    audio_path.write_bytes(b"fake audio")

    monkeypatch.setattr(
        stt._client.speech_to_text, "convert", lambda **kwargs: _FakeResult("Me duele el pecho.")
    )

    result = stt.transcribe(str(audio_path), language_code="es")

    assert result.text == "Me duele el pecho."
    assert result.language_code == "es"
    assert result.duration_s >= 0


def test_transcribe_raises_on_empty_transcript(tmp_path, monkeypatch):
    audio_path = tmp_path / "turn.wav"
    audio_path.write_bytes(b"fake audio")

    monkeypatch.setattr(stt._client.speech_to_text, "convert", lambda **kwargs: _FakeResult("   "))

    with pytest.raises(stt.SttError):
        stt.transcribe(str(audio_path))


def test_transcribe_raises_on_api_failure(tmp_path, monkeypatch):
    audio_path = tmp_path / "turn.wav"
    audio_path.write_bytes(b"fake audio")

    def _raise(**kwargs):
        raise RuntimeError("network error")

    monkeypatch.setattr(stt._client.speech_to_text, "convert", _raise)

    with pytest.raises(stt.SttError):
        stt.transcribe(str(audio_path))
