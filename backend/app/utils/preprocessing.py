import joblib
import pandas as pd
import os
import re

# We map models and preprocessing dependencies directly from the existing ones.
# In an actual deployment, paths would be absolute.

MODEL_PATH = "../models/xgboost.pkl"
SCALER_PATH = "../models/scaler.pkl"
FEATURES_PATH = "../models/feature_columns.pkl"

def load_ml_assets():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    feature_cols = joblib.load(FEATURES_PATH)
    return model, scaler, feature_cols

def preprocess_input(data_dict: dict, scaler, feature_cols):
    """
    Transforms JSON dictionary input matching exactly our trained models.
    """
    df = pd.DataFrame([data_dict])
    
    # 1. Drop targets and IDs if passed in test payload
    for drop_col in ['id', 'label', 'attack_cat']:
        if drop_col in df.columns:
            df = df.drop(columns=[drop_col])
            
    # 2. One-hot encode categorical features like training
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns
    df_encoded = pd.get_dummies(df, columns=categorical_cols)
    
    # 3. Clean column names like training
    df_encoded.columns = [re.sub(r'[\[\]<>]', '_', str(col)) for col in df_encoded.columns]
    
    # 4. Fill missing with 0s similar to training alignments
    df_aligned = df_encoded.reindex(columns=feature_cols, fill_value=0)
    
    # 5. Scale inputs
    scaled_data = pd.DataFrame(scaler.transform(df_aligned), columns=feature_cols)
    return scaled_data
