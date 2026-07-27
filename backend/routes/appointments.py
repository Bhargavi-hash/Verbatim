from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.auth import get_current_user
from backend.db import get_db
from backend.models import Appointment, Conversation, PhysicianSummary, Review, User

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


def _appt_payload(appt: Appointment) -> dict:
    return {
        "id": appt.id,
        "doctor": appt.doctor_name,
        "specialty": appt.specialty,
        "location": appt.location,
        "date": appt.scheduled_at.strftime("%B %-d, %Y") if appt.scheduled_at else None,
        "time": appt.scheduled_at.strftime("%-I:%M %p") if appt.scheduled_at else None,
        "status": appt.status,
    }


@router.get("")
def list_appointments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients have appointments")
    appts = db.query(Appointment).filter(Appointment.patient_id == user.id).order_by(Appointment.scheduled_at).all()
    return {
        "upcoming": [_appt_payload(a) for a in appts if a.status == "upcoming"],
        "past": [_appt_payload(a) for a in appts if a.status == "completed"],
    }


@router.get("/{appointment_id}")
def get_appointment(appointment_id: str, lang: str | None = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt or appt.patient_id != user.id:
        raise HTTPException(status_code=404, detail="Appointment not found")

    convo = db.query(Conversation).filter(Conversation.appointment_id == appt.id).first()
    review = None
    summary = None
    if convo:
        summary = db.query(PhysicianSummary).filter(PhysicianSummary.conversation_id == convo.id).first()
        review = db.query(Review).filter(Review.conversation_id == convo.id).first()

    summary_dict = None
    if summary:
        summary_dict = {
            "chief_complaint": summary.chief_complaint, "duration": summary.duration, "severity": summary.severity,
            "symptoms": summary.symptoms_json, "medical_history": summary.medical_history_json,
            "medication": summary.medication_json, "allergy": summary.allergy,
            "referral_reasons": summary.referral_reasons_json, "referral_status": summary.referral_status,
            "clinical_safety_note": summary.clinical_safety_note,
        }
        if lang and lang.lower() not in ("en", "en-us", "english"):
            from backend.pipeline.extractor import translate_summary
            summary_dict = translate_summary(summary_dict, lang)

    return {
        **_appt_payload(appt),
        "conversation": {
            "sessionId": convo.session_id,
            "language": convo.language,
            "captureMethod": convo.capture_method,
            "startedAt": convo.started_at.isoformat() if convo.started_at else None,
            "completedAt": convo.completed_at.isoformat() if convo.completed_at else None,
            "transcript": convo.transcript_json,
        } if convo else None,
        "summary": {
            "chiefComplaint": summary_dict["chief_complaint"],
            "duration": summary_dict["duration"],
            "severity": summary_dict["severity"],
            "symptoms": summary_dict["symptoms"],
            "medicalHistory": summary_dict["medical_history"],
            "medication": summary_dict["medication"],
            "allergy": summary_dict["allergy"],
            "conditionCategory": summary.condition_category,
            "triagePriority": summary.triage_priority,
            "emergencyFlag": summary.emergency_flag,
            "referralSpecialist": summary.referral_specialist,
            "referralReasons": summary_dict["referral_reasons"],
            "referralStatus": summary_dict["referral_status"],
            "clinicalSafetyNote": summary_dict["clinical_safety_note"],
            "modelUsed": summary.model_used,
            "translationNote": summary_dict.get("translation_note"),
        } if summary else None,
        "review": {
            "id": review.id,
            "status": review.status,
            "flags": review.flags_json,
            "followUpMessage": review.follow_up_message,
            "signatureStatus": review.signature_status,
            "signerName": review.signer_name,
            "signerId": review.signer_id,
            "signatureMeaning": review.signature_meaning,
            "decidedAt": review.decided_at.isoformat() if review.decided_at else None,
        } if review else None,
    }
