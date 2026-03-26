from fastapi import APIRouter, Depends
from app.core.firebase_config import db, verify_token

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def get_users(user=Depends(verify_token)):
    docs = db.collection("users").stream()
    return [doc.to_dict() for doc in docs]


@router.post("/update-profile")
def update_profile(name: str, user=Depends(verify_token)):
    db.collection("users").document(user["uid"]).update({"name": name})
    return {"message": "Profile updated"}