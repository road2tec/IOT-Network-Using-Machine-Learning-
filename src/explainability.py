import os
import shap
import lime.lime_tabular
import numpy as np
import matplotlib.pyplot as plt

def generate_shap_explanations(model, X_train, X_test, output_dir="outputs/"):
    """
    Generates Global feature importances (SHAP summary plot) and Local explanations (SHAP force plot).
    """
    print("\nGenerating SHAP explanations...")
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. SHAP Summary Plot (Global Explanation)
    # Using a sample of test data to speed up the explanation processing
    X_sample = X_test.iloc[:100]
    
    explainer = shap.Explainer(model, X_train.iloc[:100])
    shap_values = explainer(X_sample)
    
    plt.figure()
    shap.summary_plot(shap_values, X_sample, show=False)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "shap_summary_plot.png"))
    plt.close()
    
    # 2. SHAP Force Plot (Local Explanation)
    # Initialize JS for force plots
    shap.initjs()
    single_instance = X_sample.iloc[0:1]
    shap_val_single = explainer(single_instance)
    
    force_plot = shap.plots.force(shap_val_single[0])
    # Save the force plot as an interactive HTML artifact
    shap.save_html(os.path.join(output_dir, "shap_force_plot.html"), force_plot)
    print("SHAP explanations (summary and force plot) generated and saved.")

def generate_lime_explanation(model, X_train, instance, feature_names, class_names=['Normal', 'Attack'], output_dir="outputs/"):
    """
    Generates a LIME explanation for a single prediction instance.
    """
    print("\nGenerating LIME explanation...")
    os.makedirs(output_dir, exist_ok=True)
    
    # Initialize LIME Tabular Explainer
    explainer = lime.lime_tabular.LimeTabularExplainer(
        training_data=np.array(X_train),
        feature_names=feature_names,
        class_names=class_names,
        mode='classification'
    )
    
    # Provide the predict_proba function which LIME requires
    predict_fn = lambda x: model.predict_proba(x)
    
    # Explain single row instance
    exp = explainer.explain_instance(
        data_row=instance.values if hasattr(instance, 'values') else np.array(instance), 
        predict_fn=predict_fn, 
        num_features=10
    )
    
    # Save output interpretation as HTML and an image representation
    exp.save_to_file(os.path.join(output_dir, "lime_explanation.html"))
    
    fig = exp.as_pyplot_figure()
    fig.savefig(os.path.join(output_dir, "lime_explanation.png"), bbox_inches='tight')
    plt.close(fig)
    print("LIME explanation generated and saved.")
