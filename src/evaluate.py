import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import confusion_matrix, roc_curve, auc

def evaluate_model(model, X_test, y_test, model_name, output_dir="outputs/"):
    """
    Evaluates the model using multiple metrics and generates Confusion Matrix & ROC plots.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"\nEvaluating {model_name}...")
    y_pred = model.predict(X_test)
    
    # Check if probabililty prediction is available (for ROC curve)
    if hasattr(model, "predict_proba"):
        y_proba = model.predict_proba(X_test)[:, 1]
    else:
        y_proba = y_pred
    
    # Calculate evaluation metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print(f"{model_name} Performance:")
    print(f"Accuracy:  {accuracy:.4f} (Target: ~{0.85 if 'Tree' in model_name else 0.90}-{0.90 if 'Tree' in model_name else 0.94})")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    
    # 1. Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False)
    plt.title(f'{model_name} - Confusion Matrix')
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f"{model_name.replace(' ', '_')}_confusion_matrix.png"))
    plt.close()
    
    # 2. ROC Curve
    fpr, tpr, _ = roc_curve(y_test, y_proba)
    roc_auc = auc(fpr, tpr)
    
    plt.figure(figsize=(6, 4))
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title(f'{model_name} - ROC Curve')
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f"{model_name.replace(' ', '_')}_roc_curve.png"))
    plt.close()
    
    print(f"Evaluation plots for {model_name} saved to {output_dir}")
    return {'accuracy': accuracy, 'precision': precision, 'recall': recall, 'f1': f1}

def compare_models(metrics_dict, output_dir="outputs/"):
    """
    Generates a bar chart comparing the accuracies of the models sideways.
    """
    print("\nGenerating model comparison chart...")
    os.makedirs(output_dir, exist_ok=True)
    
    labels = list(metrics_dict.keys())
    accuracies = [metrics_dict[model]['accuracy'] for model in labels]
    
    plt.figure(figsize=(8, 5))
    bars = plt.bar(labels, accuracies, color=['#3498db', '#2ecc71'])
    plt.ylim(0, 1.1)
    plt.ylabel('Accuracy')
    plt.title('Model Accuracy Comparison')
    
    # Annotate bar values
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom')
        
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "model_comparison.png"))
    plt.close()
    print("Model comparison chart saved.")
