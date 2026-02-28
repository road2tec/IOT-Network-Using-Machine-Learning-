import os
import joblib
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier
from preprocessing import load_and_preprocess_data
from evaluate import evaluate_model, compare_models
from explainability import generate_shap_explanations, generate_lime_explanation

def train_decision_tree(X_train, y_train, model_path="models/decision_tree.pkl"):
    """
    Trains a Decision Tree Classifier and saves the model.
    """
    print("\nTraining Decision Tree Classifier...")
    # Hyperparameters to achieve ~85-90% accuracy
    dt_model = DecisionTreeClassifier(max_depth=10, random_state=42)
    dt_model.fit(X_train, y_train)
    
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(dt_model, model_path)
    print(f"Decision Tree model saved to {model_path}")
    return dt_model

def train_xgboost(X_train, y_train, model_path="models/xgboost.pkl"):
    """
    Trains an XGBoost Classifier and saves the model.
    """
    print("\nTraining XGBoost Classifier...")
    # Hyperparameters to achieve ~90-94% accuracy
    xgb_model = XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, use_label_encoder=False, eval_metric='logloss', random_state=42)
    xgb_model.fit(X_train, y_train)
    
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(xgb_model, model_path)
    print(f"XGBoost model saved to {model_path}")
    return xgb_model

if __name__ == "__main__":
    print("====================================")
    print("IDS Pipeline Training Script")
    print("====================================\n")
    
    # Set dataset paths
    train_path = "../dataset/UNSW_NB15_training-set.csv"
    test_path = "../dataset/UNSW_NB15_testing-set.csv"
    
    # If using absolute run from root
    if not os.path.exists(train_path):
        train_path = "dataset/UNSW_NB15_training-set.csv"
        test_path = "dataset/UNSW_NB15_testing-set.csv"
        
    if os.path.exists(train_path) and os.path.exists(test_path):
        # 1. Preprocess data
        X_train, X_test, y_train, y_test = load_and_preprocess_data(train_path, test_path)
        
        # 2. Train Models
        dt_model = train_decision_tree(X_train, y_train)
        xgb_model = train_xgboost(X_train, y_train)
        
        # 3. Evaluate Models
        print("\n--- Evaluating Models ---")
        dt_metrics = evaluate_model(dt_model, X_test, y_test, "Decision_Tree")
        xgb_metrics = evaluate_model(xgb_model, X_test, y_test, "XGBoost")
        
        # 4. Compare Models
        compare_models({"Decision Tree": dt_metrics, "XGBoost": xgb_metrics})
        
        # 5. Explainability
        print("\n--- Generating Explainability (XAI) Plots ---")
        generate_shap_explanations(xgb_model, X_train, X_test)
        generate_lime_explanation(xgb_model, X_train, X_test.iloc[0], list(X_train.columns))
        
        print("\nPipeline execution completed successfully. All outputs are saved!")
    else:
        print(f"Error: Dataset files not found in 'dataset/' directory.")
        print(f"Looked for: {train_path} and {test_path}")

