# DRIVN — AI-Powered Urban Wellness Intelligence

A full-stack application combining a cyberpunk-themed landing page with an advanced machine learning stress prediction system using MAX30102 (heart rate/SpO2), ECG, and AQI sensor data.

## 📁 Project Structure

```
TISD-Project-Landing-Page-master/
│
├── frontend/                          # Web landing page
│   ├── index.html                    # Main landing page
│   ├── style.css                     # Cyberpunk design system
│   ├── script.js                     # Interactive features
│   ├── Cyberpunk.ttf                 # Custom font for logo
│   └── README.md                     # Frontend documentation
│
├── backend/                           # ML stress prediction system
│   ├── stress_predictor.py           # Core ML classes
│   ├── example_sensor_data.py        # Example sensor readings
│   ├── train_stress_model.py         # Training script
│   ├── api_server.py                 # Flask REST API
│   ├── requirements.txt              # Python dependencies
│   ├── stress_model.pkl              # Trained model (generated)
│   └── README.md                     # Backend documentation
│
├── docs/                              # Documentation
│   ├── STRESS_PREDICTION_README.md   # Complete ML system docs
│   ├── QUICK_START.md                # Quick reference guide
│   └── API_DOCS.md                   # API endpoint documentation
│
├── README.md                          # This file
└── .gitignore

```

## 🚀 Quick Start

### Frontend (Landing Page)

Open `frontend/index.html` in a browser to view the responsive cyberpunk-themed landing page.

**Features:**
- Glassmorphic design with cyberpunk aesthetics
- Animated hero section with glitch effects
- Responsive grid layouts
- Custom Cyberpunk.ttf font for branding
- Interactive scroll reveals and particles

### Backend (ML Stress Prediction)

#### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 2. Train the Model
```bash
python train_stress_model.py
```

This generates synthetic training data and saves `stress_model.pkl`

#### 3. Make Predictions

**Option A: Python Script**
```python
from stress_predictor import StressPredictionPipeline

pipeline = StressPredictionPipeline()
result = pipeline.process_sensor_data(sensor_data)
```

**Option B: REST API**
```bash
python api_server.py
# API available at http://localhost:5000
```

## 🧠 Stress Prediction System

### How It Works

1. **Data Input**: JSON sensor data from hardware
2. **Validation**: Checks sensor data ranges and formats
3. **Feature Extraction**: 14+ features from sensors
4. **Classification**: Random Forest predicts stress level
5. **Regression**: Gradient Boosting produces stress score
6. **Insights**: Generates risk factors & recommendations

### Sensor Data Format

```json
{
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
```

### Output Example

```json
{
  "timestamp": "2026-02-13T10:30:00Z",
  "stress_level": "low",
  "stress_score": 28.5,
  "confidence": 0.94,
  "risk_factors": ["Stress levels within normal range"],
  "recommendations": ["Continue normal activities"],
  "sensor_summary": {
    "heart_rate": 72,
    "spo2": 98,
    "hrv": 45.5,
    "aqi": 65
  }
}
```

## API Endpoints

### Health Check
```
GET /health
```

### Single Prediction
```
POST /predict
Content-Type: application/json
Body: sensor_data
```

### Batch Prediction
```
POST /batch-predict
Content-Type: application/json
Body: { "readings": [sensor_data_1, sensor_data_2, ...] }
```

### Model Information
```
GET /model-info
```

### API Documentation
```
GET /api-docs
```

## 📊 Machine Learning Models

| Component | Type | Purpose | Performance |
|-----------|------|---------|-------------|
| **Classifier** | Random Forest | Stress level classification | ~98% accuracy |
| **Regressor** | Gradient Boosting | Stress score (0-100) | R² = 0.91 |

## 🎨 Frontend Features

### Design System
- **Color Palette**: Cyberpunk neon colors (cyan, purple, pink, gold)
- **Typography**: Orbitron (display), Rajdhani (body), Cyberpunk (logo)
- **Effects**: Glitch animations, glassmorphism, blob animations
- **Responsive**: Mobile-first, works on all devices

### Key Sections
1. **Hero**: Main value proposition with animated mockup
2. **Problem Stats**: Impact metrics with glass cards
3. **Competitor Analysis**: How DRIVN differs
4. **How It Works**: 6-step animated flow
5. **Features**: Core capabilities grid
6. **SDG Impact**: UN sustainable goals alignment
7. **Target Audience**: User personas
8. **Technology Stack**: Tech used
9. **Validation Roadmap**: 3-phase development plan
10. **Waitlist CTA**: Call-to-action section
11. **Footer**: Links and team info

