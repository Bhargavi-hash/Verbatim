# Verbatim - Patient-Driven, Compliance-Grade Intake

> Speak your symptoms in your own language. FirstWord's avatar asks clarifying
> questions, structures the conversation into a clinician-ready intake, flags
> urgent symptoms, and writes it to Epic — with an audit trail proving the record
> matches the patient's own words.

**Built at the Prompt-Driven Development Hackathon — [DATE].**

---

## Problem
High-volume hospitals lose enormous clinician time to manual intake, and patients
who don't speak English face dangerous triage delays waiting for interpreters.
Existing ambient-AI scribes automate the *doctor's* note — nobody captures the
*patient's* own words at the front door, and none are built compliance-first.

## Target User
Front-line clinical and intake staff in high-volume settings (ERs, urgent care),
and the non-English-speaking patients they serve. Secondary: hospital quality and
compliance teams who must validate any AI touching the record.

## What It Does
1. Patient speaks symptoms in Spanish to a conversational avatar that asks
   clarifying questions (one at a time).
2. The conversation is transcribed, translated, and structured into intake fields.
3. Urgent "red-flag" symptoms are triaged and surfaced to the clinician.
4. The clinician reviews (original + English side by side), e-signs (21 CFR Part 11),
   and the record writes to the Epic FHIR sandbox.
5. Every step is logged to an immutable, ALCOA+ audit trail with source-word traceability.

## Architecture
\`\`\`
Patient (Spanish voice)
   -> voice_agent   (ElevenLabs Conversational AI)
   -> structurer    (translate -> structured JSON + red-flag triage + fidelity trace)
   -> review_ui     (clinician review + Part 11 e-signature)
   -> fhir_writer   (Epic FHIR sandbox, synthetic patient)
   -> audit_log     (mem0 immutable ALCOA+ trail)
\`\`\`
Each module is defined by a PDD \`.prompt\` file (see \`/prompts\`) — prompts are the
source of truth; code is generated. See \`PDD_EVIDENCE.md\` for the mapping.

## Setup
\`\`\`bash
# 1. Clone
git clone [YOUR_REPO_URL] && cd firstword

# 2. Install PDD + deps
uv tool install pdd-cli
pdd setup
source ~/.pdd/api-env.zsh

# 3. Environment variables (create a .env — DO NOT commit real keys)
ELEVENLABS_API_KEY=...
ELEVENLABS_AGENT_ID=...
EPIC_FHIR_CLIENT_ID=...        # Epic sandbox
MEM0_API_KEY=...
\`\`\`

## Run / Test
\`\`\`bash
# Generate all modules from prompts
pdd --force sync

# Or build one module + its tests
pdd --force sync structurer

# Run the app locally
[YOUR RUN COMMAND, e.g. npm run dev]

# Run tests
[YOUR TEST COMMAND, e.g. pytest]
\`\`\`

## What We Built Today
- [ ] Spanish conversational intake avatar (ElevenLabs)
- [ ] Transcript -> structured intake JSON with red-flag triage
- [ ] Fidelity trace (each field links to the patient's actual words)
- [ ] Clinician review UI + Part 11 e-signature
- [ ] Epic FHIR sandbox write (synthetic patient)
- [ ] ALCOA+ audit trail (mem0)
> Update these to reflect what actually shipped — honesty scores better than overclaiming.

## Known Limitations
- Uses **synthetic Epic sandbox data only** — not for real PHI; this is a compliance
  *controls* demonstration, not a production HIPAA deployment.
- [Spanish only so far / other languages not yet tested]
- [Red-flag rubric covers a starter set of emergencies, not exhaustive]
- [Add anything unfinished — the judges explicitly reward honest limitations]

## Disclosures
Third-party / licensed materials used: ElevenLabs (API), Epic on FHIR sandbox,
mem0, [others]. All used under their respective terms; no proprietary or
improperly licensed materials included. All work completed today; git history reflects it.

## Track Selections
- [ ] Best of ElevenLabs
- [ ] Social Media track
- [ ] [Render / Next.js / other — check the boxes that apply]
