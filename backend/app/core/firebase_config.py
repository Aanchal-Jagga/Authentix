import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth as admin_auth
from fastapi import HTTPException, Header

load_dotenv()

# Firebase init
cred = credentials.Certificate("serviceAccountKey.json")

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Firestore DB
db = firestore.client()

# Token verification (USED IN PROTECTED ROUTES)
def verify_token(authorization: str = Header(...)):
    try:
        if authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
        else:
            raise Exception("Invalid token")

        decoded = admin_auth.verify_id_token(token)
        return decoded
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid user token")