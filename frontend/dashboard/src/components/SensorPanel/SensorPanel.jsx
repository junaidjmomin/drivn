import { useState } from 'react';
import PresetLoader from './PresetLoader';
import SensorGroup from './SensorGroup';

export default function SensorPanel({ values, setValues, onPredict, loading, hasResult, apiUrl, setApiUrl }) {
    const [activePreset, setActivePreset] = useState(null);
    const [showConfig, setShowConfig] = useState(false);

    const handlePreset = (key, data) => {
        setActivePreset(key);
        setValues({
            heart_rate: data.hr,
            spo2: data.spo2,
            raw_ir: data.ir,
            raw_red: data.red,
            hr_variability: data.hrv,
            qrs_duration: data.qrs,
            st_segment: data.st,
            aqi: data.aqi,
            temperature: data.temp,
        });
    };

    const handleChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
        setActivePreset(null);
    };

    return (
        <div className="w-[300px] min-w-[300px] h-full overflow-y-auto flex flex-col"
            style={{
                background: 'var(--surface)',
                borderRight: '1px solid var(--border)',
                padding: 'var(--sp-4)',
                gap: 'var(--sp-4)',
            }}>

            {/* Single-line header */}
            <div className="t-label" style={{ letterSpacing: '2px' }}>
                SENSOR INPUT
            </div>

            <PresetLoader activePreset={activePreset} onLoad={handlePreset} />

            <SensorGroup values={values} onChange={handleChange} />

            {/* Separator + Predict button area */}
            <div style={{ marginTop: 'var(--sp-1)' }}>
                <div style={{ borderTop: '1px solid var(--border)', marginBottom: 'var(--sp-4)' }} />
                <button
                    onClick={onPredict}
                    disabled={loading}
                    className="predict-btn relative w-full rounded-lg font-display tracking-wider cursor-pointer overflow-hidden"
                    style={{
                        padding: '11px 0',
                        fontSize: 18,
                        background: 'var(--accent)',
                        color: '#05050a',
                        border: 'none',
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {!loading && (
                        <span className="absolute inset-0 overflow-hidden pointer-events-none">
                            <span className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                    animation: 'shimmer 3s infinite',
                                }} />
                        </span>
                    )}
                    <span className="relative z-10">
                        {loading ? (
                            <span className="inline-flex items-center" style={{ gap: 'var(--sp-2)' }}>
                                <svg className="animate-spin" style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                                </svg>
                                PREDICTING...
                            </span>
                        ) : hasResult ? 'PREDICT AGAIN' : 'PREDICT STRESS'}
                    </span>
                </button>
            </div>

            {/* API Config Accordion */}
            <div className="rounded-lg" style={{ border: '1px solid var(--border)' }}>
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="w-full flex justify-between items-center cursor-pointer"
                    style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: 'var(--muted)' }}
                >
                    <span className="t-meta" style={{ fontSize: 9 }}>API CONFIG</span>
                    <span style={{ fontSize: 9, color: 'var(--muted)' }}>{showConfig ? '▲' : '▼'}</span>
                </button>
                {showConfig && (
                    <div style={{ padding: '0 12px 12px' }}>
                        <input
                            type="text"
                            value={apiUrl}
                            onChange={e => setApiUrl(e.target.value)}
                            className="w-full rounded font-mono"
                            style={{
                                padding: '6px 8px',
                                fontSize: 11,
                                background: 'var(--bg)',
                                color: 'var(--text)',
                                border: '1px solid var(--border)',
                                outline: 'none',
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
