import { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ReferenceLine, ReferenceArea, ResponsiveContainer
} from 'recharts';
import { getLevelColor } from '../../utils/stressTheme';

function CustomDot(props) {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;
    return <circle cx={cx} cy={cy} r={4} fill={getLevelColor(payload.level)} stroke="none" />;
}

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
        <div className="card" style={{ padding: 12, maxWidth: 280, fontSize: 10, fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontWeight: 700, marginBottom: 4, color: getLevelColor(d.level) }}>
                {d.level?.toUpperCase()} — {d.score}
            </div>
            <div className="t-meta">{d.time}</div>
            <div className="grid grid-cols-2" style={{ gap: '2px 16px', marginTop: 8, color: 'var(--text)' }}>
                <span>HR: {d.hr}</span><span>SpO₂: {d.spo2}%</span>
                <span>HRV: {d.hrv}</span><span>AQI: {d.aqi}</span>
                <span>QRS: {d.qrs}s</span><span>ST: {d.st} mV</span>
                <span>Temp: {d.temp}°C</span><span>Conf: {Math.round((d.confidence || 0) * 100)}%</span>
            </div>
        </div>
    );
}

export default function StressTimeline({ history }) {
    const data = useMemo(() => history.map(r => {
        const inp = r.inputs || {};
        return {
            time: r.timestamp ? new Date(r.timestamp).toLocaleTimeString('en-GB') : '',
            score: r.stress_score,
            level: r.stress_level,
            confidence: r.confidence,
            hr: inp.heart_rate, spo2: inp.spo2, hrv: inp.hr_variability,
            aqi: inp.aqi, qrs: inp.qrs_duration, st: inp.st_segment, temp: inp.temperature,
        };
    }), [history]);

    const peakScore = useMemo(() => Math.max(...data.map(d => d.score || 0), 0), [data]);

    if (!data.length) return null;

    return (
        <div className="card" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-5)' }}>
            <div className="t-label" style={{
                marginBottom: 'var(--sp-4)',
                paddingBottom: 'var(--sp-3)',
                borderBottom: '1px solid var(--border)',
            }}>
                STRESS TIMELINE
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <ReferenceArea y1={0} y2={25} fill="#3DDC84" fillOpacity={0.04} />
                    <ReferenceArea y1={25} y2={50} fill="#F5A623" fillOpacity={0.04} />
                    <ReferenceArea y1={50} y2={75} fill="#FF6B35" fillOpacity={0.04} />
                    <ReferenceArea y1={75} y2={100} fill="#FF4757" fillOpacity={0.04} />
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={peakScore} stroke="var(--accent)" strokeDasharray="4 4"
                        label={{ value: 'PEAK', position: 'right', fill: 'var(--accent)', fontSize: 9 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2}
                        fill="url(#areaFill)" dot={<CustomDot />} activeDot={{ r: 6 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
