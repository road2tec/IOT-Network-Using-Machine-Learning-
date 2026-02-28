from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import json
import io
import pandas as pd
import numpy as np
from datetime import datetime

from app.database import get_db
from app.models.user_model import User
from app.models.ml_model import PredictionLog
from app.routes.auth import get_current_user
from app.schemas.prediction_schema import PredictionRequest, PredictionResponse, PredictionLogSchema
from app.utils.preprocessing import load_ml_assets, preprocess_input
from app.utils.explainability import generate_shap_values

router = APIRouter(prefix="/api/predict", tags=["predict"])

try:
    xgb_model, scaler, feature_cols = load_ml_assets()
except Exception as e:
    print(f"Failed to load assets: {e}")
    xgb_model, scaler, feature_cols = None, None, None

@router.post("/", response_model=PredictionResponse)
def predict_traffic(
    request: PredictionRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if xgb_model is None:
        raise HTTPException(status_code=500, detail="Machine learning models are not loaded.")

    try:
        data_dict = request.features
        processed_df = preprocess_input(data_dict, scaler, feature_cols)
        
        # Make predictions
        preds = xgb_model.predict(processed_df)
        probs = xgb_model.predict_proba(processed_df)
        
        pred_label = "Attack" if preds[0] == 1 else "Normal"
        confidence = float(np.max(probs[0]))
        
        # Explainability
        base_value, shap_values = generate_shap_values(xgb_model, processed_df)
        
        # Log to Database
        new_log = PredictionLog(
            user_id=current_user.id,
            timestamp=datetime.utcnow(),
            prediction=pred_label,
            confidence=confidence,
            features_json=json.dumps(data_dict)
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        
        return PredictionResponse(
            prediction=pred_label,
            confidence=confidence,
            shap_values=shap_values,
            base_value=base_value
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/upload")
def upload_csv(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if xgb_model is None:
        raise HTTPException(status_code=500, detail="Model unavailable.")
        
    try:
        contents = file.file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')), low_memory=False)
        
        # Pick a random row for demonstration so we get varied results
        row_dict = df.sample(n=1).iloc[0].to_dict()
        
        return predict_traffic(PredictionRequest(features=row_dict), db, current_user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

@router.get("/history", response_model=List[PredictionLogSchema])
def get_prediction_history(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    history = db.query(PredictionLog).filter(PredictionLog.user_id == current_user.id).order_by(PredictionLog.timestamp.desc()).all()
    return history
