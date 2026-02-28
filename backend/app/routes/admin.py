from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from app.database import get_db
from app.models.user_model import User
from app.models.ml_model import PredictionLog
from app.routes.auth import get_current_admin_user

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin_user)):
    total_users = db.query(User).count()
    total_predictions = db.query(PredictionLog).count()
    total_attacks = db.query(PredictionLog).filter(PredictionLog.prediction == "Attack").count()
    
    # Calculate attack percentage
    attack_percentage = (total_attacks / total_predictions * 100) if total_predictions > 0 else 0
    
    # Daily logic simulation 
    daily_stats = db.query(
        func.date(PredictionLog.timestamp).label("date"),
        func.count(PredictionLog.id).label("count")
    ).group_by(func.date(PredictionLog.timestamp)).all()
    
    timeline = [{"date": str(stat.date), "count": stat.count} for stat in daily_stats]
    
    return {
        "totalUsers": total_users,
        "totalPredictions": total_predictions,
        "totalAttacks": total_attacks,
        "accuracyRate": 90.45, # Simulated based on XGBoost performance from offline testing
        "attackPercentage": round(attack_percentage, 2),
        "timeline": timeline
    }

@router.get("/users", response_model=List[Dict[str, Any]])
def get_all_users(db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin_user)):
    users = db.query(User).all()
    return [{"id": u.id, "username": u.username, "email": u.email, "is_admin": u.is_admin} for u in users]

@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin_user: User = Depends(get_current_admin_user)):
    if user_id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
