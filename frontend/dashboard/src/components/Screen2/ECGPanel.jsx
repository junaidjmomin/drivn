import { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ReferenceLine, ReferenceArea, ResponsiveContainer
} from 'recharts';

export default function ECGPanel({ history }) {
    const data = useMemo(() => history.map(r => ({
        time: r.timestamp ? new Date(r.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '',
        qrs: r.inputs?.qrs_duration,
        st: r.inputs?.st_segment,
    })), [history]);

    if (!data.length) return null;

    return (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
            <div className="t-label" style={{
                marginBottom: 'var(--sp-4)',
                paddingBottom: 'var(--sp-3)',
                borderBottom: '1px solid var(--border)',
            }}>ECG PARAMETERS</div>
            <div className="grid grid-cols-2" style={{ gap: 'var(--sp-5)' }}>
                {/* QRS Duration */}
                <div className="card" style={{ padding: 'var(--sp-4)' }}>
                    <div className="t-label" style={{ marginBottom: 'var(--sp-3)', paddingBottom: 'var(--sp-2)', borderBottom: '1px solid var(--border)' }}>QRS DURATION</div>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[0.06, 0.20]} tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                            <ReferenceArea y1={0.06} y2={0.10} fill="#3DDC84" fillOpacity={0.05} />
                            <ReferenceArea y1={0.10} y2={0.12} fill="#F5A623" fillOpacity={0.05} />
                            <ReferenceArea y1={0.12} y2={0.20} fill="#FF4757" fillOpacity={0.05} />
                            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                            <Line type="monotone" dataKey="qrs" stroke="var(--accent)" strokeWidth={2}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    if (!cx || !cy) return null;
                                    return <circle cx={cx} cy={cy} r={3} fill={payload.qrs > 0.12 ? '#F5A623' : '#3DDC84'} stroke="none" />;
                                }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* ST Segment */}
                <div className="card" style={{ padding: 'var(--sp-4)' }}>
                    <div className="t-label" style={{ marginBottom: 'var(--sp-3)', paddingBottom: 'var(--sp-2)', borderBottom: '1px solid var(--border)' }}>ST SEGMENT</div>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                            <YAxis domain={[-0.20, 0.20]} tick={{ fontSize: 8, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                            <ReferenceLine y={0} stroke="var(--muted)" strokeDasharray="4 4" />
                            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                            <Line type="monotone" dataKey="st" stroke="var(--accent)" strokeWidth={2}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    if (!cx || !cy) return null;
                                    return <circle cx={cx} cy={cy} r={3} fill={payload.st < -0.05 ? '#FF4757' : payload.st > 0.05 ? '#3DDC84' : 'var(--accent)'} stroke="none" />;
                                }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
