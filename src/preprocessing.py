import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import os

def load_and_preprocess_data(train_path, test_path, model_dir="models/"):
    """
    Loads and preprocesses the UNSW-NB15 dataset.
    - Handles missing values
    - Drops ID columns
    - Encodes categorical features via one-hot encoding
    - Aligns train and test features
    - Scales numerical features
    """
    print("Loading datasets...")
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    
    # 1. Drop ID column if exists
    if 'id' in train_df.columns:
        train_df = train_df.drop('id', axis=1)
    if 'id' in test_df.columns:
        test_df = test_df.drop('id', axis=1)
        
    print("Handling missing values...")
    # Handle missing values by dropping rows with NaN
    train_df = train_df.dropna()
    test_df = test_df.dropna()
    
    target_col = 'label'
    
    # Drop 'attack_cat' for binary classification (Normal vs Attack)
    if 'attack_cat' in train_df.columns:
        train_df = train_df.drop('attack_cat', axis=1)
    if 'attack_cat' in test_df.columns:
        test_df = test_df.drop('attack_cat', axis=1)
        
    y_train = train_df[target_col]
    X_train = train_df.drop(target_col, axis=1)
    
    y_test = test_df[target_col]
    X_test = test_df.drop(target_col, axis=1)
    
    print("Encoding categorical features...")
    # Identify categorical columns for one-hot encoding
    categorical_cols = X_train.select_dtypes(include=['object', 'category']).columns
    
    X_train_encoded = pd.get_dummies(X_train, columns=categorical_cols)
    X_test_encoded = pd.get_dummies(X_test, columns=categorical_cols)
    
    print("Aligning train and test features...")
    # Ensure train and test features match
    X_train_encoded, X_test_encoded = X_train_encoded.align(X_test_encoded, join='left', axis=1, fill_value=0)
    
    print("Scaling numerical features...")
    # Apply Standard Scaler
    scaler = StandardScaler()
    X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train_encoded), columns=X_train_encoded.columns)
    X_test_scaled = pd.DataFrame(scaler.transform(X_test_encoded), columns=X_test_encoded.columns)
    
    # Clean column names for XGBoost compatibility (remove [, ], <)
    import re
    X_train_scaled.columns = [re.sub(r'[\[\]<>]', '_', col) for col in X_train_scaled.columns]
    X_test_scaled.columns = [re.sub(r'[\[\]<>]', '_', col) for col in X_test_scaled.columns]
    
    # Save the feature columns and scaler for app.py
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(list(X_train_scaled.columns), os.path.join(model_dir, 'feature_columns.pkl'))
    joblib.dump(scaler, os.path.join(model_dir, 'scaler.pkl'))
    
    print("Preprocessing complete!")
    return X_train_scaled, X_test_scaled, y_train, y_test
