"""Seeds the same demo personas/history the old localStorage prototype used —
Maria Gonzalez (patient) and Dr. Jordan Rivera (doctor) — as real DB rows.
Run directly: `python -m backend.seed`. Safe to re-run; no-ops if data exists.
"""
from datetime import datetime, timezone

from backend import audit
from backend.auth import hash_password
from backend.db import Base, SessionLocal, engine
from backend.models import (
    Appointment, Conversation, DoctorProfile, Notification, PatientProfile,
    PhysicianSummary, Review, User,
)
from backend.pipeline.band_agent import run_pipeline


def _dt(iso: str) -> datetime:
    return datetime.fromisoformat(iso.replace("Z", "+00:00"))


PAST_CASES = [
    {
        "doctor": "Dr Alex Sachin", "specialty": "Cardiology", "location": "Palo Alto Care",
        "scheduled_at": "2026-07-21T15:00:00Z", "session_id": "VB-M8K3QANX",
        "language": "es-ES", "capture_method": "speech (Web Speech API)",
        "started_at": "2026-07-21T22:01:04Z", "completed_at": "2026-07-21T22:06:47Z",
        "transcript": [
            {"who": "agent", "text": "Hola, soy el asistente de admisión. Le voy a hacer unas preguntas cortas para que su equipo médico sepa cómo ayudarle. Dígame, ¿por qué vino hoy?"},
            {"who": "patient", "text": "Me duele mucho el pecho."},
            {"who": "agent", "text": "Gracias por decírmelo. ¿Cómo es el dolor: presión, ardor, o punzante?"},
            {"who": "patient", "text": "Es como una presión fuerte."},
            {"who": "agent", "text": "Gracias. ¿El dolor se le va al brazo, al cuello o a la mandíbula?"},
            {"who": "patient", "text": "No, se queda en el pecho."},
            {"who": "agent", "text": "Entiendo. Del cero al diez, ¿qué tan fuerte es el dolor?"},
            {"who": "patient", "text": "Un siete."},
            {"who": "agent", "text": "Ya casi terminamos. ¿Le falta el aire, tiene náusea, o está sudando frío?"},
            {"who": "patient", "text": "Un poco de náusea, nada más."},
            {"who": "agent", "text": "Muy bien. ¿Le pasó haciendo esfuerzo o estando en reposo?"},
            {"who": "patient", "text": "Estaba subiendo escaleras."},
            {"who": "agent", "text": "Gracias. ¿Ha tenido problemas del corazón antes?"},
            {"who": "patient", "text": "No, primera vez."},
            {"who": "agent", "text": "Entiendo. ¿Toma algún medicamento actualmente?"},
            {"who": "patient", "text": "Tomo lisinopril para la presión."},
            {"who": "agent", "text": "Ya casi terminamos. ¿Es alérgico a algún medicamento?"},
            {"who": "patient", "text": "Ninguna que yo sepa."},
            {"who": "agent", "text": "Muy bien. ¿Tiene alguna condición médica importante?"},
            {"who": "patient", "text": "Solo la presión alta."},
            {"who": "agent", "text": "Gracias. Ya tengo lo que necesita su equipo médico. Toda esta información va para ellos y alguien vendrá a verle."},
        ],
        "decision": "approved",
        "decided_at": "2026-07-21T23:00:00Z",
        "follow_up_message": "",
        "flags": [],
    },
    {
        "doctor": "Dr Lily Blooms", "specialty": "General Practice", "location": "Sunrise Medical Group",
        "scheduled_at": "2026-07-24T11:00:00Z", "session_id": "VB-N2P9RTLC",
        "language": "en-US", "capture_method": "typed entry",
        "started_at": "2026-07-24T18:00:12Z", "completed_at": "2026-07-24T18:03:58Z",
        "transcript": [
            {"who": "agent", "text": "Hello, I'm the intake assistant. Tell me, why did you come in today?"},
            {"who": "patient", "text": "Just a routine physical, no real complaints today."},
            {"who": "agent", "text": "Thank you for telling me. When did it start?"},
            {"who": "patient", "text": "There's nothing specific going on, I just wanted a general check-up."},
            {"who": "agent", "text": "Understood. How long has it lasted?"},
            {"who": "patient", "text": "N/A, I feel fine overall."},
            {"who": "agent", "text": "Almost done. On a scale of zero to ten, how strong or bothersome is it?"},
            {"who": "patient", "text": "Zero, I feel fine."},
            {"who": "agent", "text": "Great. Have you noticed anything else along with it?"},
            {"who": "patient", "text": "No, nothing else."},
            {"who": "agent", "text": "Thanks. Are you currently taking any medications?"},
            {"who": "patient", "text": "Just a daily multivitamin."},
            {"who": "agent", "text": "Understood. Are you allergic to any medications?"},
            {"who": "patient", "text": "No known allergies."},
            {"who": "agent", "text": "Almost done. Do you have any important medical conditions?"},
            {"who": "patient", "text": "No, I'm generally healthy."},
            {"who": "agent", "text": "Thank you. I now have what your medical team needs. Someone will come see you."},
        ],
        "decision": "rejected",
        "decided_at": "2026-07-24T19:00:00Z",
        "follow_up_message": "The severity and duration questions in your summary don't quite fit a routine physical with no complaints — those were asked automatically by the intake system. Can you confirm nothing specific was bothering you? If so I'll finalize this as a normal check-up.",
        "flags": ["severity", "duration"],
    },
    {
        "doctor": "Dr Stephen King", "specialty": "Internal Medicine", "location": "Healthcare Clinic",
        "scheduled_at": "2026-07-23T10:00:00Z", "session_id": "VB-Q7L4WXPZ",
        "language": "en-US", "capture_method": "speech (Web Speech API)",
        "started_at": "2026-07-23T16:10:00Z", "completed_at": "2026-07-23T16:14:32Z",
        "transcript": [
            {"who": "agent", "text": "Hello, I'm the intake assistant. Tell me, why did you come in today?"},
            {"who": "patient", "text": "I've had a bad cough for about a week and I'm wheezing a lot."},
            {"who": "agent", "text": "Thank you for telling me. Are you short of breath at rest, or only when moving?"},
            {"who": "patient", "text": "Mostly when I walk up stairs or exert myself."},
            {"who": "agent", "text": "Thanks. Do you have a cough? Are you bringing up phlegm?"},
            {"who": "patient", "text": "Yes, some yellowish phlegm in the mornings."},
            {"who": "agent", "text": "Understood. Have you had a fever?"},
            {"who": "patient", "text": "A low-grade fever yesterday, around 100.4."},
            {"who": "agent", "text": "Almost done. Do you have asthma, COPD, or another lung condition?"},
            {"who": "patient", "text": "I had asthma as a kid but haven't used an inhaler in years."},
            {"who": "agent", "text": "Great. Do you use oxygen or an inhaler at home?"},
            {"who": "patient", "text": "No, not currently."},
            {"who": "agent", "text": "Thanks. Are you currently taking any medications?"},
            {"who": "patient", "text": "Just an allergy pill sometimes."},
            {"who": "agent", "text": "Understood. Are you allergic to any medications?"},
            {"who": "patient", "text": "No known drug allergies."},
            {"who": "agent", "text": "Almost done. Do you have any important medical conditions?"},
            {"who": "patient", "text": "Just the childhood asthma I mentioned."},
            {"who": "agent", "text": "Thank you. I now have what your medical team needs. Someone will come see you."},
        ],
        "decision": "pending",
        "decided_at": None,
        "follow_up_message": "",
        "flags": [],
    },
]

