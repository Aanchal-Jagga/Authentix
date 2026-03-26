from fastapi import APIRouter, HTTPException
import requests
import os
import firebase_admin
from firebase_admin import credentials, firestore, auth as admin_auth

router = APIRouter(prefix="/auth", tags=["Auth"])

FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY")
FIREBASE_REST_URL = "https://identitytoolkit.googleapis.com/v1/accounts"

# Firebase init
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


# 🔹 Signup
@router.post("/signup")
def signup(name: str, email: str, password: str):
    url = f"{FIREBASE_REST_URL}:signUp?key={FIREBASE_API_KEY}"
    res = requests.post(url, json={"email": email, "password": password, "returnSecureToken": True})

    if res.status_code != 200:
        raise HTTPException(status_code=400, detail=res.json())

    data = res.json()
    user_id = data["localId"]

    db.collection("users").document(user_id).set({
        "email": email,
        "name": name
    })

    verify_url = f"{FIREBASE_REST_URL}:sendOobCode?key={FIREBASE_API_KEY}"
    requests.post(verify_url, json={"requestType": "VERIFY_EMAIL", "idToken": data["idToken"]})

    return {
        "message": "Signup successful",
        "idToken": data["idToken"],
        "userId": user_id,
        "name": name
    }


# 🔹 Login
@router.post("/login")
def login(email: str, password: str):
    url = f"{FIREBASE_REST_URL}:signInWithPassword?key={FIREBASE_API_KEY}"
    res = requests.post(url, json={"email": email, "password": password, "returnSecureToken": True})

    if res.status_code != 200:
        raise HTTPException(status_code=400, detail=res.json())

    data = res.json()

    decoded = admin_auth.verify_id_token(data["idToken"], clock_skew_seconds=10)
    if not decoded.get("email_verified", False):
        raise HTTPException(status_code=403, detail="Verify your email first")

    user_doc = db.collection("users").document(data["localId"]).get()
    name = user_doc.to_dict().get("name") if user_doc.exists else None

    return {
        "message": "Login successful",
        "token": data["idToken"],
        "userId": data["localId"],
        "name": name
    }