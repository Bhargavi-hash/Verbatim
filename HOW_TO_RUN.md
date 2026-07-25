# Verbatim Voice Avatar — How to Run It

You don't need ElevenLabs, an API key, or any credits for this. Every browser
already has speech-to-text and text-to-speech built in. This uses those.

---

## The three pieces (what you're actually building)

Any voice assistant is these three things in a loop:

| Piece | What it does | What we use |
|---|---|---|
| **1. Ears (STT)** | Turns the patient's speech into text | Browser Web Speech API — free |
| **2. Brain** | Decides what to ask next | Rule-based engine using your intake templates |
| **3. Mouth (TTS)** | Speaks the response out loud | Browser SpeechSynthesis — free |

ElevenLabs bundles all three and charges credits. We're using the free parts your
browser already ships with. The trade-off: the voice is more robotic. Everything
else works the same.

**Why the "brain" is rules and not an LLM:** for structured intake, the questions
are already determined by the condition category. You don't need a model to decide
what to ask next — you need it to *classify the opening complaint*, and keyword
matching handles that well enough to demo. Fewer moving parts, nothing to time out
on stage, no cost.

---

## Run it — 3 steps

### Step 1 — Find the file
`frontend/pages/verbatim_voice.html` is the whole app. Its CSS and JS live
alongside it in `frontend/css/` and `frontend/js/`. Nothing to install.

### Step 2 — Start a tiny local web server
The microphone will NOT work if you just double-click the file. Browsers block mic
access on `file://` for security. You need `localhost`. Open Terminal and run:

```bash
cd /path/to/the/repo/root
python3 -m http.server 8000
```

(If that errors, try `python -m http.server 8000`.)

### Step 3 — Open it in Chrome
Go to: **http://localhost:8000/frontend/pages/login.html**

Sign in with anything (it's a dummy login, no real auth) and it forwards you to
the appointments list. Click **Start Intake** on any appointment to land on
**verbatim_voice.html**. You can also open any of the three pages directly if
you want to skip ahead:
- `frontend/pages/login.html` → dummy sign-in
- `frontend/pages/appointment.html` → appointment list, "Start Intake" button
- `frontend/pages/verbatim_voice.html` → the voice intake app itself

Click **Empezar**. The avatar greets you in Spanish. Click **🎤 Hablar** and answer.
Chrome will ask permission for the microphone — click Allow.

> **No microphone, or it's being difficult?** Type your answers into the text box
> instead and press Enter. The flow is identical — you can demo the whole thing
> without a mic. Have this as your backup.

---

## What to say to see it work

Try this exact sequence to see condition routing AND the red flag:

1. **"Me duele mucho el pecho"** → routes to CARDIAC, asks cardiac questions
2. Answer a couple of questions normally
3. **"El dolor se me va al brazo izquierdo"** → red flag fires, EMERGENT alert

Then hit **Reiniciar** and try a completely different one:

1. **"Me torcí el tobillo cuando me caí"** → routes to MSK_INJURY

Watch the form on the bottom change shape between the two runs — different
questions, different fields, different priority. **That side-by-side is your demo.**

Also try: `"Tengo fiebre desde ayer"` (INFECTION), `"No puedo respirar bien"`
(RESPIRATORY), `"Me duele el estómago"` (GI).

---

## The detail worth pointing at in your pitch

When you answer the medications question with something like
**"Tomo lisinopril para la presión"**, watch the form add:

> Hipertensión (deducida del medicamento) — *(inferido)*

Marked in orange, labeled inferred. The patient never said "I have hypertension" —
the system worked it out from the medication, **and it tells you so.** That's your
fidelity story, running live.

---

## How this fits the rest of the project

This is a working fallback for the `voice_agent` module. Two ways to use it:

- **Plan A:** ElevenLabs Conversational AI (better voice, uses credits)
- **Plan B:** this (free, always works, never fails on stage)

Smart move: build with Plan B so you're not burning credits every test run, then
swap in ElevenLabs for the final demo if credits and time allow. Keep this file
deployed as your safety net either way.

To connect it to the rest of the pipeline, the conversation state object
(`state.turns` and `state.data`) is exactly the shape your `structurer` module
expects — transcript plus filled fields.

---

## Honest limitation for the README

> The conversation engine uses keyword-based condition routing and red-flag
> detection. This is a one-day prototype: the keyword lists are illustrative,
> not clinically validated, and would miss phrasings a real system must catch.
> Production would require an LLM classifier plus clinician-reviewed triage rules.
