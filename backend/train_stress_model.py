"""
DRIVN Stress Prediction Model Training Script
Generates synthetic data and trains the ML models.
"""

import numpy as np
import pandas as pd
from stress_predictor import FeatureExtractor, StressPredictor, StressPredictionPipeline
from example_sensor_data import EXAMPLE_LOW_STRESS, EXAMPLE_MODERATE_STRESS, EXAMPLE_HIGH_STRESS, EXAMPLE_CRITICAL_STRESS
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error, mean_squared_error, r2_score
import os

def generate_synthetic_data(samples_per_class=125):
    """Generates synthetic sensor data and extracts features."""
    print(f"Generating synthetic training data...")
    
    data = []
    y_class = []
    y_score = []
    
    templates = {
        "low": (EXAMPLE_LOW_STRESS, 0, 25),
        "moderate": (EXAMPLE_MODERATE_STRESS, 25, 50),
        "high": (EXAMPLE_HIGH_STRESS, 50, 75),
        "critical": (EXAMPLE_CRITICAL_STRESS, 75, 100)
    }
    
    for label, (template, score_min, score_max) in templates.items():
        for _ in range(samples_per_class):
            # Add some random noise to the template data
            reading = {
                "max30102": {
                    "heart_rate": template["max30102"]["heart_rate"] + np.random.uniform(-5, 5),
                    "spo2": np.clip(template["max30102"]["spo2"] + np.random.uniform(-2, 1), 85, 100),
                    "raw_ir": template["max30102"]["raw_ir"] + np.random.uniform(-1000, 1000),
                    "raw_red": template["max30102"]["raw_red"] + np.random.uniform(-1000, 1000)
                },
                "ecg": {
                    "hr_variability": max(5, template["ecg"]["hr_variability"] + np.random.uniform(-5, 5)),
                    "qrs_duration": template["ecg"]["qrs_duration"] + np.random.uniform(-0.01, 0.01),
                    "st_segment": template["ecg"]["st_segment"] + np.random.uniform(-0.02, 0.02)
                },
                "aqi": {
                    "value": np.clip(template["aqi"]["value"] + np.random.uniform(-20, 20), 0, 500)
                },
                "environment": {
                    "temperature": template["environment"]["temperature"] + np.random.uniform(-3, 3)
                }
            }
            
            features = FeatureExtractor.extract(reading)
            data.append(features)
            y_class.append(label)
            y_score.append(np.random.uniform(score_min, score_max))
            
    print(f"Generated {len(data)} training samples")
    print(f"  - Low stress: {samples_per_class}")
    print(f"  - Moderate stress: {samples_per_class}")
    print(f"  - High stress: {samples_per_class}")
    print(f"  - Critical stress: {samples_per_class}")
    
    return np.array(data), np.array(y_class), np.array(y_score)

def train():
    print("DRIVN Stress Prediction Model Training")
    print("=" * 60)
    print("\n[1/3] Generating synthetic training data...")
    X, y_c, y_s = generate_synthetic_data()
    
    print("\n[2/3] Preparing feature vectors...")
    print(f"Feature vector shape: {X.shape}")
    
    X_train, X_test, yc_train, yc_test, ys_train, ys_test = train_test_split(
        X, y_c, y_s, test_size=0.2, random_state=42
    )
    
    print("\n[3/3] Training classifier and regressor...")
    predictor = StressPredictor()
    predictor.fit(X_train, yc_train, ys_train)
    
    # Evaluate
    yc_pred = predictor.classifier.predict(predictor.scaler.transform(X_test))
    ys_pred = predictor.regressor.predict(predictor.scaler.transform(X_test))
    
    print("\n" + "=" * 60)
    print("MODEL PERFORMANCE METRICS")
    print("=" * 60)
    
    print(f"\nClassification Metrics:")
    print(f"  Accuracy: {accuracy_score(yc_test, yc_pred):.4f}")
    
    print(f"\nRegression Metrics:")
    print(f"  MAE: {mean_absolute_error(ys_test, ys_pred):.4f}")
    print(f"  RMSE: {np.sqrt(mean_squared_error(ys_test, ys_pred)):.4f}")
    print(f"  R² Score: {r2_score(ys_test, ys_pred):.4f}")
    
    model_path = "stress_model.pkl"
    predictor.save(model_path)
    print(f"\n✓ Model saved to {model_path}")
    
    # Test with pipeline
    print("\nTesting pipeline with example data...")
    pipeline = StressPredictionPipeline(model_path=model_path)
    result = pipeline.process_sensor_data(EXAMPLE_HIGH_STRESS)
    print(f"Sample Prediction (High Stress Template):")
    print(f"  Level: {result['stress_level']}")
    print(f"  Score: {result['stress_score']}")
    print(f"  Confidence: {result['confidence']}")

if __name__ == "__main__":
    train()
