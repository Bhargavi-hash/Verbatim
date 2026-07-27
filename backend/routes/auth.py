from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend import audit
from backend.auth import (
    SESSION_COOKIE, create_access_token, get_current_user, hash_password, verify_password,
)
from backend.db import get_db
from backend.models import DoctorProfile, PatientProfile, User

router = APIRouter(prefix="/api/auth", tags=["auth"])

COOKIE_KWARGS = dict(httponly=True, samesite="lax", max_age=60 * 60 * 24 * 7)


class RegisterBody(BaseModel):
    email: str
    password: str
    role: str  # "patient" | "doctor"
    name: str
    preferred_language: str = "English"


class LoginBody(BaseModel):
    email: str
    password: str


def _profile_payload(user: User, db: Session) -> dict:
    if user.role == "patient":
        p = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
        profile = {
            "name": p.name, "dob": p.dob, "mrn": p.mrn, "phone": p.phone, "address": p.address,
            "insurance": p.insurance, "preferredLanguage": p.preferred_language,
            "emergencyContact": p.emergency_contact,
        } if p else {}
    else:
        d = db.query(DoctorProfile).filter(DoctorProfile.user_id == user.id).first()
        profile = {
            "name": d.name, "licenseId": d.license_id, "title": d.title,
            "preferredLanguage": d.preferred_language,
        } if d else {}
    return {"id": user.id, "email": user.email, "role": user.role, "profile": profile}


@router.post("/register")
def register(body: RegisterBody, response: Response, db: Session = Depends(get_db)):
    if body.role not in ("patient", "doctor"):
        raise HTTPException(status_code=400, detail="role must be 'patient' or 'doctor'")
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=409, detail="An account with that email already exists")

    user = User(email=body.email, password_hash=hash_password(body.password), role=body.role)
    db.add(user)
    db.flush()

    if body.role == "patient":
        db.add(PatientProfile(user_id=user.id, name=body.name, preferred_language=body.preferred_language))
    else:
        db.add(DoctorProfile(user_id=user.id, name=body.name, preferred_language=body.preferred_language))

    audit.record(db, actor_user_id=user.id, action="auth.register", entity_type="user", entity_id=user.id,
                detail={"email": user.email, "role": user.role})
    db.commit()

    token = create_access_token(user.id, user.role)
    response.set_cookie(SESSION_COOKIE, token, **COOKIE_KWARGS)
    return _profile_payload(user, db)


@router.post("/login")
def login(body: LoginBody, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    audit.record(db, actor_user_id=user.id, action="auth.login", entity_type="user", entity_id=user.id, detail={})
    db.commit()

    token = create_access_token(user.id, user.role)
    response.set_cookie(SESSION_COOKIE, token, **COOKIE_KWARGS)
    return _profile_payload(user, db)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(SESSION_COOKIE)
    return {"ok": True}


@router.get("/me")
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _profile_payload(user, db)
