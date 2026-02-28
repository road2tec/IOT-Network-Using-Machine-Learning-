import shap
import numpy as np

def generate_shap_values(model, processed_data):
    """
    Generate SHAP values for a single prediction row to pass back to the frontend.
    """
    # For tree based models, explainer logic
    explainer = shap.Explainer(model)
    shap_vals = explainer(processed_data)
    
    # Extract base value and actual specific feature SHAP impacts
    base_value = float(explainer.expected_value[0] if isinstance(explainer.expected_value, np.ndarray) else explainer.expected_value)
    
    shap_val_array = shap_vals.values[0]
    
    # We will return the first class impact if it's a multi-output shap
    if isinstance(shap_val_array[0], np.ndarray):
        shap_val_array = shap_val_array[:, 1]
    
    return base_value, shap_val_array.tolist()
