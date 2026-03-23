from fastapi import APIRouter
from pydantic import BaseModel
from app.services.text_verify_service import TextVerifyService

router = APIRouter()

service = TextVerifyService()


class ClaimRequest(BaseModel):
    text: str


@router.post("/verify-text")
def verify_text(req: ClaimRequest):

    result = service.analyze_claim(req.text)

    return result