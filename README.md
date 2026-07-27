# Verbatim

Verbatim is a multilingual patient-intake assistant that turns a spoken or
typed conversation into a structured physician summary — triaged, referred,
and queued for a licensed clinician to review, flag, and sign before it ever
becomes part of the record.

A patient picks their language, has a natural back-and-forth with the intake
assistant (voice or typed), and the conversation is turned into a chief
complaint, symptoms, triage priority, and referral — with any red-flag
answer halting the intake immediately for urgent review. The doctor sees the
same summary in their own language, can flag specific fields, and
approves or rejects with a follow-up message that notifies the patient.

## What's in the box

- **Real backend** — FastAPI + SQLAlchemy + SQLite, bcrypt-hashed passwords,
  JWT sessions in an httpOnly cookie. No `localStorage`, no hardcoded demo
  data at runtime.
- **A turn-based intake pipeline coordinated by 5 Band.ai agents** —
  `intake-conductor`, `follow-up-proposer`, `coverage-tracker`,
  `red-flag-monitor`, `history-scribe` — each with a real Band identity,
  deliberating in a real Band chat room as the conversation happens. Runs
  identically without Band configured, using the same logic locally.
- **An LLM pipeline (Gemini)** for classification, structured extraction,
  triage, referral drafting, and on-demand translation — with a labeled,
  deterministic (keyword-based) fallback so the app is fully demoable
  without an API key, and a red-flag safety net that runs independently of
  the LLM so emergency detection never depends on model judgment alone.
- **A tamper-evident audit log** — every clinically meaningful action is
  hash-chained (`entry_hash = sha256(prev_hash + action + entity + detail)`),
  independently verifiable via `GET /api/audit/verify`.
- **An LLM evaluation framework** (`eval/`) — scores the pipeline's output
  against a golden dataset on completeness, groundedness, and red-flag
  recall/precision, both offline (`run_eval.py`) and online (one QA score
  per real conversation).
- **A frontend styled after Apple's Human Interface Guidelines** — systemBlue
  accent, translucent navbar, segmented controls, tinted buttons, SF
  Symbols-style inline icons, full light/dark parity, and an iMessage-style
  chat transcript for the intake conversation.

## Quick start

```bash
pip install -r requirements.txt
python -m backend.seed              # seeds demo patient + doctor accounts
uvicorn backend.main:app --reload
```

Open **http://localhost:8000** (redirects to the login page) and sign in as:

- **Patient:** `maria@example.com` / `patient123`
- **Doctor:** `doctor@example.com` / `doctor123`

Both the LLM pipeline and the Band agent integration are **fully optional**
— the app runs completely without either, using clearly labeled
deterministic fallbacks. See **[HOW_TO_RUN.md](HOW_TO_RUN.md)** for the full
setup walkthrough, including how to wire up a `GEMINI_API_KEY` and the 5
Band agent credentials.

## How a visit flows

1. **Patient** opens an appointment → *Start Intake* → picks a language.
2. Each question is decided turn-by-turn by the 5 Band agents (or the
   equivalent local logic): a fixed baseline set first, then category-specific
   follow-ups (cardiac, respiratory, neuro, GI, MSK, infection…), capped at 2.
3. Any red-flag answer (chest pain radiating to the arm, syncope, thunderclap
   headache, etc.) halts the intake immediately and escalates — the
   deterministic check and the LLM's own triage are cross-checked, and any
   disagreement is logged rather than silently dropped.
4. On completion, `history-scribe` assembles the structured summary, a raw
   transcript is written to `backend/data/conversations/`, and a pending
   review lands in the doctor's queue.
5. **Doctor** opens the review, optionally views it translated into their own
   preferred language, flags anything questionable, and approves or rejects
   with a follow-up message — which signs the record (21 CFR Part 11-style
   signature fields), notifies the patient, and appends to the audit log.

## Project layout

```
backend/
  main.py               FastAPI app: route registration, static frontend mount
  models.py              SQLAlchemy models (User, Conversation, PhysicianSummary,
                          Review, Notification, AuditLogEntry, EvalRun, …)
  auth.py                bcrypt hashing, JWT issue/verify, role-guard dependency
  audit.py                hash-chained audit log writer + chain verifier
  seed.py                 seeds demo accounts + sample visit history
  routes/                 /api/auth, /api/appointments, /api/conversations,
                          /api/reviews, /api/notifications, /api/audit
  pipeline/
    agents.py             the 5-agent turn-based intake orchestration
    band_client.py         raw REST wrapper for Band's Agent API
    llm_client.py          Gemini wrapper (raw HTTPS, no SDK)
    extractor.py            classification, extraction, triage, referral, translation
    redflag_rules.py        deterministic red-flag safety net
eval/
  golden_dataset.json     synthetic multi-category, multi-language test cases
  rubric.py                LLM-as-judge scoring (completeness/groundedness/clarity)
  run_eval.py              replays the golden dataset through the real pipeline
frontend/
  pages/                  login, appointments, appointment detail, doctor
                          dashboard/review, intake conversation
  css/                    common.css (shared design system) + one stylesheet
                          per page
  js/                     icons.js (shared icon set) + one script per page/component
agent_config.yaml         Band agent identities (uuid/api_key/role), env-substituted
loader.py                 loads agent_config.yaml against .env
```

## API surface

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `/login`, `/logout`, `GET /api/auth/me` |
| Appointments | `GET /api/appointments`, `GET /api/appointments/{id}` |
| Conversations | `POST /api/conversations/start`, `POST /api/conversations/{id}/turn`, legacy bulk `POST /api/conversations` |
| Reviews | `GET /api/reviews`, `GET /api/reviews/{id}`, `POST /api/reviews/{id}/decide` |
| Notifications | `GET /api/notifications`, `POST /api/notifications/mark-read` |
| Audit | `GET /api/audit/verify` |

## Running the eval suite

```bash
python -m eval.run_eval
```

Replays 8 synthetic, multi-language, multi-category transcripts (including
red-flag cases) through the real pipeline and reports completeness,
groundedness, clarity, and red-flag recall/precision against expected
values. Without `GEMINI_API_KEY`, non-Spanish/English cases are *expected*
to fail — that's the eval catching exactly where the deterministic
fallback's coverage ends.

## Notes on what's real vs. simulated

- **Real**: auth, database, appointments, conversations (stored in SQLite
  *and* as raw JSON files), the review/approve/reject workflow,
  notifications, and the hash-chained audit log.
- **Real, conditional on a key**: the Gemini-backed LLM pipeline. Without a
  key it still runs on a labeled deterministic fallback (ES/EN
  keyword-based) so the app stays fully demoable.
- **Real**: the Band integration — raw HTTPS calls to Band's documented
  Agent REST API, verified against the live API with real credentials
  (creating a room, adding participants, posting `@mention`ed messages
  under each agent's own identity). The one simplification: our single
  backend computes what each of the 5 agents would decide and posts it on
  their behalf, rather than running 5 independently-listening services —
  see [HOW_TO_RUN.md](HOW_TO_RUN.md) for the full rationale.

This is a prototype: every summary is reviewed and signed by a licensed
clinician before it's treated as part of the record, and the UI says so.
