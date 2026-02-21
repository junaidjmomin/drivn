"""
DRIVN Stress Prediction System
Core ML classes and pipeline
"""

import numpy as np
import pickle
from typing import Dict, List, Any
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler


class FeatureExtractor:
    """Extracts 14 features from raw sensor data."""

    STRESS_LEVELS = ["low", "moderate", "high", "critical"]

    @staticmethod
    def extract(sensor_data: Dict) -> np.ndarray:
        max30102 = sensor_data.get("max30102", {})
        ecg = sensor_data.get("ecg", {})
        aqi = sensor_data.get("aqi", {})
        env = sensor_data.get("environment", {})

        heart_rate = float(max30102.get("heart_rate", 70))
        spo2 = float(max30102.get("spo2", 98))
        raw_ir = float(max30102.get("raw_ir", 50000))
        raw_red = float(max30102.get("raw_red", 45000))

        hrv = float(ecg.get("hr_variability", 50))
        qrs = float(ecg.get("qrs_duration", 0.10))
        st = float(ecg.get("st_segment", 0.0))

        aqi_val = float(aqi.get("value", 50))
        pm25 = float(aqi.get("pm25", 12))
        pm10 = float(aqi.get("pm10", 20))
        no2 = float(aqi.get("no2", 20))
        o3 = float(aqi.get("o3", 30))
        temp = float(env.get("temperature", 25))

        # Derived features
        perfusion_index = (raw_ir - raw_red) / raw_ir * 100 if raw_ir > 0 else 0
        hrv_normalized = hrv / heart_rate if heart_rate > 0 else 0
        stress_index = (
            (max(0, heart_rate - 60) / 140) * 40
            + (max(0, 100 - hrv) / 100) * 30
            + (max(0, 100 - spo2) / 15) * 20
            + (aqi_val / 500) * 10
        )
        respiratory_rate = 60000 / hrv if hrv > 0 else 15

        features = np.array([
            heart_rate, spo2, perfusion_index,
            hrv, qrs, st, hrv_normalized,
            aqi_val, pm25, pm10, no2, o3,
            stress_index, respiratory_rate, temp
        ], dtype=np.float32)

        return features

    @staticmethod
    def validate(sensor_data: Dict):
        hr = sensor_data.get("max30102", {}).get("heart_rate", 70)
        spo2 = sensor_data.get("max30102", {}).get("spo2", 98)
        aqi = sensor_data.get("aqi", {}).get("value", 50)
        temp = sensor_data.get("environment", {}).get("temperature", 25)

        if not (30 <= hr <= 200):
            raise ValueError(f"Heart rate {hr} out of range [30-200]")
        if not (85 <= spo2 <= 100):
            raise ValueError(f"SpO2 {spo2} out of range [85-100]")
        if not (0 <= aqi <= 500):
            raise ValueError(f"AQI {aqi} out of range [0-500]")
        if not (-20 <= temp <= 60):
            raise ValueError(f"Temperature {temp} out of range [-20 to 60°C]")


class StressPredictor:
    """Classifier + Regressor for stress prediction."""

    def __init__(self):
        self.classifier = RandomForestClassifier(
            n_estimators=100, max_depth=15, random_state=42
        )
        self.regressor = GradientBoostingRegressor(
            n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
        )
        self.scaler = StandardScaler()
        self.trained = False

    def fit(self, X: np.ndarray, y_class: np.ndarray, y_score: np.ndarray):
        X_scaled = self.scaler.fit_transform(X)
        self.classifier.fit(X_scaled, y_class)
        self.regressor.fit(X_scaled, y_score)
        self.trained = True

    def predict(self, X: np.ndarray):
        X_scaled = self.scaler.transform(X)
        level = self.classifier.predict(X_scaled)[0]
        score = float(np.clip(self.regressor.predict(X_scaled)[0], 0, 100))
        proba = self.classifier.predict_proba(X_scaled)[0]
        confidence = float(np.max(proba))
        return level, score, confidence

    def save(self, path: str):
        with open(path, "wb") as f:
            pickle.dump(self, f)

    @staticmethod
    def load(path: str):
        with open(path, "rb") as f:
            return pickle.load(f)


class StressPredictionPipeline:
    """End-to-end pipeline: validate → extract → predict → recommend."""

    RECOMMENDATIONS = {
        "low": ["Continue normal activities - stress levels optimal"],
        "moderate": [
            "Take short mindfulness or breathing breaks",
            "Stay hydrated and reduce caffeine intake",
        ],
        "high": [
            "Seek rest immediately",
            "Move to an area with better air quality",
            "Practice 4-7-8 breathing technique",
        ],
        "critical": [
            "Take an immediate break from current activity",
            "Move to fresh air environment",
            "Contact a healthcare provider if symptoms persist",
        ],
    }

    def __init__(self, model_path: str = "stress_model.pkl"):
        try:
            self.model = StressPredictor.load(model_path)
        except FileNotFoundError:
            raise FileNotFoundError(
                f"Model not found at '{model_path}'. Run train_stress_model.py first."
            )

    def process_sensor_data(self, sensor_data: Dict) -> Dict[str, Any]:
        FeatureExtractor.validate(sensor_data)
        features = FeatureExtractor.extract(sensor_data).reshape(1, -1)
        level, score, confidence = self.model.predict(features)

        risk_factors = self._risk_factors(sensor_data, level)
        recommendations = self.RECOMMENDATIONS.get(level, [])

        return {
            "timestamp": sensor_data.get("timestamp", ""),
            "stress_level": level,
            "stress_score": round(score, 2),
            "confidence": round(confidence, 4),
            "risk_factors": risk_factors,
            "recommendations": recommendations,
            "sensor_summary": {
                "heart_rate": sensor_data["max30102"]["heart_rate"],
                "spo2": sensor_data["max30102"]["spo2"],
                "hrv": sensor_data["ecg"]["hr_variability"],
                "aqi": sensor_data["aqi"]["value"],
            },
        }

    def batch_predict(self, readings: List[Dict]) -> List[Dict]:
        return [self.process_sensor_data(r) for r in readings]

    def _risk_factors(self, sensor_data: Dict, level: str) -> List[str]:
        factors = []
        hr = sensor_data["max30102"]["heart_rate"]
        spo2 = sensor_data["max30102"]["spo2"]
        hrv = sensor_data["ecg"]["hr_variability"]
        aqi = sensor_data["aqi"]["value"]

        if level == "low":
            factors.append("Stress levels within normal range")
        else:
            if hr > 100:
                factors.append(f"Elevated heart rate ({hr} bpm)")
            if spo2 < 95:
                factors.append(f"Low blood oxygen ({spo2}%)")
            if hrv < 20:
                factors.append(f"Reduced HRV ({hrv} ms)")
            if aqi > 100:
                factors.append(f"Poor air quality (AQI {aqi})")
            
            # Check temperature extremes
            temp = sensor_data.get("environment", {}).get("temperature", 25)
            if temp > 35:
                factors.append(f"High environmental heat ({temp}°C)")
            elif temp < 5:
                factors.append(f"Cold stress ({temp}°C)")
                
            if not factors:
                factors.append("Composite stress indicators elevated")

        return factors