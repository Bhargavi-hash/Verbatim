"""ORM models. Every clinically-meaningful write also gets an AuditLogEntry
via backend/audit.py's record() helper — never written ad hoc."""
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship

from backend.db import Base


def now():
    return datetime.now(timezone.utc)


def uid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=uid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "patient" | "doctor"
    created_at = Column(DateTime, default=now)

    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)


class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    name = Column(String, nullable=False)
    dob = Column(String)
    mrn = Column(String)
    phone = Column(String)
    address = Column(String)
    insurance = Column(String)
    preferred_language = Column(String, default="Spanish")
    emergency_contact = Column(String)

    user = relationship("User", back_populates="patient_profile")


class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    user_id = Column(String, ForeignKey("users.id"), primary_key=True)
    name = Column(String, nullable=False)
    license_id = Column(String)
    title = Column(String, default="Attending Physician")
    preferred_language = Column(String, default="English")

    user = relationship("User", back_populates="doctor_profile")


class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(String, primary_key=True, default=uid)
    patient_id = Column(String, ForeignKey("users.id"), nullable=False)
    doctor_name = Column(String, nullable=False)
    specialty = Column(String)
    location = Column(String)
    scheduled_at = Column(DateTime, nullable=False)
    status = Column(String, default="upcoming")  # "upcoming" | "completed"


class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(String, primary_key=True, default=uid)
    appointment_id = Column(String, ForeignKey("appointments.id"), nullable=True)
    patient_id = Column(String, ForeignKey("users.id"), nullable=False)
    session_id = Column(String, unique=True, nullable=False)
    language = Column(String, default="es-ES")
    capture_method = Column(String)  # "speech (Web Speech API)" | "typed entry"
    started_at = Column(DateTime, default=now)
    completed_at = Column(DateTime)
    transcript_json = Column(JSON, nullable=False)  # [{who, text, ts}, ...]
    raw_file_path = Column(String)
    band_chat_id = Column(String)  # the Band room the 5 agents deliberated this intake in, if configured
    used_mic_any = Column(Boolean, default=False)  # tracked turn-by-turn, finalized into capture_method
    # Only used when appointment_id is None (e.g. synthetic pending-queue
    # refills) — real appointment-linked conversations get this from the
    # Appointment row instead, so these stay null for those.
    fallback_doctor_name = Column(String)
    fallback_specialty = Column(String)
    fallback_location = Column(String)


class PhysicianSummary(Base):
    __tablename__ = "physician_summaries"
    id = Column(String, primary_key=True, default=uid)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    chief_complaint = Column(Text)
    duration = Column(String)
    severity = Column(String)
    symptoms_json = Column(JSON, default=list)
    medical_history_json = Column(JSON, default=list)
    medication_json = Column(JSON, default=list)
    allergy = Column(String)
    condition_category = Column(String)
    triage_priority = Column(String)
    emergency_flag = Column(Boolean, default=False)
    referral_specialist = Column(String)
    referral_reasons_json = Column(JSON, default=list)
    referral_status = Column(String)
    clinical_safety_note = Column(Text)
    model_used = Column(String)
    qa_score_json = Column(JSON)
    redflag_disagreement = Column(Boolean, default=False)
    created_at = Column(DateTime, default=now)


class Review(Base):
    __tablename__ = "reviews"
    id = Column(String, primary_key=True, default=uid)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    summary_id = Column(String, ForeignKey("physician_summaries.id"), nullable=False)
    doctor_id = Column(String, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="pending")  # pending | approved | rejected
    flags_json = Column(JSON, default=list)
    follow_up_message = Column(Text, default="")
    decided_at = Column(DateTime)
    signer_name = Column(String)
    signer_id = Column(String)
    signature_status = Column(String, default="UNSIGNED")
    signature_meaning = Column(String)
    created_at = Column(DateTime, default=now)


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=uid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String)  # approved | rejected
    review_id = Column(String, ForeignKey("reviews.id"), nullable=True)
    message = Column(Text)
    created_at = Column(DateTime, default=now)
    read_at = Column(DateTime)


class AuditLogEntry(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True, autoincrement=True)
    actor_user_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    entity_type = Column(String)
    entity_id = Column(String)
    detail_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=now)
    prev_hash = Column(String, nullable=False)
    entry_hash = Column(String, nullable=False)


class EvalRun(Base):
    __tablename__ = "eval_runs"
    id = Column(String, primary_key=True, default=uid)
    summary_id = Column(String, ForeignKey("physician_summaries.id"), nullable=True)
    dataset_case_id = Column(String, nullable=True)
    rubric_version = Column(String)
    score_json = Column(JSON)
    verdict = Column(String)
    model = Column(String)
    created_at = Column(DateTime, default=now)
