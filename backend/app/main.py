from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import engine, Base
from app.routes import auth, predict, admin

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Intrusion Detection System API",
    description="Backend API for IDS powered by XAI",
    version="1.0.0"
)

# Allow CORS for react app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Welcome to IDS Explainable AI API v1.0"}
