# Making the voice carry — read this before you push

## The problem

The browser's built-in speech uses **whatever voices are installed on the
listener's machine**. On your laptop with premium Spanish voices it sounds good.
On a judge's laptop, or a projector machine, or Windows, it may sound flat,
robotic, or fall back to an English voice reading Spanish. You cannot control
that from a web page.

## The fix: pre-render the narration once, commit the audio

Every line the assistant speaks is **fixed and known in advance** — the greeting,
all 40 questions, the acknowledgements, the red-flag response, the closings.
So render them once with ElevenLabs and ship the MP3s in the repo.

Then the app sounds **identical everywhere**, needs **no API key** from anyone
opening it, and cannot fail live because there is no network call during the demo.

### One-time setup (about 3 minutes, ~4,200 characters of credit)

```bash
cd voice_demo

export ELEVENLABS_API_KEY=sk_your_key_here
export ELEVENLABS_VOICE_ID=your_voice_id      # from your ElevenLabs voice library

python3 tools/generate_voice.py
```

Pick a **Spanish-speaking voice** in your ElevenLabs library and copy its Voice ID.
The script writes `audio/<id>.mp3` for each of the 54 lines, skipping any that
already exist, so you can re-run it safely if something fails.

Then commit the `audio/` folder:

```bash
git add audio/ voice_lines.json tools/generate_voice.py
git commit -m "Add pre-rendered Spanish narration"
git push
```

> The API key lives only in your shell environment. It is never written to a file
> and never committed. Do not paste it into any file in this repo.

## How the app decides what to play

Three tiers, tried in order, automatically:

1. **`audio/<id>.mp3`** — pre-rendered studio narration. Best quality, works offline,
   identical on every machine.
2. **Live ElevenLabs** — only if someone ticks the box and enters a key at runtime.
3. **Browser speech** — always available, quality varies by machine.

If the `audio/` folder is missing, the app silently drops to tier 3 and still works.
Nothing breaks; it just sounds less polished.

## What is *not* pre-rendered

The read-back confirmation ("Permítame confirmar que entendí correctamente… ¿Es
correcto?") includes the patient's own answers, so it is generated fresh each time
and uses the browser voice. Everything else is pre-rendered.

If you want that line polished too, tick the ElevenLabs box during your demo — the
app uses clips for the fixed lines and live synthesis only for that one dynamic line.

## Checklist before you push

- [ ] `python3 tools/generate_voice.py` completed with `failed=0`
- [ ] `audio/` contains 54 `.mp3` files
- [ ] Open the page and confirm the greeting plays in the ElevenLabs voice
- [ ] `.env` and your API key are **not** in the repo (`git status` is clean of them)
- [ ] Test once on a second device / browser to confirm the voice carries
