
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import route_textcheck

from app.core.config import APP_NAME
from app.api.routes import router as api_router
from app.api.forensic_routes import router as forensic_router
app = FastAPI(title=APP_NAME)

origins = [
    "http://localhost",
    "http://127.0.0.1",
    "https://meet.google.com",
    "*"
]

# ✅ CORS FIX: allow Chrome extension + any website to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # allow all websites
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Authentix backend running ✅"}

# ✅ include routes only once
app.include_router(api_router, prefix="/api")
app.include_router(forensic_router)

app.include_router(route_textcheck.router, prefix="/api")