from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import engine, Base
from app.routes import auth, predict, admin, live

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
app.include_router(live.router)

# Create default admin on startup
@app.on_event("startup")
def create_default_admin():
    from app.database import SessionLocal
    from app.models.user_model import User
    from app.routes.auth import get_password_hash
    
    db = SessionLocal()
    try:
        admin_exists = db.query(User).filter(User.username == "admin").first()
        if not admin_exists:
            hashed_pw = get_password_hash("admin123")
            admin_user = User(
                username="admin",
                email="admin@ids.xai",
                hashed_password=hashed_pw,
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("Default admin user created: admin / admin123")
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Welcome to IDS Explainable AI API v1.0"}
