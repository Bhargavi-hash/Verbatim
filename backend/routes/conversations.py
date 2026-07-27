import json
import os
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend import audit
from backend.auth import get_current_user
from backend.db import get_db
from backend.models import Appointment, Conversation, PhysicianSummary, Review, User
from backend.pipeline import agents, extractor
from backend.pipeline.band_agent import run_pipeline

router = APIRouter(prefix="/api/conversations", tags=["conversations"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "backend", "data", "conversations")


def _new_session_id() -> str:
    import uuid
    return "VB-" + uuid.uuid4().hex[:10].upper()


def _finalize(db: Session, convo: Conversation, appt: Appointment | None, summary_data: dict, user: User) -> Review:
    """Shared by both the turn-based flow and the legacy bulk endpoint: write
    the raw transcript file, create PhysicianSummary + pending Review, flip
    the appointment to completed, and record the audit entry."""
    os.makedirs(DATA_DIR, exist_ok=True)
    raw_path = os.path.join(DATA_DIR, f"{convo.session_id}.json")
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump({"session_id": convo.session_id, "language": convo.language, "transcript": convo.transcript_json}, f, ensure_ascii=False, indent=2)
    convo.raw_file_path = raw_path
    convo.completed_at = datetime.now(timezone.utc)
    convo.capture_method = "speech (Web Speech API)" if convo.used_mic_any else "typed entry"

    if appt:
        appt.status = "completed"
        appt.scheduled_at = convo.started_at

    summary = PhysicianSummary(
        conversation_id=convo.id,
        chief_complaint=summary_data["chief_complaint"], duration=summary_data["duration"],
        severity=summary_data["severity"], symptoms_json=summary_data["symptoms"],
        medical_history_json=summary_data["medical_history"], medication_json=summary_data["medication"],
        allergy=summary_data["allergy"], condition_category=summary_data["condition_category"],
        triage_priority=summary_data["triage_priority"], emergency_flag=summary_data["emergency_flag"],
        referral_specialist=summary_data["referral_specialist"], referral_reasons_json=summary_data["referral_reasons"],
        referral_status=summary_data["referral_status"], clinical_safety_note=summary_data["clinical_safety_note"],
        model_used=summary_data["model_used"], qa_score_json=summary_data.get("qa_score"),
        redflag_disagreement=summary_data.get("redflag_disagreement", False),
    )
    db.add(summary)
    db.flush()

    review = Review(conversation_id=convo.id, summary_id=summary.id, status="pending")
    db.add(review)
    db.flush()

    audit.record(db, actor_user_id=user.id, action="conversation.submitted", entity_type="conversation",
                entity_id=convo.id, detail={"session_id": convo.session_id, "language": convo.language,
                                             "model_used": summary_data["model_used"],
                                             "band_chat_id": convo.band_chat_id,
                                             "redflag_disagreement": summary_data.get("redflag_disagreement", False)})
    return review


# ============================= turn-based flow =============================
# Used by verbatim_ui.js. Each turn asks the 5 Band agents (conductor,
# proposer, tracker, monitor, scribe — see backend/pipeline/agents.py) to
# decide the next question, rather than the frontend working through a fixed
# local list.

class StartBody(BaseModel):
    appointment_id: str | None = None
    language: str


@router.post("/start")
def start_conversation(body: StartBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients start intake conversations")

    appt = None
    if body.appointment_id:
        appt = db.query(Appointment).filter(Appointment.id == body.appointment_id, Appointment.patient_id == user.id).first()
        if not appt:
            raise HTTPException(status_code=404, detail="Appointment not found")

    chat_id = agents.start_room()
    question = agents.opening_question()
    now = datetime.now(timezone.utc)

    convo = Conversation(
        appointment_id=appt.id if appt else None,
        patient_id=user.id,
        session_id=_new_session_id(),
        language=body.language,
        started_at=now,
        transcript_json=[{"who": "agent", "text": question, "ts": now.isoformat()}],
        band_chat_id=chat_id,
    )
    db.add(convo)
    audit.record(db, actor_user_id=user.id, action="conversation.started", entity_type="conversation",
                entity_id=convo.id, detail={"language": body.language, "band_chat_id": chat_id})
    db.commit()

    displayed_question = extractor.translate_text(question, body.language)
    return {"conversationId": convo.id, "question": displayed_question, "bandEnabled": chat_id is not None}


class TurnBody(BaseModel):
    answer: str
    used_mic: bool = False


@router.post("/{conversation_id}/turn")
def submit_turn(conversation_id: str, body: TurnBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convo = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.patient_id == user.id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if convo.completed_at:
        raise HTTPException(status_code=409, detail="This conversation is already complete")

    now = datetime.now(timezone.utc).isoformat()
    transcript = convo.transcript_json + [{"who": "patient", "text": body.answer, "ts": now}]
    convo.used_mic_any = convo.used_mic_any or body.used_mic

    result = agents.next_step(transcript, convo.band_chat_id)

    if not result["done"]:
        transcript = transcript + [{"who": "agent", "text": result["question"], "ts": datetime.now(timezone.utc).isoformat()}]
        convo.transcript_json = transcript
        db.commit()
        displayed_question = extractor.translate_text(result["question"], convo.language)
        return {"done": False, "question": displayed_question}

    convo.transcript_json = transcript
    appt = db.query(Appointment).filter(Appointment.id == convo.appointment_id).first() if convo.appointment_id else None
    review = _finalize(db, convo, appt, result["summary"], user)
    db.commit()

    return {
        "done": True,
        "escalated": result["escalated"],
        "reason": result.get("reason"),
        "conversationId": convo.id,
        "reviewId": review.id,
    }


# ============================= legacy bulk flow =============================
# Kept for API completeness / anything that wants to submit an
# already-complete transcript in one shot (e.g. the older verbatim_voice.js).
# Runs the pipeline locally without per-turn Band deliberation.

class Turn(BaseModel):
    who: str
    text: str
    ts: str | None = None


class SubmitConversationBody(BaseModel):
    appointment_id: str | None = None
    session_id: str
    language: str
    capture_method: str
    started_at: str
    completed_at: str
    transcript: list[Turn]


@router.post("")
def submit_conversation(body: SubmitConversationBody, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients submit intake conversations")

    appt = None
    if body.appointment_id:
        appt = db.query(Appointment).filter(Appointment.id == body.appointment_id, Appointment.patient_id == user.id).first()
        if not appt:
            raise HTTPException(status_code=404, detail="Appointment not found")

    transcript = [t.model_dump() for t in body.transcript]
    convo = Conversation(
        appointment_id=appt.id if appt else None,
        patient_id=user.id,
        session_id=body.session_id,
        language=body.language,
        started_at=datetime.fromisoformat(body.started_at.replace("Z", "+00:00")),
        transcript_json=transcript,
        used_mic_any=(body.capture_method == "speech (Web Speech API)"),
    )
    db.add(convo)
    db.flush()

    summary_data = run_pipeline(transcript)
    review = _finalize(db, convo, appt, summary_data, user)
    db.commit()

    return {"conversationId": convo.id, "reviewId": review.id, "status": "pending"}
