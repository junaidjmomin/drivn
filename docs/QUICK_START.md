# DRIVN Stress Prediction - Quick Start Guide

Get stress predictions from sensor data in 3 simple steps.

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: Train the Model (First Time Only)

```bash
python train_stress_model.py
```

This will:
- Generate synthetic training data
- Train classification & regression models
- Save model to `stress_model.pkl`
- Show performance metrics
- Demo predictions on examples

⏱️ Takes ~20-30 seconds

## Step 3: Make Predictions

### Option A: Python Script

```python
from stress_predictor import StressPredictionPipeline

pipeline = StressPredictionPipeline()

# Your sensor data
sensor_data = {
    "timestamp": "2026-02-13T14:30:00",
    "max30102": {
        "heart_rate": 88,
        "spo2": 97,
        "raw_ir": 50000,
        "raw_red": 45000
    },
    "ecg": {
        "hr_variability": 42,
        "qrs_duration": 0.105,
        "st_segment": 0.035,
        "raw_signal": []
    },
    "aqi": {
        "value": 62,
        "pm25": 22.5,
        "pm10": 35.8,
        "no2": 18,
        "o3": 38
    }
}

# Get prediction
result = pipeline.process_sensor_data(sensor_data)

print(f"Stress Level: {result['stress_level']}")
print(f"Score: {result['stress_score']}/100")
print(f"Risk Factors: {result['risk_factors']}")
print(f"Recommendations: {result['recommendations']}")
```

### Option B: REST API

Start server:
```bash
python api_server.py
```

Make request:
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2026-02-13T14:30:00",
    "max30102": {"heart_rate": 88, "spo2": 97, "raw_ir": 50000, "raw_red": 45000},
    "ecg": {"hr_variability": 42, "qrs_duration": 0.105, "st_segment": 0.035, "raw_signal": []},
    "aqi": {"value": 62, "pm25": 22.5, "pm10": 35.8, "no2": 18, "o3": 38}
  }'
```

## Example Predictions

| Sensor State | Heart Rate | SpO₂ | HRV | AQI | Result |
|---|---|---|---|---|---|
| Relaxed | 68 | 98% | 55ms | 45 | **LOW STRESS** ✓ |
| Working | 95 | 96% | 32ms | 85 | **MODERATE STRESS** ⚠ |
| Stressed | 115 | 94% | 18ms | 150 | **HIGH STRESS** ⚠⚠ |
| Panic | 135 | 92% | 8ms | 250 | **CRITICAL** 🚨 |

## Sensor Data Fields

### MAX30102 (Heart Rate + SpO₂)
```json
"max30102": {
  "heart_rate": 40-200,      // BPM
  "spo2": 85-100,            // Percentage
  "raw_ir": 0-65535,         // LED infrared value
  "raw_red": 0-65535         // LED red value
}
```

### ECG (Electrical Activity)
```json
"ecg": {
  "hr_variability": 0-100,   // milliseconds
  "qrs_duration": 0.08-0.16, // seconds
  "st_segment": -0.5-0.5,    // millivolts
  "raw_signal": []           // Array of samples (optional)
}
```

### AQI (Air Quality)
```json
"aqi": {
  "value": 0-500,            // Air Quality Index
  "pm25": 0-500,             // μg/m³ (PM2.5)
  "pm10": 0-500,             // μg/m³ (PM10)
  "no2": 0-200,              // ppb
  "o3": 0-200                // ppb
}
```

## API Endpoints

### Check Server Status
```
GET /health
```

### Make Single Prediction
```
POST /predict
Body: JSON sensor data
```

### Batch Process Multiple Readings
```
POST /batch-predict
Body: { "readings": [sensor_data_1, sensor_data_2, ...] }
```

### Get Model Information
```
GET /model-info
```

### View API Documentation
```
GET /api-docs
```

## Output Format

```json
{
  "timestamp": "2026-02-13T14:30:00Z",
  "stress_level": "low|moderate|high|critical",
  "stress_score": 28.5,
  "confidence": 0.94,
  "risk_factors": [
    "Risk factor 1",
    "Risk factor 2"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "sensor_summary": {
    "heart_rate": 88,
    "spo2": 97,
    "hrv": 42,
    "aqi": 62
  }
}
```

## Understanding Results

### Stress Level
- **Low** (0-25): Normal, relaxed
- **Moderate** (25-50): Elevated, manageable
- **High** (50-75): Significant stress
- **Critical** (75-100): Urgent intervention

### Confidence (0-1)
- 0.9+: Very reliable
- 0.7-0.9: Reliable
- <0.7: Use with caution

### Risk Factors
Explains what's causing high stress:
- Elevated heart rate
- Low oxygen saturation
- Poor air quality
- Low heart rate variability
- etc.

### Recommendations
Actionable steps to reduce stress:
- "Take deep breathing exercises"
- "Move to area with better air quality"
- "Take a 5-10 minute break"
- etc.

## Test Data

Example sensor readings included in `example_sensor_data.py`:
- `EXAMPLE_LOW_STRESS` - Relaxed state
- `EXAMPLE_MODERATE_STRESS` - Elevated stress
- `EXAMPLE_HIGH_STRESS` - High stress
- `EXAMPLE_CRITICAL_STRESS` - Critical stress
- `REAL_WORLD_EXAMPLE` - Real hardware data

Run training script to see predictions on these examples.

## Common Issues

### Model not found
```bash
python train_stress_model.py
```

### Import errors
```bash
pip install -r requirements.txt
```

### Invalid sensor data
Check value ranges:
- Heart rate: 30-200 bpm
- SpO₂: 85-100%
- AQI: 0-500

### API connection error
Make sure server is running:
```bash
python api_server.py
```

## Next Steps

1. **Integrate with Hardware**
   - Connect MAX30102 sensor
   - Connect ECG sensor
   - Get AQI from API (OpenWeatherMap, AirVisual, etc.)
   - Send data to `/predict` endpoint

2. **Mobile App Integration**
   - Call `/predict` API from mobile app
   - Display stress level UI
   - Show recommendations to user

3. **Data Logging**
   - Store predictions in database
   - Track trends over time
   - Build user health profiles

4. **Model Improvement**
   - Collect real user data
   - Retrain with actual sensor readings
   - Improve accuracy for specific populations

## Documentation

Full documentation: `STRESS_PREDICTION_README.md`

Code documentation:
```python
help(StressPredictionPipeline)
help(StressPredictor)
help(FeatureExtractor)
```

## Architecture

```
Hardware Sensors
    ↓
JSON Data
    ↓
SensorDataProcessor (Validation)
    ↓
FeatureExtractor (14+ features)
    ↓
ML Models (Classification + Regression)
    ↓
Stress Prediction + Recommendations
```

---

**Ready to build?** Start with Step 1 above! 🚀
