import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function getAqiLabel(val) {
    if (val <= 50) return { label: 'GOOD', color: '#3DDC84' };
    if (val <= 100) return { label: 'MODERATE', color: '#F5A623' };
    if (val <= 150) return { label: 'USG', color: '#FF6B35' };
    if (val <= 200) return { label: 'UNHEALTHY', color: '#FF4757' };
    if (val <= 300) return { label: 'V.UNHEALTHY', color: '#9B59B6' };
    return { label: 'HAZARDOUS', color: '#7B0000' };
}

function getHrColor(v) { return v > 120 || v < 50 ? '#FF4757' : v > 100 ? '#F5A623' : '#3DDC84'; }
function getSpo2Color(v) { return v < 95 ? '#FF4757' : v < 97 ? '#F5A623' : '#3DDC84'; }
function getHrvColor(v) { return v < 20 ? '#FF4757' : v < 40 ? '#F5A623' : '#3DDC84'; }

const CARDS = [
    { key: 'heart_rate', label: 'HEART RATE', unit: 'bpm', inputKey: 'heart_rate', getColor: getHrColor },
    { key: 'spo2', label: 'SpO₂', unit: '%', inputKey: 'spo2', getColor: getSpo2Color },
    { key: 'hrv', label: 'HRV', unit: 'ms', inputKey: 'hr_variability', getColor: getHrvColor },
    { key: 'aqi', label: 'AQI', unit: '', inputKey: 'aqi', getColor: null, isAqi: true },
];

function Sparkline({ data, color }) {
    if (!data || data.length < 2) return null;
    return (
        <div style={{ width: 80, height: 36 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function MetricCards({ result, history }) {
    const sparkData = useMemo(() => {
        const last5 = history.slice(-5);
        const out = {};
        CARDS.forEach(c => {
            out[c.key] = last5.map(r => ({ v: r.inputs?.[c.inputKey] ?? r.sensor_summary?.[c.key] ?? 0 }));
        });
        return out;
    }, [history]);

    if (!result) return null;

    const vals = {
        heart_rate: result.sensor_summary?.heart_rate ?? result.inputs?.heart_rate,
        spo2: result.sensor_summary?.spo2 ?? result.inputs?.spo2,
        hrv: result.sensor_summary?.hrv ?? result.inputs?.hr_variability,
        aqi: result.sensor_summary?.aqi ?? result.inputs?.aqi,
    };

    return (
        <div className="grid grid-cols-4" style={{ gap: 'var(--sp-4)' }}>
            {CARDS.map(card => {
                const val = vals[card.key];
                const statusColor = card.getColor ? card.getColor(val) : '#3DDC84';
                const aqiInfo = card.isAqi ? getAqiLabel(val) : null;
                const sparkColor = card.key === 'hrv' ? getHrvColor(val) : 'var(--accent)';

                return (
                    <div key={card.key}
                        className="card relative"
                        style={{
                            padding: 20,
                            borderBottom: '2px solid var(--accent)',
                            minHeight: 110,
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                        {/* Status dot — top-right corner */}
                        <span className="absolute" style={{
                            top: 12, right: 12,
                            width: 6, height: 6, borderRadius: '50%',
                            backgroundColor: statusColor,
                        }} />

                        <span className="t-label" style={{ fontSize: 9 }}>
                            {card.label}
                        </span>

                        <div className="font-display" style={{
                            fontSize: 32, lineHeight: 1,
                            color: 'var(--text)',
                            marginTop: 'var(--sp-2)',
                        }}>
                            {typeof val === 'number' ? (Number.isInteger(val) ? val : val.toFixed(1)) : val}
                        </div>
                        <div className="t-meta" style={{ fontSize: 9, marginTop: 'var(--sp-1)' }}>
                            {card.unit}
                        </div>

                        {aqiInfo && (
                            <div className="t-meta" style={{ color: aqiInfo.color, marginTop: 'var(--sp-1)' }}>
                                {aqiInfo.label}
                            </div>
                        )}

                        <div className="mt-auto" style={{ paddingTop: 'var(--sp-2)' }}>
                            <Sparkline data={sparkData[card.key]} color={sparkColor} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
