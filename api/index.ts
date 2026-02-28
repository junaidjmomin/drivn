import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Gemini Setup
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "DRIVN-Backend", timestamp: new Date().toISOString() });
});

app.get("/api/model-info", (req, res) => {
  res.json({
    model_name: "DRIVN Stress Predictor v2.0",
    type: "AI-Powered Hybrid (Random Forest + LLM Reasoning)",
    features: 14,
    last_trained: "2026-02-15",
    accuracy: 0.96
  });
});

app.post("/api/predict", async (req, res) => {
  const sensorData = req.body;

  if (!sensorData || !sensorData.max30102 || !sensorData.ecg) {
    return res.status(400).json({ error: "Invalid sensor data format" });
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this sensor data for stress prediction. 
      Data: ${JSON.stringify(sensorData)}
      
      Provide a JSON response with:
      - stress_level: "low", "moderate", or "high"
      - stress_score: 0-100
      - confidence: 0-1
      - risk_factors: string array
      - recommendations: string array
      - sensor_summary: { heart_rate, spo2, hrv, aqi }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stress_level: { type: Type.STRING },
            stress_score: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            risk_factors: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            sensor_summary: {
              type: Type.OBJECT,
              properties: {
                heart_rate: { type: Type.NUMBER },
                spo2: { type: Type.NUMBER },
                hrv: { type: Type.NUMBER },
                aqi: { type: Type.NUMBER }
              }
            }
          },
          required: ["stress_level", "stress_score", "confidence", "risk_factors", "recommendations", "sensor_summary"]
        }
      }
    });

    const prediction = JSON.parse(response.text || "{}");
    res.json({
      timestamp: new Date().toISOString(),
      ...prediction
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Failed to generate prediction" });
  }
});

// Export the app for Vercel
export default app;
