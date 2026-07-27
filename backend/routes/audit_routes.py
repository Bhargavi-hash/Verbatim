from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend import audit
from backend.auth import require_role
from backend.db import get_db
from backend.models import User

router = APIRouter(prefix="/api/audit", tags=["audit"])


@router.get("/verify")
def verify(user: User = Depends(require_role("doctor")), db: Session = Depends(get_db)):
    """Walks the hash-chained audit log and confirms no entry has been
    tampered with. See backend/audit.py for the chaining scheme."""
    return audit.verify_chain(db)
