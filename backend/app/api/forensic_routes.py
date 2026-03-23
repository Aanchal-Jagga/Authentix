from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services.forensic_service import ForensicService

router = APIRouter()

service = ForensicService()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/forensic/analyze-image")

async def analyze_image(file: UploadFile = File(...)):

    path = f"{UPLOAD_DIR}/{file.filename}"

    with open(path, "wb") as buffer:

        shutil.copyfileobj(file.file, buffer)

    result = service.analyze_image(path)

    return result