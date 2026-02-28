import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Heart,
  Wind,
  AlertTriangle,
  CheckCircle2,
  Info,
  Zap,
  Cpu,
  RefreshCw,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface Prediction {
  timestamp: string;
  stress_level: "low" | "moderate" | "high";
  stress_score: number;
  confidence: number;
  risk_factors: string[];
  recommendations: string[];
  sensor_summary: {
    heart_rate: number;
    spo2: number;
    hrv: number;
    aqi: number;
  };
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);

  useEffect(() => {
    fetch("/api/health").then(res => res.json()).then(setHealthStatus);
    fetch("/api/model-info").then(res => res.json()).then(setModelInfo);
  }, []);

  const generateRandomData = () => ({
    timestamp: new Date().toISOString(),
    max30102: {
      heart_rate: Math.floor(Math.random() * (120 - 60) + 60),
      spo2: Math.floor(Math.random() * (100 - 95) + 95),
      raw_ir: 50000,
      raw_red: 45000
    },
    ecg: {
      hr_variability: Math.random() * (80 - 20) + 20,
      qrs_duration: 0.12,
      st_segment: 0.05,
      raw_signal: []
    },
    aqi: {
      value: Math.floor(Math.random() * 200),
      pm25: Math.random() * 50,
      pm10: Math.random() * 70,
      no2: Math.random() * 30,
      o3: Math.random() * 60
    }
  });

  const getPrediction = async () => {
    setLoading(true);
    try {
      const data = generateRandomData();
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="scanline" />
      <div className="cyber-grid fixed inset-0 z-0 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/50 cyber-glow">
              <Activity className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white">
                DRIVN <span className="text-cyan-400">OS</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-cyan-500/60 font-mono">
                Urban Wellness Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${healthStatus ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-white/60 uppercase">System: {healthStatus ? 'Online' : 'Offline'}</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-white/40">
              <Cpu className="w-3 h-3" />
              <span className="uppercase">Model: {modelInfo?.model_name || 'Loading...'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Controls & Info */}
        <div className="lg:col-span-4 space-y-8">
          <section className="cyber-border bg-card-bg p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400 w-5 h-5" />
              Control Center
            </h2>
            <p className="text-sm text-white/60 mb-6">
              Initialize real-time biometric analysis. Our AI engine processes 14+ sensor features to determine your current urban stress profile.
            </p>
            <button
              onClick={getPrediction}
              disabled={loading}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-900 text-black font-bold rounded-md transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  RUN PREDICTION
                </>
              )}
            </button>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/40">System Diagnostics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-md border border-white/10">
                <p className="text-[10px] text-white/40 uppercase mb-1">Accuracy</p>
                <p className="text-xl font-bold font-mono text-cyan-400">{modelInfo?.accuracy ? (modelInfo.accuracy * 100).toFixed(1) : '--'}%</p>
              </div>
              <div className="bg-white/5 p-4 rounded-md border border-white/10">
                <p className="text-[10px] text-white/40 uppercase mb-1">Latency</p>
                <p className="text-xl font-bold font-mono text-magenta-400">12ms</p>
              </div>
            </div>
          </section>

          <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-md">
            <div className="flex gap-3">
              <Info className="text-cyan-400 w-5 h-5 shrink-0" />
              <p className="text-xs text-cyan-100/70 leading-relaxed">
                DRIVN uses a hybrid Random Forest and LLM architecture to provide high-fidelity stress insights based on heart rate variability and environmental AQI.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {prediction ? (
              <motion.div
                key="prediction"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                {/* Stress Level Hero */}
                <div className={`cyber-border p-8 rounded-xl relative overflow-hidden ${prediction.stress_level === 'high' ? 'bg-red-500/10 border-red-500/30' :
                    prediction.stress_level === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/30' :
                      'bg-emerald-500/10 border-emerald-500/30'
                  }`}>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2">Current Stress State</p>
                      <h2 className={`text-6xl font-black uppercase tracking-tighter ${prediction.stress_level === 'high' ? 'text-red-400' :
                          prediction.stress_level === 'moderate' ? 'text-yellow-400' :
                            'text-emerald-400'
                        }`}>
                        {prediction.stress_level}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono uppercase tracking-widest text-white/60 mb-1">Stress Score</p>
                      <div className="text-5xl font-mono font-bold">{prediction.stress_score}</div>
                      <div className="w-32 h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.stress_score}%` }}
                          className={`h-full ${prediction.stress_level === 'high' ? 'bg-red-500' :
                              prediction.stress_level === 'moderate' ? 'bg-yellow-500' :
                                'bg-emerald-500'
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sensor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <StatCard icon={<Heart className="text-red-400" />} label="Heart Rate" value={`${prediction.sensor_summary.heart_rate} BPM`} />
                  <StatCard icon={<Activity className="text-cyan-400" />} label="HRV" value={`${prediction.sensor_summary.hrv.toFixed(1)} ms`} />
                  <StatCard icon={<ShieldCheck className="text-emerald-400" />} label="SpO2" value={`${prediction.sensor_summary.spo2}%`} />
                  <StatCard icon={<Wind className="text-blue-400" />} label="AQI" value={prediction.sensor_summary.aqi.toString()} />
                </div>

                {/* Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-white/80">
                      <AlertTriangle className="text-yellow-500 w-4 h-4" />
                      Risk Factors
                    </h3>
                    <ul className="space-y-2">
                      {prediction.risk_factors.map((risk, i) => (
                        <li key={i} className="flex gap-3 text-sm text-white/60 bg-white/5 p-3 rounded border border-white/5">
                          <ChevronRight className="w-4 h-4 text-cyan-500 shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-white/80">
                      <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-3 text-sm text-white/60 bg-white/5 p-3 rounded border border-white/5">
                          <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 cyber-border rounded-xl bg-white/5 border-dashed"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Activity className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-2xl font-bold text-white/40 mb-2">Awaiting Sensor Input</h2>
                <p className="text-sm text-white/20 max-w-xs">
                  Connect your biometric hardware or run a simulation to begin urban wellness tracking.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-8 mt-12 bg-black/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
            © 2026 DRIVN URBAN INTELLIGENCE // ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-6 items-center">
            <a href="#" className="text-[10px] font-mono text-white/30 hover:text-cyan-400 transition-colors uppercase tracking-widest">Documentation</a>
            <a href="#" className="text-[10px] font-mono text-white/30 hover:text-cyan-400 transition-colors uppercase tracking-widest">API Status</a>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded font-mono text-[9px] text-cyan-400/60">
              <span className="uppercase opacity-50">App URL:</span>
              <a href={process.env.APP_URL} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                {process.env.APP_URL?.replace('https://', '')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-card-bg p-4 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">{label}</span>
    </div>
    <p className="text-xl font-bold font-mono">{value}</p>
  </div>
);

export default App;