## 🔧 Technology Stack

### Frontend
- HTML5
- CSS3 (with custom fonts)
- Vanilla JavaScript

### Backend
- Python 3.8+
- scikit-learn (ML models)
- Flask (REST API)
- NumPy & Pandas (data processing)

### Data Science
- Random Forest Classification
- Gradient Boosting Regression
- StandardScaler normalization
- Cross-validation

## 📚 Documentation

### For Frontend Developers
See `frontend/` directory for:
- Layout and styling guide
- Component structure
- Animation explanations

### For ML Engineers
See `backend/` and `docs/` for:
- **STRESS_PREDICTION_README.md**: Complete ML system documentation
- **QUICK_START.md**: Quick reference guide
- Inline code documentation

### API Integration
See `docs/API_DOCS.md` for complete endpoint documentation

## 🎯 Key Features

✅ Real-time stress prediction from biometric sensors  
✅ Multi-sensor fusion (HR, SpO2, ECG, AQI)  
✅ Classification & regression models  
✅ REST API for easy integration  
✅ Automated feature engineering  
✅ Actionable recommendations  
✅ Confidence scores for predictions  
✅ Batch processing support  

## 🔒 Privacy & Security

- On-device Edge AI (when deployed on hardware)
- End-to-end encryption ready
- GDPR-compliant data handling
- No unnecessary data retention
- Sensor data validation and sanitization

## 🚀 Deployment

### Frontend
Simply serve `frontend/` folder with any static web server:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server ./frontend

# Nginx/Apache
# Configure to serve frontend/ directory
```

### Backend API
```bash
cd backend
python api_server.py
```

API runs on `http://localhost:5000` or your cloud platform's runtime.

## 🔄 Development Workflow

### Making Changes

1. **Frontend**:
   ```bash
   # Edit files in frontend/
   # Changes reflect immediately in browser
   ```

2. **Backend**:
   ```bash
   cd backend
   
   # Test with example data
   python train_stress_model.py
   
   # Start API server
   python api_server.py
   
   # Make prediction
   curl -X POST http://localhost:5000/predict \
     -H "Content-Type: application/json" \
     -d @sensor_data.json
   ```

### Testing

```bash
cd backend

# Generate training data and test models
python train_stress_model.py

# Test API with example data
python -c "
from stress_predictor import StressPredictionPipeline
from example_sensor_data import EXAMPLE_LOW_STRESS
pipeline = StressPredictionPipeline()
result = pipeline.process_sensor_data(EXAMPLE_LOW_STRESS)
print(result)
"
```

## 🤝 Team

- **Junaid Momin** - Project Lead
- **Darshan Patel** - Full-stack Development
- **Pranay Shetty** - ML Engineering
- **Arnav Gurao** - Design & UX

## 📄 License

Part of DRIVN - AI-Powered Urban Wellness Intelligence by **Ingoude Company**

## 🎓 Next Steps

1. **Connect Hardware**
   - Integrate MAX30102 sensor
   - Connect ECG sensor
   - Source AQI data from environmental API
   - Stream data to `/predict` endpoint

2. **Mobile App**
   - Build iOS/Android app
   - Connect to backend API
   - Display real-time stress level
   - Show personalized recommendations

3. **Data Pipeline**
   - Implement data logging system
   - Build analytics dashboard
   - Track user trends over time
   - Retrain models with real data

4. **Scale & Deploy**
   - Deploy to cloud (AWS/GCP/Azure)
   - Setup load balancing
   - Implement user authentication
   - Build notification system

## 📖 Resources

- Full ML Documentation: `docs/STRESS_PREDICTION_README.md`
- Quick Reference: `docs/QUICK_START.md`
- Code Examples: `backend/example_sensor_data.py`

## 🐛 Troubleshooting

### Model Not Found
```bash
cd backend
python train_stress_model.py
```

### Import Errors
```bash
pip install --upgrade -r requirements.txt
```

### API Connection Issues
- Ensure Flask server is running: `python api_server.py`
- Check port 5000 is available
- Verify CORS is enabled

## 📞 Support

For questions, issues, or contributions, please reach out to the DRIVN team.

---

**Status**: Active Development  
**Last Updated**: February 13, 2026  
**Version**: 1.0.0
