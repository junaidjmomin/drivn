import { useMemo } from 'react';
import { getContributions } from '../../utils/contributions';

export default function PhysioEnvSplit({ inputs }) {
    const split = useMemo(() => {
        if (!inputs) return null;
        const contribs = getContributions(inputs.heart_rate, inputs.hr_variability, inputs.spo2, inputs.aqi, inputs.temperature);
        const physio = contribs.filter(c => c.category === 'physiological');
        const env = contribs.filter(c => c.category === 'environmental');
        const physioTotal = physio.reduce((s, c) => s + c.pct, 0);
        const envTotal = env.reduce((s, c) => s + c.pct, 0);
        return { physioTotal, envTotal, physio, env };
    }, [inputs]);

    if (!split) return null;

    return (
        <div style={{ padding: '24px 0' }}>
            {/* Split bar */}
            <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'var(--border)', marginBottom: 'var(--sp-5)' }}>
                <div className="h-full" style={{ width: `${split.physioTotal}%`, background: '#4dabf7' }} />
                <div className="h-full" style={{ width: `${split.envTotal}%`, background: '#3DDC84' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 0 }}>
                {/* Physiological */}
                <div className="text-center">
                    <div className="font-display leading-none" style={{ fontSize: 40, color: '#4dabf7' }}>
                        {split.physioTotal.toFixed(0)}%
                    </div>
                    <div className="t-label" style={{ color: '#4dabf7', marginTop: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
                        PHYSIOLOGICAL
                    </div>
                    <div className="flex flex-col" style={{ gap: 'var(--sp-1)' }}>
                        {split.physio.map(c => (
                            <span key={c.name} className="t-meta">{c.name}: {c.pct.toFixed(1)}%</span>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 60, background: 'var(--border)', margin: '0 32px' }} />

                {/* Environmental */}
                <div className="text-center">
                    <div className="font-display leading-none" style={{ fontSize: 40, color: '#3DDC84' }}>
                        {split.envTotal.toFixed(0)}%
                    </div>
                    <div className="t-label" style={{ color: '#3DDC84', marginTop: 'var(--sp-2)', marginBottom: 'var(--sp-3)' }}>
                        ENVIRONMENTAL
                    </div>
                    <div className="flex flex-col" style={{ gap: 'var(--sp-1)' }}>
                        {split.env.map(c => (
                            <span key={c.name} className="t-meta">{c.name}: {c.pct.toFixed(1)}%</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
