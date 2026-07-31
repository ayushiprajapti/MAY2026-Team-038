from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routes import (
    auth,
    health,
    admin_dashboard,
    admin_verification,
    admin_events,
    admin_heritage_review,
)

app = FastAPI(title="INTACH Pune API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(admin_dashboard.router)
app.include_router(admin_verification.router)
app.include_router(admin_events.router)
app.include_router(admin_heritage_review.router)