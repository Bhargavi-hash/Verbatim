"""Minimal usage demo for src/pipeline.py, run against the checked-in sample
transcript. Falls back to a stub LLM so this runs without an API key."""
import json
import os

from src import llm_client

if not (os.environ.get("OPENAI_API_KEY") or os.environ.get("ANTHROPIC_API_KEY")):
    llm_client.complete = lambda prompt: prompt.rsplit("\n\n", 1)[-1]

from src.pipeline import build_intake

with open("sample_conversation_es.json", encoding="utf-8") as f:
    conversation = json.load(f)

intake = build_intake(
    session_id=conversation["session_id"],
    patient_ref=conversation["patient_ref"],
    transcript=conversation["transcript"],
)
print(json.dumps(intake, indent=2, ensure_ascii=False))
