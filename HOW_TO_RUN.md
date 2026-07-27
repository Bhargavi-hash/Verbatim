# Verbatim — How to Run It

A real backend now sits behind the frontend: FastAPI + SQLite, real login for
patients and doctors, an LLM-backed intake pipeline, a hash-chained audit
log, and an LLM evaluation framework. The frontend is unchanged in spirit —
same pages, same flow — but its data comes from the API now, not
`localStorage` or hardcoded JS.

## 1. Install dependencies

```bash
pip install -r requirements.txt
```

## 2. Configure secrets (optional but recommended)

Create/edit `.env` in the repo root:

```bash
# Get one at https://aistudio.google.com/apikey (free tier available).
# Without it, the pipeline falls back to a deterministic (Spanish/English-only)
# extractor, clearly labeled as such wherever its output shows up — the app
# still works, it just can't really understand arbitrary languages or
# translate summaries on request without this key.
GEMINI_API_KEY=...

JWT_SECRET=some-random-string   # optional, defaults to a dev value
```

### BAND — 5 coordinating agents (fully optional — the app works completely without it)

The intake conversation is driven by 5 real agents registered on Band.ai,
each with its own identity and API key, each doing one job:

| Agent name           | Role |
|-----------------------|------|
| `intake-conductor`    | Runs the mandatory question set in fixed order; the only agent that ever addresses the patient. |
| `follow-up-proposer`  | Proposes extra questions from an approved bank once the baseline is answered, based on the patient's category (cardiac, respiratory, etc). |
| `coverage-tracker`    | Tracks which required fields are still unanswered and blocks completion until the record is complete. |
| `red-flag-monitor`    | Watches every answer for escalation triggers and halts the intake to page a clinician — detects only, never advises. |
| `history-scribe`      | Assembles the final structured history for clinician review once nothing's left to ask. |

Each turn, our backend (`backend/pipeline/agents.py`) computes what each of
these 5 roles would decide, and **posts that deliberation as real messages,
under each agent's real identity, into a real Band chat room** — so the room
on app.band.ai is a genuine, observable audit trail of how each question was
chosen, not a mock. The actual computation happens synchronously in our one
backend process (a persistent always-on listener per agent, as Band's SDK
normally expects, isn't practical for a request/response web backend); what's
real is the Band room and its messages, not 5 independently-running services.
If Band is unreachable, the intake still runs correctly on the same local
logic that would have driven the room postings — it just isn't posted anywhere.

Setup:
1. On **https://app.band.ai/agents**, create 5 Remote Agents named
   `intake-conductor`, `follow-up-proposer`, `coverage-tracker`,
   `red-flag-monitor`, `history-scribe` (or any names — the config below maps
   your own names to ours). Copy each one's **Agent UUID** and **API Key**.
2. Put the 10 values in `.env` (gitignored), e.g.:
   ```bash
   BAND_CONDUCTOR_UUID=...
   BAND_CONDUCTOR_KEY=...
   BAND_PROPOSER_UUID=...
   BAND_PROPOSER_KEY=...
   BAND_COVERAGE_UUID=...
   BAND_COVERAGE_KEY=...
   BAND_REDFLAG_UUID=...
   BAND_REDFLAG_KEY=...
   BAND_SCRIBE_UUID=...
   BAND_SCRIBE_KEY=...
   ```
3. `agent_config.yaml` in the repo root (already in this repo) maps those env
   vars onto the 5 role names the backend expects:
   ```yaml
   agents:
     intake-conductor:
       uuid: ${BAND_CONDUCTOR_UUID}
       api_key: ${BAND_CONDUCTOR_KEY}
       role: conductor
     follow-up-proposer:
       uuid: ${BAND_PROPOSER_UUID}
       api_key: ${BAND_PROPOSER_KEY}
       role: proposer
     coverage-tracker:
       uuid: ${BAND_COVERAGE_UUID}
       api_key: ${BAND_COVERAGE_KEY}
       role: tracker
     red-flag-monitor:
       uuid: ${BAND_REDFLAG_UUID}
       api_key: ${BAND_REDFLAG_KEY}
       role: monitor
     history-scribe:
       uuid: ${BAND_SCRIBE_UUID}
       api_key: ${BAND_SCRIBE_KEY}
       role: scribe
   ```
   It's loaded by the repo-root `loader.py`, which does the `${VAR}`
   substitution against `.env` via `load_agents()`.

Skip all of this and the app runs identically: `agents.band_enabled()`
returns `False` whenever any of the 5 aren't configured, and every Band call
in `agents.py` is wrapped so a network failure or missing config just logs
and continues locally — nothing about the intake flow depends on Band being
reachable.

## 3. Seed demo data

```bash
python -m backend.seed
```

Creates two accounts and three historical visits (one approved, one
rejected with a follow-up, one left pending as an always-available demo
case for the doctor queue):

- **Patient:** `maria@example.com` / `patient123`
- **Doctor:** `doctor@example.com` / `doctor123`

Safe to re-run — no-ops if already seeded.

## 4. Run the server

```bash
uvicorn backend.main:app --reload
```

Open **http://localhost:8000/frontend/pages/login.html** — sign in as
Patient or Doctor (toggle at the top), or register a new account. The
patient flow: Appointments → Start Intake → pick a language (14 available,
not just Spanish/English) → have the conversation, one question at a time,
each one decided turn-by-turn by the 5 Band agents (or the equivalent local
logic if Band isn't configured) → on completion (or an immediate red-flag
escalation) it lands in the doctor's queue. The doctor flow: Review Queue →
open a pending case → flag anything questionable → approve or reject with a
follow-up → it's signed, logged, and the patient gets a notification.

## 5. Run the eval framework

```bash
python -m eval.run_eval
```

Replays `eval/golden_dataset.json` (8 synthetic cases across categories and
languages, including red-flag cases) through the real pipeline and checks
the output against expected category/priority/emergency-flag. Without
`GEMINI_API_KEY` configured, the non-Spanish/English cases are *expected* to
fail — that's the eval framework doing its job: proving exactly where the
deterministic fallback's coverage ends.

## Notes on what's real vs. simulated

- **Real**: auth, database, patient/doctor profiles, appointments,
  conversations (stored both in SQLite and as raw JSON files under
  `backend/data/conversations/`), the review/approve/reject workflow,
  notifications, and the audit log (SHA-256 hash-chained — verify with
  `GET /api/audit/verify` as a doctor, or tamper with a row and watch it
  fail).
- **Real, conditional on a key**: the LLM extraction/triage/summarization
  pipeline (Gemini). Without a key it still runs, using a labeled
  deterministic fallback (ES/EN keyword-based) so the whole app stays
  demoable — the UI shows a visible warning banner whenever fallback output
  is on screen, so it's never mistaken for a real translation.
- **Real**: the BAND integration itself (`backend/pipeline/band_client.py`,
  `backend/pipeline/agents.py`) — no SDK (not installable in the sandbox
  this was built in), but raw HTTPS calls to Band's documented Agent REST
  API (`https://app.band.ai/api/v1/agent`), verified against the live API
  with real credentials: creating a chat room, adding the other 4 agents as
  participants, and posting `@mention`ed messages between them under each
  agent's own identity. What's *not* literally true to Band's normal usage
  pattern: each agent isn't a separately-running always-on listener process
  (Band's SDK model); our one backend computes all 5 agents' "opinions" and
  posts them into the real room on their behalf. See the BAND setup section
  above for the full explanation.
