"""Append-only, hash-chained audit log. Every clinically-meaningful write goes
through record() — never insert an AuditLogEntry directly elsewhere, or the
chain silently loses coverage for that action.

entry_hash = sha256(prev_hash + canonical(detail_json) + action + entity_id)
so any row edited after the fact breaks the chain from that point forward,
detectable by verify_chain().
"""
import hashlib
import json
from sqlalchemy import desc
from sqlalchemy.orm import Session

from backend.models import AuditLogEntry

GENESIS_HASH = "0" * 64


def _canonical(detail: dict) -> str:
    return json.dumps(detail or {}, sort_keys=True, separators=(",", ":"), default=str)


def _last_hash(db: Session) -> str:
    last = db.query(AuditLogEntry).order_by(desc(AuditLogEntry.id)).first()
    return last.entry_hash if last else GENESIS_HASH


def record(db: Session, *, actor_user_id, action: str, entity_type: str,
           entity_id: str, detail: dict = None) -> AuditLogEntry:
    prev_hash = _last_hash(db)
    payload = f"{prev_hash}|{action}|{entity_type}|{entity_id}|{_canonical(detail)}"
    entry_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()

    entry = AuditLogEntry(
        actor_user_id=actor_user_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        detail_json=detail or {},
        prev_hash=prev_hash,
        entry_hash=entry_hash,
    )
    db.add(entry)
    db.flush()
    return entry


def verify_chain(db: Session) -> dict:
    """Walk the whole log and confirm each entry's hash matches what it should
    be given the previous entry's hash. Returns the first broken link, if any."""
    entries = db.query(AuditLogEntry).order_by(AuditLogEntry.id).all()
    prev_hash = GENESIS_HASH
    for entry in entries:
        payload = f"{prev_hash}|{entry.action}|{entry.entity_type}|{entry.entity_id}|{_canonical(entry.detail_json)}"
        expected = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        if entry.prev_hash != prev_hash or entry.entry_hash != expected:
            return {"valid": False, "broken_at_id": entry.id, "expected_hash": expected, "stored_hash": entry.entry_hash}
        prev_hash = entry.entry_hash
    return {"valid": True, "entries_checked": len(entries)}