UPCOMING_CASES = [
    {"doctor": "Dr Peter Pan", "specialty": "Family Medicine", "location": "Sky Hospital", "scheduled_at": "2026-08-02T09:30:00Z"},
    {"doctor": "Dr Stephen King", "specialty": "Internal Medicine", "location": "Healthcare Clinic", "scheduled_at": "2026-08-09T14:00:00Z"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == "maria@example.com").first():
            print("Already seeded — skipping.")
            return

        patient = User(email="maria@example.com", password_hash=hash_password("patient123"), role="patient")
        db.add(patient)
        db.flush()
        db.add(PatientProfile(
            user_id=patient.id, name="Maria Gonzalez", dob="04/12/1985", mrn="MRN-208451",
            phone="(805) 555-0148", address="742 Evergreen Terrace, Goleta, CA 93117",
            insurance="Central Coast Health Plan · Member ID CCP-88213",
            preferred_language="Spanish", emergency_contact="Juan Gonzalez (Spouse) · (805) 555-0199",
        ))

        doctor = User(email="doctor@example.com", password_hash=hash_password("doctor123"), role="doctor")
        db.add(doctor)
        db.flush()
        db.add(DoctorProfile(user_id=doctor.id, name="Dr. Jordan Rivera", license_id="MD-4471",
                              title="Attending Physician", preferred_language="English"))

        audit.record(db, actor_user_id=None, action="seed.users_created", entity_type="user",
                     entity_id=f"{patient.id},{doctor.id}", detail={"patient_email": patient.email, "doctor_email": doctor.email})

        for case in UPCOMING_CASES:
            db.add(Appointment(
                patient_id=patient.id, doctor_name=case["doctor"], specialty=case["specialty"],
                location=case["location"], scheduled_at=_dt(case["scheduled_at"]), status="upcoming",
            ))

        for case in PAST_CASES:
            appt = Appointment(
                patient_id=patient.id, doctor_name=case["doctor"], specialty=case["specialty"],
                location=case["location"], scheduled_at=_dt(case["scheduled_at"]), status="completed",
            )
            db.add(appt)
            db.flush()

            convo = Conversation(
                appointment_id=appt.id, patient_id=patient.id, session_id=case["session_id"],
                language=case["language"], capture_method=case["capture_method"],
                started_at=_dt(case["started_at"]), completed_at=_dt(case["completed_at"]),
                transcript_json=case["transcript"],
            )
            db.add(convo)
            db.flush()

            summary_data = run_pipeline(case["transcript"])
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

            review = Review(
                conversation_id=convo.id, summary_id=summary.id,
                doctor_id=doctor.id if case["decision"] != "pending" else None,
                status=case["decision"], flags_json=case["flags"], follow_up_message=case["follow_up_message"],
                decided_at=_dt(case["decided_at"]) if case["decided_at"] else None,
                signer_name="Dr. Jordan Rivera" if case["decision"] != "pending" else None,
                signer_id="MD-4471" if case["decision"] != "pending" else None,
                signature_status="SIGNED" if case["decision"] != "pending" else "UNSIGNED",
                signature_meaning=(
                    "Reviewed and approved for the record" if case["decision"] == "approved"
                    else "Reviewed — corrections requested, not approved for the record" if case["decision"] == "rejected"
                    else None
                ),
            )
            db.add(review)
            db.flush()

            audit.record(db, actor_user_id=doctor.id if case["decision"] != "pending" else None,
                         action=f"seed.review.{case['decision']}", entity_type="review", entity_id=review.id,
                         detail={"conversation_id": convo.id})

            if case["decision"] != "pending":
                db.add(Notification(
                    user_id=patient.id,
                    type=case["decision"],
                    review_id=review.id,
                    message=(
                        f"Dr. Jordan Rivera approved your visit summary ({case['doctor']})."
                        if case["decision"] == "approved"
                        else f"Dr. Jordan Rivera sent a follow-up about your visit ({case['doctor']})."
                    ),
                    created_at=_dt(case["decided_at"]),
                    read_at=_dt(case["decided_at"]),
                ))

        db.commit()
        print("Seeded: patient=maria@example.com/patient123, doctor=doctor@example.com/doctor123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
