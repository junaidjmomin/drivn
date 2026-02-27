import { useState } from 'react';

const METRICS = [
    { key: 'heart_rate', name: 'Heart Rate', normal: '60–100 bpm', unit: 'bpm', min: 60, max: 100, warnMin: 50, warnMax: 120, desc: 'Number of heartbeats per minute. Reflects cardiac workload.' },
    { key: 'spo2', name: 'SpO₂', normal: '97–100%', unit: '%', min: 97, max: 100, warnMin: 95, warnMax: 100, desc: 'Blood oxygen saturation. Below 95% indicates respiratory compromise.' },
    { key: 'hr_variability', name: 'HRV', normal: '40–100 ms', unit: 'ms', min: 40, max: 100, warnMin: 20, warnMax: 100, desc: 'Beat-to-beat variation. Higher values indicate better autonomic flexibility.' },
    { key: 'qrs_duration', name: 'QRS Duration', normal: '0.06–0.12 s', unit: 's', min: 0.06, max: 0.12, warnMin: 0.06, warnMax: 0.15, desc: 'Ventricular depolarisation duration. Prolonged may indicate conduction delays.' },
    { key: 'st_segment', name: 'ST Segment', normal: '-0.05 – +0.05 mV', unit: 'mV', min: -0.05, max: 0.05, warnMin: -0.10, warnMax: 0.10, desc: 'ECG segment for ventricular repolarisation. Depression may indicate ischemia.' },
    { key: 'aqi', name: 'AQI', normal: '0–50', unit: '', min: 0, max: 50, warnMin: 0, warnMax: 100, desc: 'Air Quality Index. Higher values indicate worse air quality.' },
    { key: 'temperature', name: 'Temperature', normal: '18–28°C', unit: '°C', min: 18, max: 28, warnMin: 10, warnMax: 35, desc: 'Ambient temperature. Extremes cause thermoregulatory stress.' },
];

function getStatus(val, metric) {
    if (val >= metric.min && val <= metric.max) return { icon: '✓', color: '#3DDC84', label: 'Normal' };
    if (val >= metric.warnMin && val <= metric.warnMax) return { icon: '⚠️', color: '#F5A623', label: 'Borderline' };
    return { icon: '🔴', color: '#FF4757', label: 'Critical' };
}

export default function NormalRangeTable({ inputs }) {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    if (!inputs) return null;

    return (
        <div className="card overflow-hidden" style={{ padding: 0 }}>
            <div className="t-label" style={{
                padding: '16px 16px 12px',
                borderBottom: '1px solid var(--border)',
            }}>NORMAL RANGE REFERENCE</div>
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th className="text-left t-label" style={{ padding: '8px 16px', background: 'var(--surface2)', fontSize: 9, letterSpacing: '2px' }}>Metric</th>
                        <th className="text-left t-label" style={{ padding: '8px 16px', background: 'var(--surface2)', fontSize: 9, letterSpacing: '2px' }}>Your Value</th>
                        <th className="text-left t-label" style={{ padding: '8px 16px', background: 'var(--surface2)', fontSize: 9, letterSpacing: '2px' }}>Normal Range</th>
                        <th className="text-left t-label" style={{ padding: '8px 16px', background: 'var(--surface2)', fontSize: 9, letterSpacing: '2px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {METRICS.map((m, idx) => {
                        const val = inputs[m.key];
                        if (val === undefined) return null;
                        const status = getStatus(val, m);
                        const isEven = idx % 2 === 0;
                        return (
                            <tr key={m.key}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                style={{
                                    borderBottom: '1px solid var(--border)',
                                    background: isEven ? 'rgba(255,255,255,0.01)' : 'transparent',
                                    position: 'relative',
                                }}>
                                <td className="relative" style={{ padding: '10px 16px' }}>
                                    <span className="font-mono" style={{ fontSize: 11, color: 'var(--text)' }}>
                                        {m.name}
                                    </span>
                                    {hoveredIdx === idx && (
                                        <div className="absolute z-20 rounded-lg shadow-lg"
                                            style={{
                                                left: 16, top: '100%',
                                                padding: 12, maxWidth: 280,
                                                background: 'var(--bg)', border: '1px solid var(--border2)',
                                            }}>
                                            <div className="t-body" style={{ fontSize: 11 }}>{m.desc}</div>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '10px 16px' }}>
                                    <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: status.color }}>
                                        {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : val} {m.unit}
                                    </span>
                                </td>
                                <td className="t-meta" style={{ padding: '10px 16px' }}>
                                    {m.normal}
                                </td>
                                <td style={{ padding: '10px 16px' }}>
                                    <span className="flex items-center font-mono" style={{ gap: 'var(--sp-1)', fontSize: 10, color: status.color }}>
                                        {status.icon} {status.label}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
