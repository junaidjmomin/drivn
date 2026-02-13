# DRIVN Stress Prediction System

Machine learning-based stress prediction using MAX30102 (heart rate/SpO2), ECG, and AQI sensor data.

## Overview

This system analyzes real-time sensor data to classify stress levels and provide personalized recommendations. It uses a hybrid approach combining:
- **Classification**: Predicts stress level (low, moderate, high, critical)
- **Regression**: Produces continuous stress score (0-100)

## Features

✅ **Multi-Sensor Fusion**
- MAX30102: Heart rate and blood oxygen (SpO2)
- ECG: Heart rate variability and cardiac metrics
- AQI: Environmental pollution data

✅ **Advanced Feature Engineering**
- Heart rate variability (HRV) analysis
- Perfusion index calculation
- Stress index composition
- Respiratory rate estimation

✅ **Machine Learning Models**
- Random Forest Classifier (stress level classification)
- Gradient Boosting Regressor (stress score prediction)
- Feature scaling and normalization

✅ **Actionable Insights**
- Risk factor identification
- Personalized recommendations
- Confidence scores
- Real-time predictions

## Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### 1. Train the Model

```bash
python train_stress_model.py
```

This generates synthetic training data (500 samples) and trains the classification and regression models. Output:
- Prints performance metrics
- Saves model to `stress_model.pkl`
- Demonstrates predictions on example data

**Expected Output:**
```
DRIVN Stress Prediction Model Training
============================================================

[1/3] Generating synthetic training data...
Generated 500 training samples
  - Low stress: 125
  - Moderate stress: 125
  - High stress: 125
  - Critical stress: 125

[2/3] Preparing feature vectors...
Feature vector shape: (500, 14)

[3/3] Training classifier and regressor...

============================================================
MODEL PERFORMANCE METRICS
============================================================

Classification Metrics:
  Accuracy: 0.9800

Regression Metrics:
  MAE: 5.4231
  RMSE: 8.2145
  R² Score: 0.9145

✓ Model saved to stress_model.pkl
```

### 2. Use in Python

#### Single Prediction

```python
from stress_predictor import StressPredictionPipeline

# Initialize pipeline
pipeline = StressPredictionPipeline()

# Create sensor data
sensor_data = {
    "timestamp": "2026-02-13T10:30:00",
    "max30102": {
        "heart_rate": 72,
        "spo2": 98,
        "raw_ir": 50000,
        "raw_red": 45000
    },
    "ecg": {
        "hr_variability": 45.5,
        "qrs_duration": 0.12,
        "st_segment": 0.05,
        "raw_signal": []
    },
    "aqi": {
        "value": 65,
        "pm25": 25.5,
        "pm10": 35.2,
        "no2": 15,
        "o3": 45
    }
}

# Get prediction
prediction = pipeline.process_sensor_data(sensor_data)

print(f"Stress Level: {prediction['stress_level']}")
print(f"Stress Score: {prediction['stress_score']}/100")
print(f"Recommendations: {prediction['recommendations']}")
```

#### Batch Processing

```python
sensor_readings = [sensor_data_1, sensor_data_2, sensor_data_3]
predictions = pipeline.batch_predict(sensor_readings)
```

### 3. API Server

Start the Flask API server:

```bash
python api_server.py
```

**API Endpoints:**

#### Health Check
```bash
GET /health
```

#### Single Prediction
```bash
POST /predict
Content-Type: application/json

{
    "timestamp": "2026-02-13T10:30:00",
    "max30102": {...},
    "ecg": {...},
    "aqi": {...}
}
```

Example with cURL:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d @sensor_data.json
```

**Response:**
```json
{
    "timestamp": "2026-02-13T10:30:00Z",
    "stress_level": "low",
    "stress_score": 28.5,
    "confidence": 0.94,
    "risk_factors": [
        "Stress levels within normal range"
    ],
    "recommendations": [
        "Continue normal activities - stress levels optimal"
    ],
    "sensor_summary": {
        "heart_rate": 72,
        "spo2": 98,
        "hrv": 45.5,
        "aqi": 65
    }
}
```

#### Batch Prediction
```bash
POST /batch-predict
Content-Type: application/json

