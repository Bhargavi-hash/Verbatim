"""The 5 real Band agents this app coordinates, matching the roles the user
configured on the Band platform itself (fetched and confirmed via GET
/agent/me for each — see their exact descriptions below):

  intake-conductor   "Runs the mandatory intake question set in fixed order
                       and owns the conversation with the patient. Sole
                       agent permitted to address the patient."
  follow-up-proposer "Proposes additional questions from the
                       clinician-approved bank based on answers so far.
                       Proposes only; never asks directly."
  coverage-tracker   "Tracks which required intake fields remain unanswered
                       and blocks completion until the record is complete."
  red-flag-monitor   "Watches every answer for escalation triggers and halts
                       intake to page a human clinician. Detects and
                       escalates only; gives no advice."
  history-scribe     "Assembles answers into an ordered structured history
                       for clinician review. Records; does not assess."

Division of labor: the Band room is where these 5 agents deliberate with
each other (real messages, real @mentions, observable on app.band.ai) —
it's the audit trail of *how* each turn's decision was reached. The actual
question sent to the patient is decided by this module (playing conductor)
and returned over our normal HTTP API — matching "sole agent permitted to
address the patient": even mechanically, patient-facing text never flows
through the inter-agent room, only the agents' deliberation does.

If Band can't be reached (network issue, band_chat_id missing) every
_safe_* call below logs and continues — the intake still runs correctly
using the same local logic that would have driven the room postings.
"""
import logging
import os
import sys

from backend.pipeline import band_client, extractor, redflag_rules

logger = logging.getLogger("verbatim.agents")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

_agents_cache = None


def get_agents() -> dict:
    """Loads agent_config.yaml via the repo-root loader.py (the user's own
    config loader), keyed by name -> {uuid, api_key, role}. Returns {} if
    not configured, so every caller degrades to local-only gracefully."""
    global _agents_cache
    if _agents_cache is not None:
        return _agents_cache
    try:
        from loader import load_agents
        config_path = os.path.join(REPO_ROOT, "agent_config.yaml")
        raw = load_agents(config_path) if os.path.exists(config_path) else None
        _agents_cache = raw or {}
    except Exception as e:  # noqa: BLE001 - missing config/env vars must not crash the app
        logger.info(f"Band agents not configured, running local-only: {e}")
        _agents_cache = {}
    return _agents_cache


def band_enabled() -> bool:
    agents = get_agents()
    return all(name in agents for name in ("intake-conductor", "follow-up-proposer", "coverage-tracker", "red-flag-monitor", "history-scribe"))


def _safe(fn, *args, **kwargs):
    try:
        return fn(*args, **kwargs)
    except Exception as e:  # noqa: BLE001 - Band being unreachable must never break intake
        logger.warning(f"Band call failed ({fn.__name__}), continuing locally: {e}")
        return None


NAMES = {
    "intake-conductor": "Intake Conductor",
    "follow-up-proposer": "Follow-up Proposer",
    "coverage-tracker": "Coverage Tracker",
    "red-flag-monitor": "Red-flag Monitor",
    "history-scribe": "History Scribe",
}


def start_room() -> str | None:
    """Conductor creates the room and recruits the other 4 agents into it.
    Returns the Band chat_id, or None if Band isn't configured/reachable."""
    if not band_enabled():
        return None
    agents = get_agents()
    conductor = agents["intake-conductor"]
    chat_id = _safe(band_client.create_chat, conductor["api_key"])
    if not chat_id:
        return None
    for name in ("follow-up-proposer", "coverage-tracker", "red-flag-monitor", "history-scribe"):
        _safe(band_client.add_participant, conductor["api_key"], chat_id, agents[name]["uuid"])
    return chat_id


def _relay(chat_id: str, from_role: str, to_role: str, content: str):
    """One agent (from_role) posts a message @mentioning another (to_role)."""
    if not chat_id or not band_enabled():
        return
    agents = get_agents()
    sender = agents[from_role]
    target = agents[to_role]
    _safe(band_client.post_message, sender["api_key"], chat_id, content, target["uuid"], NAMES[to_role], to_role)


BASELINE_QUESTIONS = [
    ("chief_complaint", "What brings you in today?"),
    ("duration", "When did this start, or how long have you had it?"),
    ("severity", "On a scale of zero to ten, how severe is it?"),
    ("current_medications", "Are you currently taking any medications?"),
    ("allergies", "Are you allergic to any medications?"),
]

