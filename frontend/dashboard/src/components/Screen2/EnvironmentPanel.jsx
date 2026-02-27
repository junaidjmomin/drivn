import { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ReferenceArea, ResponsiveContainer
} from 'recharts';

export default function EnvironmentPanel({ history }) {
    const data = useMemo(() => history.map(r => ({
        time: r.timestamp ? new Date(r.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
        aqi: r.inputs?.aqi,
        temp: r.inputs?.temperature,
        envScore: ((r.inputs?.aqi || 0) / 500) * 60 + (Math.abs((r.inputs?.temperature || 23) - 23) / 37) * 40,
    })), [history]);

    if (!data.length) return null;

    return (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
            <div className="t-label" style={{
                marginBottom: 'var(--sp-4)',
                paddingBottom: 'var(--sp-3)',
                borderBottom: '1px solid var(--border)',
            }}>ENVIRONMENT</div>
            <div className="grid grid-cols-2" style={{ gap: 'var(--sp-5)' }}>
                <div className="card" style={{ padding: 'var(--sp-4)' }}>
                    <div className="t-label" style={{ marginBottom: 'var(--sp-3)', paddingBottom: 'var(--sp-2)', borderBottom: '1px solid var(--border)' }}>AIR QUALITY INDEX</div>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0, 500]} tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                            <ReferenceArea y1={0} y2={50} fill="#3DDC84" fillOpacity={0.05} />
                            <ReferenceArea y1={50} y2={100} fill="#F5A623" fillOpacity={0.05} />
                            <ReferenceArea y1={100} y2={150} fill="#FF6B35" fillOpacity={0.05} />
                            <ReferenceArea y1={150} y2={200} fill="#FF4757" fillOpacity={0.05} />
                            <ReferenceArea y1={200} y2={300} fill="#9B59B6" fillOpacity={0.05} />
                            <ReferenceArea y1={300} y2={500} fill="#7B0000" fillOpacity={0.05} />
                            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                            <Line type="monotone" dataKey="aqi" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent)' }} />
                            <Line type="monotone" dataKey="envScore" stroke="#9B59B6" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ padding: 'var(--sp-4)' }}>
                    <div className="t-label" style={{ marginBottom: 'var(--sp-3)', paddingBottom: 'var(--sp-2)', borderBottom: '1px solid var(--border)' }}>TEMPERATURE</div>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[-20, 60]} tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                            <ReferenceArea y1={-20} y2={10} fill="#4dabf7" fillOpacity={0.05} label={{ value: 'Cold', position: 'insideRight', fontSize: 7, fill: '#4dabf7' }} />
                            <ReferenceArea y1={18} y2={28} fill="#3DDC84" fillOpacity={0.05} label={{ value: 'Comfort', position: 'insideRight', fontSize: 7, fill: '#3DDC84' }} />
                            <ReferenceArea y1={35} y2={60} fill="#FF4757" fillOpacity={0.05} label={{ value: 'Heat', position: 'insideRight', fontSize: 7, fill: '#FF4757' }} />
                            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                            <Line type="monotone" dataKey="temp" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent)' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
