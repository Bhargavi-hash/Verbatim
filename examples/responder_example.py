"""Minimal usage demo for src/responder.py. Pure logic, no external
dependencies — runs as-is."""
from src.responder import next_turn

state = {
    "transcript": [],
    "intake": {"triage_priority": "EMERGENT"},
}
print(next_turn(state))

state["intake"]["chief_complaint"] = {"value": "Chest pain"}
print(next_turn(state))
