#!/usr/bin/env python3
"""
Verbatim — pre-render the assistant's narration to audio files.

Run this ONCE. It reads frontend/pages/voice_lines.json, calls ElevenLabs,
and writes frontend/pages/audio/<id>.mp3 for every line — that's where
verbatim_ui.html looks for clips (it fetches "audio/<id>.mp3" relative to
its own location). Commit the audio/ folder to the repo.

After that the app sounds identical on every machine — no API key needed
by anyone who opens it, and nothing to fail live on stage. If a clip is
missing, verbatim_ui.js falls back to live ElevenLabs (if configured) and
then to the browser's built-in speech synthesis, so this step is optional.

Usage:
    export ELEVENLABS_API_KEY=sk_...
    export ELEVENLABS_VOICE_ID=<voice id from your ElevenLabs library>
    python3 tools/generate_voice.py

The key is read from the environment and never written to disk.
"""
import json, os, sys, time, urllib.request, urllib.error, hashlib

API_KEY  = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID")
MODEL    = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(REPO_ROOT, "frontend", "pages")
LINES = os.path.join(PAGES_DIR, "voice_lines.json")
OUT   = os.path.join(PAGES_DIR, "audio")

def die(msg):
    print("ERROR: " + msg); sys.exit(1)

if not API_KEY:  die("set ELEVENLABS_API_KEY")
if not VOICE_ID: die("set ELEVENLABS_VOICE_ID (copy it from your ElevenLabs voice library)")
if not os.path.exists(LINES):
    die(f"no {LINES} found — create it first (see frontend/js/verbatim_ui.js for the lineId() hash used to key each entry)")

with open(LINES, encoding="utf-8") as f:
    data = json.load(f)
lines = data["lines"]
os.makedirs(OUT, exist_ok=True)

total = len(lines)
made = skipped = failed = 0
print(f"Rendering {total} lines with voice {VOICE_ID} ({MODEL})\n")

for i, ln in enumerate(lines, 1):
    path = os.path.join(OUT, ln["id"] + ".mp3")
    if os.path.exists(path) and os.path.getsize(path) > 0:
        skipped += 1
        print(f"[{i:>3}/{total}] skip  {ln['id']}  {ln['text'][:52]}")
        continue

    body = json.dumps({
        "text": ln["text"],
        "model_id": MODEL,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.2},
    }).encode("utf-8")

    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        data=body,
        headers={"xi-api-key": API_KEY, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            audio = r.read()
        with open(path, "wb") as f:
            f.write(audio)
        made += 1
        print(f"[{i:>3}/{total}] OK    {ln['id']}  {ln['text'][:52]}")
        time.sleep(0.35)                      # be gentle with rate limits
    except urllib.error.HTTPError as e:
        failed += 1
        print(f"[{i:>3}/{total}] FAIL  {e.code} {e.read()[:160]!r}")
        if e.code in (401, 403):
            die("authentication failed — check ELEVENLABS_API_KEY")
        if e.code == 429:
            print("       rate limited — waiting 10s"); time.sleep(10)
    except Exception as e:
        failed += 1
        print(f"[{i:>3}/{total}] FAIL  {e}")

print(f"\nDone.  rendered={made}  skipped={skipped}  failed={failed}")
print(f"Audio written to: {OUT}")
if failed:
    print("Re-run to retry the failed lines (existing files are skipped).")
else:
    print("Commit the audio/ folder — the app will use it automatically.")
