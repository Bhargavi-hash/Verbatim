"""Direct REST calls to the Band Agent API — no SDK needed (band-sdk isn't
installable in this sandbox, same story as Gemini in llm_client.py, but raw
HTTPS to app.band.ai works fine and every shape below was verified against
the real API with the credentials in .env, not guessed from docs alone).

Each of our 5 agents (conductor/proposer/tracker/monitor/scribe) has its own
identity and api_key (see loader.py + agent_config.yaml). Auth is per-agent:
every call below is made "as" whichever agent's api_key you pass in, which
is how a message ends up posted under that agent's real name in the room.
"""
import logging

import requests

logger = logging.getLogger("verbatim.band_client")

BASE_URL = "https://app.band.ai/api/v1/agent"
TIMEOUT = 15


class BandError(Exception):
    pass


def _headers(api_key: str) -> dict:
    return {"X-API-Key": api_key, "Content-Type": "application/json"}


def create_chat(api_key: str) -> str:
    """Creates a new room ('chat'). Returns its id."""
    r = requests.post(f"{BASE_URL}/chats", headers=_headers(api_key), json={"chat": {}}, timeout=TIMEOUT)
    if not r.ok:
        raise BandError(f"create_chat {r.status_code}: {r.text[:300]}")
    return r.json()["data"]["id"]


def add_participant(api_key: str, chat_id: str, participant_uuid: str) -> None:
    """Adds another agent (by its Band UUID) to a room the caller owns."""
    r = requests.post(
        f"{BASE_URL}/chats/{chat_id}/participants",
        headers=_headers(api_key),
        json={"participant": {"participant_id": participant_uuid}},
        timeout=TIMEOUT,
    )
    if not r.ok:
        raise BandError(f"add_participant {r.status_code}: {r.text[:300]}")


def post_message(api_key: str, chat_id: str, content: str, mention_uuid: str, mention_name: str, mention_handle: str) -> str:
    """Posts a message in the room, @mentioning one other agent. Returns the
    message id. Band rewrites `content` server-side to embed the mention
    markup; what you pass is just the human-readable text."""
    body = {
        "message": {
            "content": content,
            "mentions": [{"id": mention_uuid, "name": mention_name, "handle": mention_handle}],
        }
    }
    r = requests.post(f"{BASE_URL}/chats/{chat_id}/messages", headers=_headers(api_key), json=body, timeout=TIMEOUT)
    if not r.ok:
        raise BandError(f"post_message {r.status_code}: {r.text[:300]}")
    return r.json()["data"]["id"]


def mark_processing(api_key: str, chat_id: str, message_id: str) -> None:
    r = requests.post(f"{BASE_URL}/chats/{chat_id}/messages/{message_id}/processing", headers=_headers(api_key), timeout=TIMEOUT)
    if not r.ok:
        raise BandError(f"mark_processing {r.status_code}: {r.text[:300]}")


def mark_processed(api_key: str, chat_id: str, message_id: str) -> None:
    r = requests.post(f"{BASE_URL}/chats/{chat_id}/messages/{message_id}/processed", headers=_headers(api_key), timeout=TIMEOUT)
    if not r.ok:
        raise BandError(f"mark_processed {r.status_code}: {r.text[:300]}")
