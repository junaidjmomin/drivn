"""
Example sensor data for DRIVN Stress Prediction System.
Contains example readings for different stress states.
"""

EXAMPLE_LOW_STRESS = {
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
    },
    "environment": {
        "temperature": 22.5
    }
}

EXAMPLE_MODERATE_STRESS = {
    "timestamp": "2026-02-13T11:00:00",
    "max30102": {
        "heart_rate": 88,
        "spo2": 97,
        "raw_ir": 51000,
        "raw_red": 47000
    },
    "ecg": {
        "hr_variability": 35.0,
        "qrs_duration": 0.11,
        "st_segment": 0.02,
        "raw_signal": []
    },
    "aqi": {
        "value": 85,
        "pm25": 35.0,
        "pm10": 45.0,
        "no2": 25,
        "o3": 55
    },
    "environment": {
        "temperature": 28.0
    }
}

EXAMPLE_HIGH_STRESS = {
    "timestamp": "2026-02-13T12:00:00",
    "max30102": {
        "heart_rate": 105,
        "spo2": 95,
        "raw_ir": 52000,
        "raw_red": 49000
    },
    "ecg": {
        "hr_variability": 22.0,
        "qrs_duration": 0.13,
        "st_segment": -0.05,
        "raw_signal": []
    },
    "aqi": {
        "value": 125,
        "pm25": 55.0,
        "pm10": 75.0,
        "no2": 45,
        "o3": 75
    },
    "environment": {
        "temperature": 34.5
    }
}

EXAMPLE_CRITICAL_STRESS = {
    "timestamp": "2026-02-13T13:00:00",
    "max30102": {
        "heart_rate": 125,
        "spo2": 92,
        "raw_ir": 55000,
        "raw_red": 53000
    },
    "ecg": {
        "hr_variability": 12.5,
        "qrs_duration": 0.15,
        "st_segment": -0.15,
        "raw_signal": []
    },
    "aqi": {
        "value": 350,
        "pm25": 125.0,
        "pm10": 185.0,
        "no2": 85,
        "o3": 125
    },
    "environment": {
        "temperature": 38.0
    }
}
