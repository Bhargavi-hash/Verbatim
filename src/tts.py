import os
import platform
import subprocess
import tempfile
from dataclasses import dataclass

from elevenlabs.client import ElevenLabs


class TtsError(Exception):
    pass


@dataclass
class Speech:
    audio_path: str
    duration_s: float


_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not _API_KEY:
    raise TtsError("speech: ELEVENLABS_API_KEY is not set")

_client = ElevenLabs(api_key=_API_KEY)

_MODEL_ID = "eleven_multilingual_v2"
_TIMEOUT_S = 15


def _resolve_voice_id(language_code: str, voice_id: str | None) -> str:
    if voice_id:
        return voice_id
    side = "ELEVENLABS_VOICE_PATIENT" if language_code.startswith("es") else "ELEVENLABS_VOICE_DOCTOR"
    resolved = os.environ.get(side)
    if not resolved:
        raise TtsError(f"speech: {side} is not set")
    return resolved


def _play_mp3(audio_path: str) -> None:
    system = platform.system()
    if system == "Darwin":
        cmd = ["afplay", audio_path]
    elif system == "Linux":
        cmd = ["mpg123", "-q", audio_path]
    else:
        cmd = ["ffplay", "-nodisp", "-autoexit", "-loglevel", "quiet", audio_path]
    subprocess.run(cmd, check=True)


def speak(text: str, language_code: str, play: bool = True, voice_id: str | None = None) -> Speech:
    if not text:
        raise TtsError("speech: text must not be empty")

    resolved_voice_id = _resolve_voice_id(language_code, voice_id)

    try:
        audio_chunks = _client.text_to_speech.convert(
            voice_id=resolved_voice_id,
            model_id=_MODEL_ID,
            text=text,
        )
        audio_bytes = b"".join(audio_chunks)
    except Exception as exc:
        raise TtsError(f"speech: ElevenLabs synthesis failed: {exc}") from exc

    fd, audio_path = tempfile.mkstemp(suffix=".mp3", prefix="verbatim_tts_")
    with os.fdopen(fd, "wb") as f:
        f.write(audio_bytes)

    duration_s = len(audio_bytes) / 16000  # rough estimate, not decoded

    if play:
        try:
            _play_mp3(audio_path)
        except Exception as exc:
            raise TtsError(f"speech: playback failed: {exc}") from exc

    return Speech(audio_path=audio_path, duration_s=duration_s)
