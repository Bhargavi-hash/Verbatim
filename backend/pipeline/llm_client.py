"""Direct REST calls to Gemini — no SDK dependency (this sandbox can't
reliably pip-install third-party packages, but raw HTTPS works fine,
verified with curl). Set GEMINI_API_KEY in .env to enable it; without it,
extractor.py/rubric.py fall back to a deterministic (Spanish/English-only)
path, clearly labeled wherever its output shows up.
"""
import json
import os
import re

import requests

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")


class LLMNotConfigured(Exception):
    pass


class LLMCallFailed(Exception):
    pass


def provider_configured() -> bool:
    return bool(GEMINI_API_KEY)


def _call_gemini(system: str, user: str, json_mode: bool) -> tuple[str, str]:
    body = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": [{"role": "user", "parts": [{"text": user}]}],
        "generationConfig": {"temperature": 0},
    }
    if json_mode:
        body["generationConfig"]["responseMimeType"] = "application/json"

    r = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent",
        params={"key": GEMINI_API_KEY},
        json=body,
        timeout=60,
    )
    if not r.ok:
        raise LLMCallFailed(f"Gemini {r.status_code}: {r.text[:300]}")
    data = r.json()
    try:
        text = "".join(part.get("text", "") for part in data["candidates"][0]["content"]["parts"])
    except (KeyError, IndexError):
        raise LLMCallFailed(f"Unexpected Gemini response shape: {json.dumps(data)[:300]}")
    return text, GEMINI_MODEL


def complete_json(system: str, user: str) -> tuple[dict, str]:
    """Call Gemini asking for JSON, and parse it."""
    if not GEMINI_API_KEY:
        raise LLMNotConfigured("Set GEMINI_API_KEY in .env")

    raw, model = _call_gemini(system, user, json_mode=True)
    try:
        return json.loads(raw), model
    except json.JSONDecodeError:
        # Even with responseMimeType=json, models occasionally wrap output in fences.
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group(0)), model
        raise LLMCallFailed(f"Could not parse JSON from model output: {raw[:300]}")


def complete_text(system: str, user: str) -> tuple[str, str]:
    if not GEMINI_API_KEY:
        raise LLMNotConfigured("Set GEMINI_API_KEY in .env")
    return _call_gemini(system, user, json_mode=False)
