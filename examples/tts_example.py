"""Minimal usage demo for src/tts.py. Requires ELEVENLABS_API_KEY and
ELEVENLABS_VOICE_PATIENT/ELEVENLABS_VOICE_DOCTOR in the environment."""
import os

if not os.environ.get("ELEVENLABS_API_KEY"):
    print("skipped: set ELEVENLABS_API_KEY to run this example")
else:
    from src.tts import speak

    speech = speak(
        "Hola, soy su asistente de admisión médica.",
        language_code="es",
        play=False,
    )
    print(f"wrote {speech.audio_path} ({speech.duration_s:.1f}s)")
