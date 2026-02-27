const PRESETS = {
    low: { hr: 72, spo2: 98, ir: 50000, red: 45000, hrv: 45.5, qrs: 0.12, st: 0.05, aqi: 65, temp: 22.5 },
    moderate: { hr: 88, spo2: 97, ir: 51000, red: 47000, hrv: 35.0, qrs: 0.11, st: 0.02, aqi: 85, temp: 28.0 },
    high: { hr: 105, spo2: 95, ir: 52000, red: 49000, hrv: 22.0, qrs: 0.13, st: -0.05, aqi: 125, temp: 34.5 },
    critical: { hr: 125, spo2: 92, ir: 55000, red: 53000, hrv: 12.5, qrs: 0.15, st: -0.15, aqi: 350, temp: 38.0 },
};

const DOT_COLORS = {
    low: '#3DDC84',
    moderate: '#F5A623',
    high: '#FF6B35',
    critical: '#FF4757',
};

const LABELS = { low: 'LOW', moderate: 'MOD', high: 'HIGH', critical: 'CRIT' };
const FULL_LABELS = { low: 'LOW', moderate: 'MODERATE', high: 'HIGH', critical: 'CRITICAL' };

export default function PresetLoader({ activePreset, onLoad }) {
    return (
        <div>
            {/* Single horizontal row of pills */}
            <div className="flex" style={{ gap: 'var(--sp-2)' }}>
                {Object.entries(PRESETS).map(([key, data]) => {
                    const active = activePreset === key;
                    const color = DOT_COLORS[key];
                    return (
                        <button
                            key={key}
                            onClick={() => onLoad(key, data)}
                            className="flex items-center cursor-pointer flex-1 justify-center"
                            style={{
                                padding: '8px 12px',
                                gap: 'var(--sp-1)',
                                borderRadius: 8,
                                background: active ? `${color}12` : 'transparent',
                                border: `1px solid ${active ? color : `${color}30`}`,
                            }}
                        >
                            <span style={{
                                width: 6, height: 6, borderRadius: '50%',
                                backgroundColor: color, display: 'inline-block',
                                animation: key === 'critical' ? 'pulse 2s ease-in-out infinite' : 'none',
                            }} />
                            <span className="t-label" style={{
                                fontSize: 9,
                                letterSpacing: '1px',
                                color: active ? color : 'var(--muted2)',
                            }}>
                                {LABELS[key]}
                            </span>
                        </button>
                    );
                })}
            </div>
            {activePreset && (
                <div className="t-meta" style={{
                    textAlign: 'center',
                    marginTop: 'var(--sp-2)',
                    fontSize: 9,
                }}>
                    Template: {FULL_LABELS[activePreset]} STRESS
                </div>
            )}
        </div>
    );
}
