from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import numpy as np
import cv2
import requests
import traceback
# from app.services.deepfake_service import analyze_image
from app.services.deepfake_service import analyze_image as analyze_media
from app.services.ocr_service import OCRService
from app.services.text_risk_service import TextRiskService
from app.api.gaze_routes import router as gaze_router
router = APIRouter()

# Load services once
# detector = analyze_image(device="cpu")
ocr_service = OCRService()
text_risk_service = TextRiskService()
router.include_router(gaze_router, prefix="/gaze")

# ---------------- Helpers ----------------

def read_image_bytes(file: UploadFile):
    contents = file.file.read()
    if not contents:
        raise HTTPException(400, "Empty file")

    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(400, "Invalid image format")

    return img


def read_image_from_url(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.google.com/"
    }

    resp = requests.get(url, headers=headers, timeout=10)

    if resp.status_code != 200:
        raise HTTPException(400, f"Fetch failed ({resp.status_code})")

    content_type = resp.headers.get("content-type", "")

    if "image" not in content_type:
        raise HTTPException(400, f"Not an image ({content_type})")

    nparr = np.frombuffer(resp.content, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(400, "Decode failed")

    return img


class URLRequest(BaseModel):
    url: str


# ---------------- Routes ----------------

def build_response(img):
    media = analyze_media(img)

    return {
        "label": media.get("label", "ERROR"),
        "confidence": media.get("confidence", 0),
        "faces_detected": media.get("faces_detected", 0),
        "details": media.get("details", []),
    }


@router.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        img = read_image_bytes(file)
        return build_response(img)

    except HTTPException as e:
        return {"label": "ERROR", "confidence": 0, "error": str(e.detail)}

    except Exception as e:
        traceback.print_exc()
        return {"label": "ERROR", "confidence": 0, "error": str(e)}


@router.post("/analyze/url")
async def analyze_url(payload: URLRequest):
    try:
        url = payload.url.strip()

        if not url.startswith("http"):
            return {"label": "ERROR", "confidence": 0, "error": "Invalid URL"}

        if url.lower().endswith(".svg"):
            return {"label": "SKIPPED", "confidence": 0}

        img = read_image_from_url(url)
        return build_response(img)

    except HTTPException as e:
        return {"label": "ERROR", "confidence": 0, "error": str(e.detail)}

    except Exception as e:
        traceback.print_exc()
        return {"label": "ERROR", "confidence": 0, "error": str(e)}
