import { useState } from 'react';

const CLINICAL_RANGES = {
    heart_rate: { min: 60, max: 100 },
    spo2: { min: 95, max: 100 },
    raw_ir: { min: 40000, max: 65000 },
    raw_red: { min: 38000, max: 60000 },
    hr_variability: { min: 20, max: 100 },
    qrs_duration: { min: 0.06, max: 0.12 },
    st_segment: { min: -0.05, max: 0.05 },
    aqi: { min: 0, max: 50 },
    temperature: { min: 18, max: 28 },
};

function isOutOfRange(key, val) {
    const range = CLINICAL_RANGES[key];
    if (!range) return false;
    return val < range.min || val > range.max;
}

export default function SensorPayload({ inputs }) {
    const [open, setOpen] = useState(false);
    if (!inputs) return null;

    return (
        <div>
            {/* Centered toggle with lines */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center cursor-pointer"
                style={{
                    padding: '12px 0',
                    background: 'transparent',
                    border: 'none',
                    gap: 'var(--sp-3)',
                }}
            >
                <span className="flex-1" style={{ borderTop: '1px solid var(--border)' }} />
                <span className="t-meta" style={{ fontSize: 9, whiteSpace: 'nowrap' }}>
                    SENSOR PAYLOAD {open ? '▲' : '▼'}
                </span>
                <span className="flex-1" style={{ borderTop: '1px solid var(--border)' }} />
            </button>

            {open && (
                <div className="card" style={{ padding: 'var(--sp-4)' }}>
                    <div className="grid grid-cols-3" style={{ gap: '8px 24px' }}>
                        {Object.entries(inputs).map(([key, val]) => (
                            <div key={key} className="flex justify-between font-mono" style={{ fontSize: 10 }}>
                                <span style={{ color: 'var(--muted)' }}>{key}</span>
                                <span style={{ color: isOutOfRange(key, val) ? '#FF4757' : 'var(--text)' }}>
                                    {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(2)) : val}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
