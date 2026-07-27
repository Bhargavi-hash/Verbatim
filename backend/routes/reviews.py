from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend import audit
from backend.auth import require_role
from backend.db import get_db
from backend.models import Conversation, DoctorProfile, Notification, PatientProfile, PhysicianSummary, Review, User
from backend.pipeline.band_agent import run_pipeline
from backend.pipeline.extractor import translate_summary

router = APIRouter(prefix="/api/reviews", tags=["reviews"])

# Synthetic filler cases (no real appointment) so the doctor's pending queue
# is never empty — ported from the old localStorage refill mechanism.
PENDING_REFILL_TEMPLATES = [
    {
        "doctor": "Dr Amara Ncube", "specialty": "Gastroenterology", "location": "Coastal Digestive Health",
        "language": "en-US",
        "transcript": [
            {"who": "agent", "text": "Hello, I'm the intake assistant. Tell me, why did you come in today?"},
            {"who": "patient", "text": "I've had persistent upper abdominal pain for about three weeks, especially after meals."},
            {"who": "agent", "text": "Thank you for telling me. Which part of your abdomen hurts?"},
            {"who": "patient", "text": "The upper abdomen, mostly."},
            {"who": "agent", "text": "Understood. On a scale of zero to ten, how strong is it?"},
            {"who": "patient", "text": "Around an eight."},
            {"who": "agent", "text": "Thanks. Have you vomited? Have you seen any blood?"},
            {"who": "patient", "text": "No vomiting, but frequent nausea, daily heartburn, and I've lost some weight without trying."},
            {"who": "agent", "text": "Understood. Are you currently taking any medications?"},
            {"who": "patient", "text": "Metformin, for type 2 diabetes."},
            {"who": "agent", "text": "Thanks. Are you allergic to any medications?"},
            {"who": "patient", "text": "Yes, penicillin."},
            {"who": "agent", "text": "Thank you. I now have what your medical team needs."},
        ],
    },
    {
        "doctor": "Dr Priya Anand", "specialty": "Neurology", "location": "Westside Neurology Associates",
        "language": "en-US",
        "transcript": [
            {"who": "agent", "text": "Hello, I'm the intake assistant. Tell me, why did you come in today?"},
            {"who": "patient", "text": "I've been having sudden dizzy spells and some blurry vision the past two days."},
            {"who": "agent", "text": "Thank you for telling me. Have you noticed any changes in your vision?"},
            {"who": "patient", "text": "Yes, things get blurry for a few seconds at a time."},
            {"who": "agent", "text": "Understood. Do you feel weakness or numbness in your face, arm, or leg?"},
            {"who": "patient", "text": "No weakness, just the dizziness and vision."},
            {"who": "agent", "text": "Thanks. Did you hit your head or fall?"},
            {"who": "patient", "text": "No, I haven't fallen or hit my head."},
            {"who": "agent", "text": "Understood. Are you currently taking any medications?"},
            {"who": "patient", "text": "None currently."},
            {"who": "agent", "text": "Thanks. Are you allergic to any medications?"},
            {"who": "patient", "text": "No known allergies."},
            {"who": "agent", "text": "Thank you. I now have what your medical team needs."},
        ],
    },
]


def _next_patient_for_refill(db: Session) -> str | None:
    p = db.query(PatientProfile).first()
    return p.user_id if p else None


def _ensure_pending_supply(db: Session):
    has_pending = db.query(Review).filter(Review.status == "pending").first()
    if has_pending:
        return
    patient_id = _next_patient_for_refill(db)
    if not patient_id:
        return

    seq = db.query(Review).count()
    template = PENDING_REFILL_TEMPLATES[seq % len(PENDING_REFILL_TEMPLATES)]
    now = datetime.now(timezone.utc)

    convo = Conversation(
        patient_id=patient_id, session_id=f"VB-REFILL-{seq}-{int(now.timestamp())}",
        language=template["language"], capture_method="speech (Web Speech API)",
        started_at=now, completed_at=now, transcript_json=template["transcript"],
        fallback_doctor_name=template["doctor"], fallback_specialty=template["specialty"],
        fallback_location=template["location"],
    )
    db.add(convo)
    db.flush()

    summary_data = run_pipeline(template["transcript"])
    summary = PhysicianSummary(
        conversation_id=convo.id, chief_complaint=summary_data["chief_complaint"], duration=summary_data["duration"],
        severity=summary_data["severity"], symptoms_json=summary_data["symptoms"],
        medical_history_json=summary_data["medical_history"], medication_json=summary_data["medication"],
        allergy=summary_data["allergy"], condition_category=summary_data["condition_category"],
        triage_priority=summary_data["triage_priority"], emergency_flag=summary_data["emergency_flag"],
        referral_specialist=summary_data["referral_specialist"], referral_reasons_json=summary_data["referral_reasons"],
        referral_status=summary_data["referral_status"], clinical_safety_note=summary_data["clinical_safety_note"],
        model_used=summary_data["model_used"], qa_score_json=summary_data.get("qa_score"),
    )
    db.add(summary)
    db.flush()

    review = Review(conversation_id=convo.id, summary_id=summary.id, status="pending")
    db.add(review)
    db.commit()


