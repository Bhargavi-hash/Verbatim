import os
import time
from dataclasses import dataclass

from elevenlabs.client import ElevenLabs


class SttError(Exception):
    pass


@dataclass
class Transcript:
    text: str
    language_code: str
    duration_s: float


_API_KEY = os.environ.get("ELEVENLABS_API_KEY")
if not _API_KEY:
    raise SttError("listen: ELEVENLABS_API_KEY is not set")

_client = ElevenLabs(api_key=_API_KEY)

_MODEL_ID = "scribe_v1"
_TIMEOUT_S = 15


def transcribe(audio_path: str, language_code: str = "es") -> Transcript:
    start = time.monotonic()

    try:
        with open(audio_path, "rb") as f:
            result = _client.speech_to_text.convert(
                file=f,
                model_id=_MODEL_ID,
                language_code=language_code,
            )
    except Exception as exc:
        raise SttError(f"listen: ElevenLabs transcription failed: {exc}") from exc

    duration_s = time.monotonic() - start
    if duration_s > _TIMEOUT_S:
        raise SttError(f"listen: transcription exceeded {_TIMEOUT_S}s timeout")

    text = getattr(result, "text", None)
    if not text or not text.strip():
        raise SttError("listen: transcript was empty")

    resolved_language = getattr(result, "language_code", language_code) or language_code

    return Transcript(text=text.strip(), language_code=resolved_language, duration_s=duration_s)
