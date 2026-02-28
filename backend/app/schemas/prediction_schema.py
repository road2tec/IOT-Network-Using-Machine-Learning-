from pydantic import BaseModel
from typing import Dict, Any, List
from datetime import datetime

class PredictionRequest(BaseModel):
    features: Dict[str, Any]

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    shap_values: List[float]
    base_value: float

class PredictionLogSchema(BaseModel):
    id: int
    timestamp: datetime
    prediction: str
    confidence: float

    class Config:
        from_attributes = True
