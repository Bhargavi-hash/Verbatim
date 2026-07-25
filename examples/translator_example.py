"""Minimal usage demo for src/translator.py. Falls back to a stub LLM so this
runs without an API key; set OPENAI_API_KEY or ANTHROPIC_API_KEY to use the
real model."""
import os

from src import llm_client

if not (os.environ.get("OPENAI_API_KEY") or os.environ.get("ANTHROPIC_API_KEY")):
    llm_client.complete = lambda prompt: "I have a strong pain in the upper part of my stomach."

from src.translator import translate_turn

result = translate_turn("Tengo un dolor fuerte en la parte superior del estómago.")
print(f"{result.source_lang} -> {result.target_lang}: {result.translated_text}")
