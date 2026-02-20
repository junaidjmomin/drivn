
import requests
import json

# Sample data with the new temperature field
test_data = {
    "timestamp": "2026-02-20T14:55:00",
    "max30102": {
        "heart_rate": 110,
        "spo2": 94,
        "raw_ir": 52000,
        "raw_red": 48000
    },
    "ecg": {
        "hr_variability": 18.5,
        "qrs_duration": 0.13,
        "st_segment": -0.05
    },
    "aqi": {
        "value": 150
    },
    "environment": {
        "temperature": 36.5
    }
}

print("Testing DRIVN API...")
print("-" * 30)

try:
    # 1. Test Health Check
    health = requests.get("http://localhost:5000/health")
    print(f"Health Check: {health.status_code} - {health.json()}")

    # 2. Test Prediction
    print("\nSending Prediction Request (Simulating High Stress + Heat)...")
    response = requests.post(
        "http://localhost:5000/predict",
        json=test_data
    )
    
    if response.status_code == 200:
        print("Success! Prediction Result:")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

    # 3. Test Model Info
    print("\nModel Info:")
    info = requests.get("http://localhost:5000/model-info")
    print(json.dumps(info.json(), indent=2))

except Exception as e:
    print(f"Test failed: {e}")
