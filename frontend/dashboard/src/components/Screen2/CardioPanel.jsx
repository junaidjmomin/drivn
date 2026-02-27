import { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ReferenceLine, ResponsiveContainer
} from 'recharts';

function ChartCard({ title, data, dataKey, domain, dotFn, children }) {
    return (
        <div className="card" style={{ padding: 'var(--sp-4)' }}>
            <div className="t-label" style={{
                marginBottom: 'var(--sp-3)',
                paddingBottom: 'var(--sp-2)',
                borderBottom: '1px solid var(--border)',
            }}>{title}</div>
            <ResponsiveContainer width="100%" height={160}>
                <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                    <YAxis domain={domain} tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                    {children}
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                    <Line type="monotone" dataKey={dataKey} stroke="var(--accent)" strokeWidth={2}
                        dot={dotFn || { r: 3, fill: 'var(--accent)' }} activeDot={{ r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function CardioPanel({ history }) {
    const data = useMemo(() => history.map(r => ({
        time: r.timestamp ? new Date(r.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
        hr: r.inputs?.heart_rate,
        spo2: r.inputs?.spo2,
        hrv: r.inputs?.hr_variability,
    })), [history]);

    if (!data.length) return null;

    const hrDot = (props) => {
        const { cx, cy, payload } = props;
        if (!cx || !cy) return null;
        const v = payload.hr;
        return <circle cx={cx} cy={cy} r={3} fill={v > 100 ? '#FF4757' : v < 60 ? '#4dabf7' : '#3DDC84'} stroke="none" />;
    };
    const spo2Dot = (props) => {
        const { cx, cy, payload } = props;
        if (!cx || !cy) return null;
        return <circle cx={cx} cy={cy} r={3} fill={payload.spo2 < 95 ? '#FF4757' : '#3DDC84'} stroke="none" />;
    };
    const hrvDot = (props) => {
        const { cx, cy, payload } = props;
        if (!cx || !cy) return null;
        const v = payload.hrv;
        return <circle cx={cx} cy={cy} r={3} fill={v < 20 ? '#FF4757' : v < 40 ? '#F5A623' : '#3DDC84'} stroke="none" />;
    };

    return (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
            <div className="t-label" style={{
                marginBottom: 'var(--sp-4)',
                paddingBottom: 'var(--sp-3)',
                borderBottom: '1px solid var(--border)',
            }}>CARDIOVASCULAR</div>
            <div className="grid grid-cols-3" style={{ gap: 'var(--sp-5)' }}>
                <ChartCard title="HEART RATE" data={data} dataKey="hr" domain={[30, 200]} dotFn={hrDot}>
                    <ReferenceLine y={60} stroke="#F5A623" strokeDasharray="4 4" strokeOpacity={0.5} />
                    <ReferenceLine y={100} stroke="#F5A623" strokeDasharray="4 4" strokeOpacity={0.5} />
                </ChartCard>
                <ChartCard title="SpO₂" data={data} dataKey="spo2" domain={[85, 100]} dotFn={spo2Dot}>
                    <ReferenceLine y={95} stroke="#FF4757" strokeDasharray="4 4" strokeOpacity={0.5} />
                    <ReferenceLine y={97} stroke="#F5A623" strokeDasharray="4 4" strokeOpacity={0.5} />
                </ChartCard>
                <ChartCard title="HRV" data={data} dataKey="hrv" domain={[0, 100]} dotFn={hrvDot}>
                    <ReferenceLine y={20} stroke="#FF4757" strokeDasharray="4 4" strokeOpacity={0.5} />
                    <ReferenceLine y={40} stroke="#F5A623" strokeDasharray="4 4" strokeOpacity={0.5} />
                </ChartCard>
            </div>
        </div>
    );
}
