import streamlit as st
import pandas as pd
import numpy as np
import joblib
import shap
import os
import matplotlib.pyplot as plt
from PIL import Image
import streamlit.components.v1 as components

# Helper to render JS dependent plots in Streamlit
def st_shap(plot, height=None):
    shap_html = f"<head>{shap.getjs()}</head><body>{plot.html()}</body>"
    components.html(shap_html, height=height)

st.set_page_config(page_title="IDS Explainable AI Dashboard", layout="wide")

st.title("🛡️ Interpretable Intrusion Detection System Using Explainable AI")
st.markdown("""
This dashboard provides Intrusion Detection capabilities for IoT Networks based on the UNSW-NB15 dataset. 
It leverages high-performance Machine Learning classifiers and uses Explainable AI (SHAP & LIME) to make predictions completely interpretable.
""")

st.sidebar.header("Navigation")
page = st.sidebar.radio("Go to:", ["Dashboard (Inference)", "Model Evaluation (Metrics)"])

MODEL_DIR = "models"
OUTPUT_DIR = "outputs"

@st.cache_resource
def load_assets():
    """
    Loads pretrained xgboost model, the feature columns order, and the fitted scaler from disk.
    """
    xgb_path = os.path.join(MODEL_DIR, "xgboost.pkl")
    features_path = os.path.join(MODEL_DIR, "feature_columns.pkl")
    scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
    
    model = joblib.load(xgb_path) if os.path.exists(xgb_path) else None
    features = joblib.load(features_path) if os.path.exists(features_path) else None
    scaler = joblib.load(scaler_path) if os.path.exists(scaler_path) else None
    
    return model, features, scaler

xgb_model, feature_cols, scaler = load_assets()

if page == "Dashboard (Inference)":
    st.header("Upload Traffic Data for Prediction")
    
    if xgb_model is None:
        st.warning("Model not found! Please train the models first using `python src/train_models.py`.")
    
    uploaded_file = st.file_uploader("Upload CSV file for live prediction", type=["csv"])
    
    if uploaded_file is not None and xgb_model is not None and feature_cols is not None:
        data = pd.read_csv(uploaded_file)
        st.write("Preview of Uploaded Data:")
        st.dataframe(data.head())
        
        if st.button("Detect Intrusion"):
            try:
                # Preprocess the uploaded inference data
                processed_data = data.copy()
                
                # 1. Drop matching drop logic if exists 
                if 'id' in processed_data.columns:
                    processed_data = processed_data.drop('id', axis=1)
                
                # 2. Check if we have categorical columns to be explicitly encoded
                object_cols = processed_data.select_dtypes(include=['object', 'category']).columns
                if len(object_cols) > 0:
                    processed_data = pd.get_dummies(processed_data, columns=object_cols)
                
                # 3. Match format identical to feature columns
                processed_data = processed_data.reindex(columns=feature_cols, fill_value=0)
                
                # 4. Scale inputs using standard fitted scaler
                if scaler is not None:
                    processed_data_scaled = pd.DataFrame(scaler.transform(processed_data), columns=feature_cols)
                else:
                    processed_data_scaled = processed_data
                    
                # 5. Model execution logic
                # For demo purposes, evaluate strictly on the first instance
                predictions = xgb_model.predict(processed_data_scaled)
                probabilities = xgb_model.predict_proba(processed_data_scaled)
                
                st.subheader("Prediction Results")
                
                # Assuming labels definition mapping implies 1 => "Attack", 0 => "Normal"
                pred_label = "Attack" if predictions[0] == 1 else "Normal"
                confidence = np.max(probabilities[0]) * 100
                
                if pred_label == "Attack":
                    st.error(f"⚠️ Prediction: **{pred_label}** detected! (Model Confidence: {confidence:.2f}%)")
                else:
                    st.success(f"✅ Prediction: **{pred_label}** traffic flowing securely. (Model Confidence: {confidence:.2f}%)")
                
                # 6. Interpret result visually using Explainable AI (SHAP) local execution
                st.subheader("Local Explanation Interpretation (SHAP Force Plot)")
                st.write("Explaining the specific feature values shaping this single localized prediction instance:")
                
                explainer = shap.Explainer(xgb_model, processed_data_scaled)
                shap_values = explainer(processed_data_scaled.iloc[0:1])
                
                # Generate localized interactive SHAP force plot visualizer
                shap.initjs()
                force_plot = shap.plots.force(shap_values[0])
                
                st_shap(force_plot)
                
            except Exception as e:
                st.error("Error encountered during preprocessing or prediction! Please verify CSV structure integrity.")
                st.write(str(e))

elif page == "Model Evaluation (Metrics)":
    st.header("Overall Performance & Global Explainability Insights")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Model Accuracy Classifiers Comparison")
        comp_img_path = os.path.join(OUTPUT_DIR, "model_comparison.png")
        if os.path.exists(comp_img_path):
            st.image(Image.open(comp_img_path), use_container_width=True)
        else:
            st.info("Comparison chart not found. Run model training phase to generate.")
            
        st.subheader("XGBoost Confusion Matrix Structure")
        cm_img_path = os.path.join(OUTPUT_DIR, "XGBoost_confusion_matrix.png")
        if os.path.exists(cm_img_path):
            st.image(Image.open(cm_img_path), use_container_width=True)
        else:
            st.info("Confusion matrix output not generated.")

    with col2:
        st.subheader("Global Feature Importance Distribution (SHAP)")
        st.write("This graphical plot expresses holistic aggregated weights emphasizing importance vectors affecting model inference processing globally.")
        shap_img_path = os.path.join(OUTPUT_DIR, "shap_summary_plot.png")
        if os.path.exists(shap_img_path):
            st.image(Image.open(shap_img_path), use_container_width=True)
        else:
            st.info("SHAP Summary plotting logic is not present yet.")