def _review_payload(review: Review, db: Session, lang: str | None = None) -> dict:
    convo = db.query(Conversation).filter(Conversation.id == review.conversation_id).first()
    summary = db.query(PhysicianSummary).filter(PhysicianSummary.id == review.summary_id).first()
    patient = db.query(PatientProfile).filter(PatientProfile.user_id == convo.patient_id).first()

    appt = convo.appointment_id
    from backend.models import Appointment
    appt_row = db.query(Appointment).filter(Appointment.id == appt).first() if appt else None

    summary_dict = {
        "chief_complaint": summary.chief_complaint, "duration": summary.duration, "severity": summary.severity,
        "symptoms": summary.symptoms_json, "medical_history": summary.medical_history_json,
        "medication": summary.medication_json, "allergy": summary.allergy,
        "referral_reasons": summary.referral_reasons_json, "referral_status": summary.referral_status,
        "clinical_safety_note": summary.clinical_safety_note, "emergency_flag": summary.emergency_flag,
    }
    if lang and lang.lower() not in ("en", "en-us", "english"):
        summary_dict = translate_summary(summary_dict, lang)

    return {
        "id": review.id,
        "patientName": patient.name if patient else "Unknown",
        "doctor": appt_row.doctor_name if appt_row else (convo.fallback_doctor_name or "Unassigned Provider"),
        "specialty": appt_row.specialty if appt_row else (convo.fallback_specialty or "General Intake"),
        "location": appt_row.location if appt_row else (convo.fallback_location or "Verbatim Virtual Intake"),
        "date": convo.started_at.strftime("%B %-d, %Y"),
        "time": convo.started_at.strftime("%-I:%M %p"),
        "status": review.status,
        "flags": review.flags_json or [],
        "followUpMessage": review.follow_up_message or "",
        "signature": {
            "status": review.signature_status,
            "signerName": review.signer_name,
            "signerId": review.signer_id,
            "signedAt": review.decided_at.isoformat() if review.decided_at else None,
            "meaning": review.signature_meaning,
        },
        "summary": {
            "chiefComplaint": summary_dict.get("chief_complaint"),
            "duration": summary_dict.get("duration"),
            "severity": summary_dict.get("severity"),
            "symptoms": summary_dict.get("symptoms", []),
            "medicalHistory": summary_dict.get("medical_history", []),
            "medication": summary_dict.get("medication", []),
            "allergy": summary_dict.get("allergy"),
            "conditionCategory": summary.condition_category,
            "triagePriority": summary.triage_priority,
            "emergencyFlag": summary_dict.get("emergency_flag"),
            "referral": {
                "specialist": summary.referral_specialist,
                "reasons": summary_dict.get("referral_reasons", []),
                "status": summary_dict.get("referral_status"),
            },
            "clinicalSafetyNote": summary_dict.get("clinical_safety_note"),
            "modelUsed": summary.model_used,
            "translationNote": summary_dict.get("translation_note"),
            "qaScore": summary.qa_score_json,
            "redflagDisagreement": summary.redflag_disagreement,
        },
        "transcript": convo.transcript_json,
        "language": convo.language,
    }


@router.get("")
def list_reviews(status: str | None = None, user: User = Depends(require_role("doctor")), db: Session = Depends(get_db)):
    _ensure_pending_supply(db)
    q = db.query(Review)
    if status:
        q = q.filter(Review.status == status)
    reviews = q.order_by(Review.created_at.desc()).all()
    return [_review_payload(r, db) for r in reviews]


@router.get("/{review_id}")
def get_review(review_id: str, lang: str | None = None, user: User = Depends(require_role("doctor")), db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return _review_payload(review, db, lang=lang)


class DecideBody(BaseModel):
    status: str  # "approved" | "rejected"
    flags: list[str] = []
    follow_up_message: str = ""


@router.post("/{review_id}/decide")
def decide_review(review_id: str, body: DecideBody, user: User = Depends(require_role("doctor")), db: Session = Depends(get_db)):
    if body.status not in ("approved", "rejected"):
        raise HTTPException(status_code=400, detail="status must be 'approved' or 'rejected'")
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.status != "pending":
        raise HTTPException(status_code=409, detail="Review has already been decided")
    if body.status == "rejected" and not body.follow_up_message.strip():
        raise HTTPException(status_code=400, detail="A follow-up message is required when rejecting")

    doctor_profile = db.query(DoctorProfile).filter(DoctorProfile.user_id == user.id).first()

    review.status = body.status
    review.flags_json = body.flags
    review.follow_up_message = body.follow_up_message
    review.decided_at = datetime.now(timezone.utc)
    review.doctor_id = user.id
    review.signer_name = doctor_profile.name if doctor_profile else user.email
    review.signer_id = doctor_profile.license_id if doctor_profile else user.id
    review.signature_status = "SIGNED"
    review.signature_meaning = (
        "Reviewed and approved for the record" if body.status == "approved"
        else "Reviewed — corrections requested, not approved for the record"
    )

    convo = db.query(Conversation).filter(Conversation.id == review.conversation_id).first()
    message = (
        f"{review.signer_name} approved your visit summary."
        if body.status == "approved"
        else f"{review.signer_name} sent a follow-up about your visit."
    )
    db.add(Notification(user_id=convo.patient_id, type=body.status, review_id=review.id, message=message))

    audit.record(db, actor_user_id=user.id, action=f"review.{body.status}", entity_type="review", entity_id=review.id,
                detail={"flags": body.flags, "follow_up_message": body.follow_up_message})
    db.commit()

    _ensure_pending_supply(db)
    return _review_payload(review, db)