FOLLOWUP_BANK = {
    "CARDIAC": ["Does the discomfort travel to your arm, neck, or jaw?", "Are you short of breath, sweating, or nauseous along with it?", "Did this happen during activity or at rest?"],
    "RESPIRATORY": ["Do you have a cough? Are you bringing up phlegm?", "Are you short of breath at rest, or only when moving?", "Do you have asthma, COPD, or another lung condition?"],
    "NEURO": ["Have you noticed any vision changes, weakness, or difficulty speaking?", "Did this come on suddenly, or gradually?", "Have you hit your head or fallen recently?"],
    "GI": ["Have you vomited, or seen any blood?", "Have you had diarrhea or constipation?", "When did you last eat?"],
    "MSK_INJURY": ["How did the injury happen?", "Can you move it or bear weight on it?", "Do you see any swelling or deformity?"],
    "INFECTION": ["How high has your fever been, and for how long?", "Have you had any chills or night sweats?", "Have you traveled recently or been around anyone sick?"],
    "GENERAL": ["Have you noticed anything else alongside this?"],
}
MAX_FOLLOWUPS = 2


def opening_question() -> str:
    return BASELINE_QUESTIONS[0][1]


def next_step(transcript: list[dict], chat_id: str | None) -> dict:
    """The core turn decision, run after each patient answer. Returns one of:
      {"done": False, "question": "..."}
      {"done": True, "escalated": True, "reason": "..."}
      {"done": True, "escalated": False, "summary": {...}}
    """
    patient_turns = [t for t in transcript if t.get("who") == "patient"]
    agent_turns = [t for t in transcript if t.get("who") == "agent"]
    last_answer = patient_turns[-1]["text"] if patient_turns else ""

    # 1) Red-flag Monitor — checked first, every turn, can halt immediately.
    rule_hits = redflag_rules.check(transcript)
    if rule_hits:
        reason = "; ".join(rule_hits)
        _relay(chat_id, "intake-conductor", "red-flag-monitor", f"Patient said: {last_answer}")
        _relay(chat_id, "red-flag-monitor", "intake-conductor", f"ESCALATE: {reason}")
        _relay(chat_id, "intake-conductor", "history-scribe", "Escalated — assemble what we have so far for the clinician.")
        summary = extractor.run_pipeline(transcript)
        return {"done": True, "escalated": True, "reason": reason, "summary": summary}

    category = extractor.classify_category(transcript) if patient_turns else "GENERAL"
    asked_so_far = len(agent_turns)

    # 2) Still working through the mandatory baseline set (Conductor's job).
    if asked_so_far < len(BASELINE_QUESTIONS):
        _relay(chat_id, "intake-conductor", "coverage-tracker", f"Answer {asked_so_far}/{len(BASELINE_QUESTIONS)} received.")
        _relay(chat_id, "coverage-tracker", "intake-conductor", f"{len(BASELINE_QUESTIONS) - asked_so_far} mandatory field(s) still unanswered — continue baseline.")
        return {"done": False, "question": BASELINE_QUESTIONS[asked_so_far][1]}

    # 3) Baseline complete — Coverage Tracker + Follow-up Proposer decide
    #    whether more (category-specific) depth is needed.
    followups_asked = asked_so_far - len(BASELINE_QUESTIONS)
    bank = FOLLOWUP_BANK.get(category, FOLLOWUP_BANK["GENERAL"])
    remaining = bank[followups_asked:MAX_FOLLOWUPS]

    _relay(chat_id, "intake-conductor", "coverage-tracker", f"Baseline complete. Category: {category}. Follow-ups asked: {followups_asked}.")

    if remaining:
        proposed = remaining[0]
        _relay(chat_id, "coverage-tracker", "follow-up-proposer", f"Baseline satisfied but category is {category} — propose a follow-up.")
        _relay(chat_id, "follow-up-proposer", "intake-conductor", f"Propose: \"{proposed}\"")
        return {"done": False, "question": proposed}

    # 4) Nothing left to ask — History Scribe assembles the final record.
    _relay(chat_id, "coverage-tracker", "history-scribe", "Record complete — assemble final history.")
    summary = extractor.run_pipeline(transcript)
    _relay(chat_id, "history-scribe", "intake-conductor", f"Assembled: {summary['chief_complaint']} — {summary['condition_category']}, {summary['triage_priority']}.")
    return {"done": True, "escalated": False, "summary": summary}
