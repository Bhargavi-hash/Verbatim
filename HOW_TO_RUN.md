# Verbatim — How to Run

`verbatim_ui.html` is the app. One file, no build step, no server-side code.

---

## Run it

The microphone will **not** work if you double-click the file — browsers block mic
access on `file://`. You need `localhost` or `https`.

```bash
cd app
python3 -m http.server 8000
```

Open **http://localhost:8000/verbatim_ui.html** in Chrome.

Or just use the GitHub Pages URL, which is `https` and therefore works directly.

> No microphone? Type answers into the box instead — the flow is identical.
> Click **🔧 Probar micrófono** for a diagnosis if it misbehaves.

---

## What it does

1. **Speak naturally.** The patient says why they came, in Spanish.
2. **Automatic specialty routing.** The opening complaint selects one of seven
   question sets — pulmonology, cardiology, neurology, gastroenterology,
   orthopedics, infectious disease, or general medicine. Different complaint,
   different questions.
3. **Red-flag detection with negation handling.** "No es el peor dolor de cabeza
   de mi vida" does *not* escalate; "se me va al brazo izquierdo" does.
4. **Answer validation.** Each response is checked against the form expected for
   that question (a 0–10 rating, a yes/no, a duration) and against transcription
   quality. Mismatches are flagged for the patient to correct.
5. **Correction without restarting.** Click any patient response to edit it, or
   press 🎤 Regrabar to say it again. Corrections re-evaluate safety and can
   re-route the questions.
6. **Read-back confirmation**, then a formatted clinical report.

---

## Outputs

| Button | What you get |
|---|---|
| **📄 Abrir informe clínico** | Opens a formatted report in a new tab, with a **Download PDF** button (uses the browser print dialog). Marked **UNSIGNED** pending physician review, with signature fields. |
| **📋 Audit trail (.txt)** | Plain-text ALCOA+ audit trail. |

Both include the bilingual conversation, physician summary, referral, flagged
responses, text edits with before/after, field-level traceability, and a SHA-256
record hash.

---

## Files

| File | Purpose |
|---|---|
| `verbatim_ui.html` | The whole app |
| `avatar_female.png` | Dra. Elena (must sit beside the HTML) |
| `voice_lines.json` | The 54 fixed narration lines |
| `tools/generate_voice.py` | One-time script to pre-render narration audio |
| `audio/*.mp3` | Pre-rendered narration (optional — see VOICE_SETUP.md) |

---

## Voice quality

Browser speech varies by machine. To make the voice sound identical everywhere,
pre-render the narration once with ElevenLabs and commit the audio — see
**VOICE_SETUP.md**. The app falls back to browser speech if `audio/` is absent.

---

## Try this in the demo

- `"Tengo asma y me cuesta respirar por la noche"` → routes to **pulmonology**
- `"Me torcí el tobillo"` → routes to **orthopedics** (watch the form change shape)
- Say something the mic will mangle → watch it get **flagged for review**
- Answer the medication question with `"Tomo lisinopril"` → an **inferred**
  condition appears, tagged as not stated by the patient

---

## Honest limitations

- Synthetic/test data only. Not a HIPAA-compliant deployment.
- Triage routing and red-flag rules are illustrative and **not clinically validated**.
- English is a machine translation of a Spanish authoritative record; low-confidence
  translations are labelled with a coverage score.
