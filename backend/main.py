"""Verbatim backend. Serves the API under /api/* and the existing static
frontend directly (same origin, same port) so the session cookie works
without any cross-site cookie configuration — this is a local/demo
deployment, not behind a real domain."""
import logging
import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from backend.db import Base, engine
from backend.pipeline import band_agent
from backend.routes import appointments, audit_routes, auth, conversations, notifications, reviews

logging.basicConfig(level=logging.INFO)

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="Verbatim")

app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(conversations.router)
app.include_router(reviews.router)
app.include_router(notifications.router)
app.include_router(audit_routes.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    band_agent.register()  # best-effort; no-ops cleanly if band/langgraph aren't available


@app.get("/")
def root():
    return RedirectResponse(url="/frontend/pages/login.html")


app.mount("/frontend", StaticFiles(directory=os.path.join(REPO_ROOT, "frontend")), name="frontend")
