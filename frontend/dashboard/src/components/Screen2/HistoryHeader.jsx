import { useMemo } from 'react';
import { downloadCSV } from '../../utils/csvExport';

const RANGES = ['LAST 10', 'LAST HOUR', 'LAST DAY', 'ALL TIME'];

export default function HistoryHeader({ history, range, setRange }) {
    const stats = useMemo(() => {
        if (!history.length) return null;
        const scores = history.map(r => r.stress_score);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const peak = Math.max(...scores);
        const peakLevel = history.find(r => r.stress_score === peak)?.stress_level || '';

        let trend = '→ Stable';
        if (history.length >= 6) {
            const last3 = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
            const prev3 = scores.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
            if (last3 - prev3 > 3) trend = '↑ Worsening';
            else if (prev3 - last3 > 3) trend = '↓ Improving';
        }
        return { avg: avg.toFixed(1), peak: peak.toFixed(1), peakLevel, total: history.length, trend };
    }, [history]);

    return (
        <div style={{ marginBottom: 'var(--sp-6)' }}>
            {/* Row 1: Title + Export */}
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--sp-4)' }}>
                <span className="t-section">HISTORY & TRENDS</span>
                <button onClick={() => downloadCSV(history)}
                    className="cursor-pointer font-mono"
                    style={{
                        fontSize: 10,
                        padding: '6px 14px',
                        borderRadius: 20,
                        background: 'transparent',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                    }}>
                    ↓ EXPORT CSV
                </button>
            </div>

            {/* Row 2: Time range pills + summary stats */}
            <div className="flex items-center justify-between" style={{ paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
                <div className="flex" style={{ gap: 'var(--sp-2)' }}>
                    {RANGES.map(r => {
                        const active = range === r;
                        return (
                            <button key={r} onClick={() => setRange(r)}
                                className="cursor-pointer font-mono"
                                style={{
                                    fontSize: 10,
                                    letterSpacing: '1px',
                                    padding: '5px 12px',
                                    borderRadius: 20,
                                    background: active ? 'var(--accent-dim)' : 'transparent',
                                    color: active ? 'var(--accent)' : 'var(--muted2)',
                                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                                }}>
                                {r}
                            </button>
                        );
                    })}
                </div>

                {stats && (
                    <div className="flex" style={{ gap: 'var(--sp-3)' }}>
                        {[
                            { label: 'Avg', value: stats.avg },
                            { label: 'Peak', value: `${stats.peak}` },
                            { label: 'N', value: stats.total },
                            { label: 'Trend', value: stats.trend },
                        ].map(s => (
                            <span key={s.label} className="t-meta" style={{ fontSize: 10 }}>
                                <span style={{ color: 'var(--muted)' }}>{s.label}: </span>
                                <span style={{ color: 'var(--text)' }}>{s.value}</span>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
