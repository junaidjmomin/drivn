import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import SensorPanel from './components/SensorPanel/SensorPanel';
import LiveMonitor from './pages/LiveMonitor';
import HistoryTrends from './pages/HistoryTrends';
import StressAnalyser from './pages/StressAnalyser';
import { useHistory } from './hooks/useHistory';
import { predict, setBaseUrl, getBaseUrl } from './api/drivnApi';
import { applyTheme } from './utils/stressTheme';

const DEFAULT_VALUES = {
  heart_rate: 72, spo2: 98, raw_ir: 50000, raw_red: 45000,
  hr_variability: 45.5, qrs_duration: 0.12, st_segment: 0.05,
  aqi: 65, temperature: 22.5,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('live');
  const [lastResult, setLastResult] = useState(null);
  const [lastInputs, setLastInputs] = useState(null);
  const [sensorValues, setSensorValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState(getBaseUrl());

  const { history, addReading } = useHistory();

  const handleUrlChange = useCallback((url) => {
    setApiUrl(url);
    setBaseUrl(url);
  }, []);

  const handlePredict = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        max30102: {
          heart_rate: sensorValues.heart_rate,
          spo2: sensorValues.spo2,
          raw_ir: sensorValues.raw_ir,
          raw_red: sensorValues.raw_red,
        },
        ecg: {
          hr_variability: sensorValues.hr_variability,
          qrs_duration: sensorValues.qrs_duration,
          st_segment: sensorValues.st_segment,
          raw_signal: [],
        },
        aqi: {
          value: sensorValues.aqi,
          pm25: sensorValues.aqi * 0.4,
          pm10: sensorValues.aqi * 0.6,
          no2: Math.round(sensorValues.aqi * 0.15),
          o3: Math.round(sensorValues.aqi * 0.35),
        },
        environment: {
          temperature: sensorValues.temperature,
        },
      };

      const res = await predict(payload);
      const data = res.data;

      applyTheme(data.stress_level);
      setLastResult(data);
      setLastInputs({ ...sensorValues });
      addReading(data, { ...sensorValues });
    } catch (err) {
      console.error('Prediction failed:', err);
      alert('Prediction failed. Ensure the backend is running at ' + apiUrl);
    } finally {
      setLoading(false);
    }
  }, [sensorValues, addReading, apiUrl]);

  const renderPage = () => {
    switch (currentTab) {
      case 'live':
        return <LiveMonitor result={lastResult} inputs={lastInputs} history={history} />;
      case 'history':
        return <HistoryTrends history={history} />;
      case 'analyse':
        return <StressAnalyser result={lastResult} inputs={lastInputs} />;
      default:
        return <LiveMonitor result={lastResult} inputs={lastInputs} history={history} />;
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      <div className="flex flex-1 overflow-hidden" style={{ marginTop: 64 }}>
        <SensorPanel
          values={sensorValues}
          setValues={setSensorValues}
          onPredict={handlePredict}
          loading={loading}
          hasResult={!!lastResult}
          apiUrl={apiUrl}
          setApiUrl={handleUrlChange}
        />
        {renderPage()}
      </div>
    </div>
  );
}
