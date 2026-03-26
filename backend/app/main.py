
# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware
# from app.api import route_textcheck
# # from app.api.auth_routes import router as auth_router
# # from app.api.user_routes import router as user_router
# # from app.core.config import APP_NAME
# # from app.core.database import Base, engine
# from app.api.routes import router as api_router
# from app.api.forensic_routes import router as forensic_router
# # from app.api.auth_routes import router as auth_router

# # Initialize the db tables
# # Base.metadata.create_all(bind=engine)

# # app = FastAPI(title=APP_NAME)

# origins = [
#     "http://localhost",
#     "http://127.0.0.1",
#     "http://localhost:8081",
#     "http://127.0.0.1:8081",
#     "http://localhost:5173",
#     "https://meet.google.com",
#     "*"
# ]

# # ✅ CORS FIX: allow Chrome extension + any website to call backend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,   # allow all websites
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def root():
#     return {"status": "Authentix backend running ✅"}

# # ✅ include routes only once
# # app.include_router(auth_router, prefix="/api", tags=["auth"])
# app.include_router(api_router, prefix="/api")
# app.include_router(forensic_router)

# app.include_router(route_textcheck.router, prefix="/api")

# # app.include_router(user_router, prefix="/api")


import fastapi 
from fastapi.middleware.cors import CORSMiddleware
from app.api import route_textcheck
from app.api.auth_routes import router as auth_router
from app.api.user_routes import router as user_router
from app.core.config import APP_NAME
from app.api.routes import router as api_router
from app.api.forensic_routes import router as forensic_router
app = fastapi.FastAPI(title=APP_NAME)

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

app.include_router(user_router, prefix="/api")
app.include_router(auth_router, prefix="/api", tags=["auth"])