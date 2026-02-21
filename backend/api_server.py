"""
DRIVN Stress Prediction API Server
Flask-based REST API for real-time stress prediction.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from stress_predictor import StressPredictionPipeline
import os
import time

app = Flask(__name__)
CORS(app)

# Initialize pipeline
try:
    pipeline = StressPredictionPipeline(model_path="stress_model.pkl")
    print("✓ Stress Prediction Pipeline initialized successfully")
except Exception as e:
    print(f"Error initializing pipeline: {e}")
    pipeline = None

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "model_loaded": pipeline is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    if not pipeline:
        return jsonify({"error": "Model not loaded"}), 500
    
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        result = pipeline.process_sensor_data(data)
        return jsonify(result)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {e}"}), 500

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    if not pipeline:
        return jsonify({"error": "Model not loaded"}), 500
    
    data = request.json
    if not data or 'readings' not in data:
        return jsonify({"error": "Invalid data format. Expected {'readings': [...]}"}), 400
    
    try:
        results = pipeline.batch_predict(data['readings'])
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": f"Batch prediction failed: {e}"}), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    if not pipeline:
        return jsonify({"error": "Model not loaded"}), 404
    
    return jsonify({
        "model_type": "Hybrid Random Forest + Gradient Boosting",
        "features": [
            "heart_rate", "spo2", "perfusion_index", "hrv", "qrs_duration", 
            "st_segment", "hrv_normalized", "aqi", "pm25", "pm10", 
            "no2", "o3", "stress_index", "respiratory_rate"
        ],
        "output_classes": ["low", "moderate", "high", "critical"],
        "version": "1.0.0"
    })

@app.route('/api-docs', methods=['GET'])
def api_docs():
    return jsonify({
        "endpoints": {
            "/health": "GET - Check server status",
            "/predict": "POST - Single stress prediction from sensor data",
            "/batch-predict": "POST - Multiple stress predictions",
            "/model-info": "GET - Information about the ML model",
            "/api-docs": "GET - This documentation"
        },
        "data_format": {
            "max30102": {"heart_rate": "int", "spo2": "int"},
            "ecg": {"hr_variability": "float"},
            "aqi": {"value": "int"}
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting DRIVN API Server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
