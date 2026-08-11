from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import settings
from routes import (
    admin_dashboard,
    admin_events,
    admin_heritage_review,
    admin_shop,
    auth,
    chat,
    events,
    health,
    shop,
    volunteer_heritage,
    trails,
)

app = FastAPI(title="INTACH Pune API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.cors_origins.split(",")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(shop.router)
app.include_router(admin_shop.router)
app.include_router(trails.router)

app.include_router(admin_dashboard.router)
app.include_router(admin_events.router)
app.include_router(admin_heritage_review.router)
app.include_router(volunteer_heritage.router)
app.include_router(chat.router)

# Serves product photos extracted from the Warsaa catalogue PDF,
# which have no public URL of their own.

STATIC_DIR = Path(__file__).parent / "static"
STATIC_DIR.mkdir(exist_ok=True)

app.mount(
    "/static",
    StaticFiles(directory=STATIC_DIR),
    name="static",
)