{
    "readings": [
        {...sensor_data_1...},
        {...sensor_data_2...}
    ]
}
```

#### API Documentation
```bash
GET /api-docs
```

## Sensor Data Format

### Required Fields

```json
{
  "timestamp": "ISO 8601 datetime",
  "max30102": {
    "heart_rate": 40-200,
    "spo2": 85-100,
    "raw_ir": number,
    "raw_red": number
  },
  "ecg": {
    "hr_variability": number (ms),
    "qrs_duration": number (seconds),
    "st_segment": number (mV),
    "raw_signal": [array of samples]
  },
  "aqi": {
    "value": 0-500,
    "pm25": number (μg/m³),
    "pm10": number (μg/m³),
    "no2": number (ppb),
    "o3": number (ppb)
  }
}
```

### Optional Fields

```json
{
  "device_id": "string",
  "location": {
    "lat": number,
    "lon": number
  },
  "max30102": {
    "confidence": 0-1
  },
  "ecg": {
    "pq_interval": number,
    "qt_interval": number,
    "signal_quality": "string"
  },
  "aqi": {
    "co": number,
    "so2": number
  },
  "environment": {
    "temperature": number,
    "humidity": number,
    "wind_speed": number
  },
  "activity": {
    "steps": number,
    "activity_type": "string"
  }
}
```

## Features Extracted

The system extracts 14+ features from sensor data:

| Feature | Source | Description |
|---------|--------|-------------|
| heart_rate | MAX30102 | Beats per minute |
| spo2 | MAX30102 | Blood oxygen saturation % |
| perfusion_index | MAX30102 | Blood flow indicator |
| heart_rate_variability | ECG | HRV in milliseconds |
| qrs_duration | ECG | QRS complex duration |
| st_segment | ECG | ST segment value |
| hrv_normalized | ECG | HRV normalized to heart rate |
| aqi | AQI | Air quality index 0-500 |
| pm25 | AQI | PM2.5 particles μg/m³ |
| pm10 | AQI | PM10 particles μg/m³ |
| no2 | AQI | Nitrogen dioxide ppb |
| o3 | AQI | Ozone ppb |
| stress_index | Composite | 0-100 stress indicator |
| respiratory_rate | Estimated | Estimated from HRV |

## Stress Levels

| Level | Score | Description | Action |
|-------|-------|-------------|--------|
| **low** | 0-25 | Relaxed, normal | Continue regular activities |
| **moderate** | 25-50 | Elevated, handling stress | Take mindfulness breaks |
| **high** | 50-75 | Significant stress | Seek rest, move to better air |
| **critical** | 75-100 | Severe stress state | Urgent intervention needed |

## Machine Learning Models

### Classification: Random Forest
- **Estimators**: 100 trees
- **Max Depth**: 15
- **Purpose**: Classify stress into 4 categories

### Regression: Gradient Boosting
- **Estimators**: 100
- **Max Depth**: 5
- **Learning Rate**: 0.1
- **Purpose**: Generate continuous stress score 0-100

## Model Performance

Expected accuracy on test set:
- **Classification Accuracy**: ~98%
- **Mean Absolute Error (Regression)**: ~5.4 points
- **R² Score**: ~0.91

## Files

| File | Purpose |
|------|---------|
| `stress_predictor.py` | Core ML classes and pipeline |
| `example_sensor_data.py` | Example sensor data in all stress states |
| `train_stress_model.py` | Training script with demo predictions |
| `api_server.py` | Flask REST API server |
| `requirements.txt` | Python dependencies |

## Example Usage Scenarios

### Scenario 1: Urban Commuter
```python
# Morning commute with heavy traffic
sensor_data = {
    "max30102": {"heart_rate": 105, "spo2": 95},
    "ecg": {"hr_variability": 25, "qrs_duration": 0.12},
    "aqi": {"value": 120}
}
# Prediction: HIGH STRESS
# Recommendation: "Take a different route with better air quality"
```

### Scenario 2: Office Worker
```python
# During high-pressure meeting
sensor_data = {
    "max30102": {"heart_rate": 98, "spo2": 96},
    "ecg": {"hr_variability": 35, "qrs_duration": 0.11},
    "aqi": {"value": 55}
}
# Prediction: MODERATE STRESS
# Recommendation: "Take deep breathing exercises"
```

### Scenario 3: Student
```python
# During exam
sensor_data = {
    "max30102": {"heart_rate": 125, "spo2": 93},
    "ecg": {"hr_variability": 12, "qrs_duration": 0.14},
    "aqi": {"value": 80}
}
# Prediction: CRITICAL STRESS
# Recommendation: "Take immediate break, move to fresh air"
```

## Data Validation

The system validates all sensor inputs:
- **Heart Rate**: 30-200 bpm
- **SpO₂**: 85-100%
- **AQI**: 0-500

Invalid data triggers a `ValueError` with descriptive message.

## Extending the System

### Add Custom Features
Extend `FeatureExtractor` class:
```python
@staticmethod
def custom_feature(sensor_data: Dict) -> float:
    # Your feature calculation
    pass
```

### Add New Models
Replace classifiers/regressors in `StressPredictor`:
```python
from sklearn.ensemble import AdaBoostClassifier
self.classifier = AdaBoostClassifier()
```

### Custom Recommendations
Extend `_generate_recommendations()` method with domain-specific logic.

## Troubleshooting

**Model not found:**
```bash
python train_stress_model.py
```

**Import errors:**
```bash
pip install --upgrade -r requirements.txt
```

**API connection refused:**
- Ensure Flask server is running: `python api_server.py`
- Check port 5000 is available

## License

Part of DRIVN - AI-Powered Urban Wellness Intelligence

## Support

For issues or questions, contact the DRIVN team.
