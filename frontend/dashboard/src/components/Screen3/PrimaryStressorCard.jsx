import { useMemo } from 'react';
import { getContributions } from '../../utils/contributions';

const EXPLANATIONS = {
    'Heart Rate': 'Elevated heart rate increases cardiac workload and is a primary stress indicator.',
    'HRV': 'Low heart rate variability indicates reduced parasympathetic tone and poor autonomic regulation.',
    'SpO₂': 'Blood oxygen below optimal levels triggers compensatory stress responses.',
    'AQI': 'Poor air quality introduces particulate matter, increasing inflammation and systemic stress.',
    'Temperature': 'Extreme temperatures force your body to divert metabolic resources for thermoregulation.',
};

export default function PrimaryStressorCard({ inputs }) {
    const primary = useMemo(() => {
        if (!inputs) return null;
        const contribs = getContributions(inputs.heart_rate, inputs.hr_variability, inputs.spo2, inputs.aqi, inputs.temperature);
        return contribs.reduce((max, c) => c.pct > max.pct ? c : max, contribs[0]);
    }, [inputs]);

    if (!primary) return null;

    return (
        <div className="relative"
            style={{
                padding: '24px 28px',
                borderLeft: '4px solid var(--accent)',
                borderRadius: '0 10px 10px 0',
                background: 'var(--accent-dim)',
            }}>
            <div className="t-label" style={{ marginBottom: 'var(--sp-2)' }}>
                PRIMARY STRESSOR
            </div>
            <div className="font-display leading-none" style={{ fontSize: 32, color: 'var(--accent)', letterSpacing: 2, marginBottom: 'var(--sp-3)' }}>
                {primary.name}
            </div>
            <div className="font-mono" style={{ fontSize: 12, marginBottom: 'var(--sp-3)' }}>
                <span style={{ color: 'var(--accent)' }}>{primary.raw}</span>
                <span style={{ margin: '0 8px', color: 'var(--muted)' }}>→</span>
                <span style={{ color: 'var(--muted2)' }}>{primary.normal}</span>
            </div>
            <div className="t-body" style={{ fontSize: 12 }}>
                {EXPLANATIONS[primary.name] || ''} Accounts for <span style={{ color: 'var(--accent)' }}>{primary.pct.toFixed(1)}%</span> of your total stress score.
            </div>
        </div>
    );
}
