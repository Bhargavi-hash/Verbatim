"""Minimal usage demo for src/stt.py. Requires ELEVENLABS_API_KEY and a
sample audio file."""
import os
import sys

if not os.environ.get("ELEVENLABS_API_KEY"):
    print("skipped: set ELEVENLABS_API_KEY to run this example")
else:
    from src.stt import transcribe

    audio_path = sys.argv[1] if len(sys.argv) > 1 else "data/fixtures/sample_turn.wav"
    transcript = transcribe(audio_path, language_code="es")
    print(f"[{transcript.language_code}] {transcript.text}")
