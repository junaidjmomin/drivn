import { useMemo, useEffect, useState } from 'react';
import { getContributions } from '../../utils/contributions';

function getBarStatus(pct, maxPct) {
    if (pct === maxPct && pct > 0) return { color: '#FF4757', label: '⚠️ Elevated' };
    if (pct > 15) return { color: '#F5A623', label: '⚠️ Watch' };
    return { color: '#3DDC84', label: '✓ Normal' };
}

const NORMAL_RANGES = {
    'Heart Rate': '60–100 bpm',
    'HRV': '40–100 ms',
    'SpO₂': '97–100%',
    'AQI': '0–50',
    'Temperature': '18–28°C',
};

export default function ContributionChart({ inputs }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(false);
        const t = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(t);
    }, [inputs]);

    const contribs = useMemo(() => {
        if (!inputs) return [];
        return getContributions(inputs.heart_rate, inputs.hr_variability, inputs.spo2, inputs.aqi, inputs.temperature);
    }, [inputs]);

    if (!contribs.length) return null;

    const physio = contribs.filter(c => c.category === 'physiological');
    const env = contribs.filter(c => c.category === 'environmental');
    const maxPct = Math.max(...contribs.map(c => c.pct));

    const renderGroup = (items, label, dotColor) => (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
            <div className="t-label flex items-center"
                style={{
                    marginTop: 28, marginBottom: 'var(--sp-4)',
                    paddingBottom: 'var(--sp-2)', borderBottom: '1px solid var(--border)',
                    gap: 'var(--sp-2)',
                }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
                {label}
            </div>
            {items.map(c => {
                const status = getBarStatus(c.pct, maxPct);
                const isMax = c.pct === maxPct && c.pct > 0;
                return (
                    <div key={c.name} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        {/* Line 1: name + percentage */}
                        <div className="flex justify-between items-center" style={{ marginBottom: 'var(--sp-2)' }}>
                            <span className="font-mono" style={{ fontSize: 11, color: 'var(--text)' }}>{c.name}</span>
                            <span className="font-mono" style={{ fontSize: 11, color: status.color, fontWeight: 600 }}>
                                {c.pct.toFixed(1)}%
                            </span>
                        </div>

                        {/* Bar track */}
                        <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: 'var(--border)' }}>
                            <div className="h-full rounded-full"
                                style={{
                                    width: mounted ? `${Math.max(c.pct, 1)}%` : '0%',
                                    background: status.color,
                                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isMax ? `0 0 12px ${status.color}40` : 'none',
                                }} />
                        </div>

                        {/* Line 2: raw value + normal range + status */}
                        <div className="flex items-center t-meta" style={{ marginTop: 'var(--sp-2)', gap: 'var(--sp-3)', fontSize: 10 }}>
                            <span>{c.raw}</span>
                            <span style={{ color: 'var(--muted)' }}>·</span>
                            <span style={{ color: 'var(--muted)' }}>Normal: {NORMAL_RANGES[c.name] || ''}</span>
                            <span style={{ color: 'var(--muted)' }}>·</span>
                            <span style={{ color: status.color }}>{status.label}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
            <div className="t-label" style={{ marginBottom: 'var(--sp-2)' }}>
                STRESS CONTRIBUTION ANALYSIS
            </div>
            {renderGroup(physio, 'PHYSIOLOGICAL STRESSORS', '#4dabf7')}
            {renderGroup(env, 'ENVIRONMENTAL STRESSORS', '#3DDC84')}
        </div>
    );
}
