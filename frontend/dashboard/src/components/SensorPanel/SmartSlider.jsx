import { useMemo } from 'react';

function getAqiCategory(val) {
    if (val <= 50) return { label: 'GOOD', color: '#3DDC84' };
    if (val <= 100) return { label: 'MODERATE', color: '#F5A623' };
    if (val <= 150) return { label: 'UNHEALTHY FOR SENSITIVE GROUPS', color: '#FF6B35' };
    if (val <= 200) return { label: 'UNHEALTHY', color: '#FF4757' };
    if (val <= 300) return { label: 'VERY UNHEALTHY', color: '#9B59B6' };
    return { label: 'HAZARDOUS', color: '#7B0000' };
}

function getStBg(val) {
    const pct = ((val + 0.20) / 0.40) * 100;
    const mid = 50;
    if (val < 0) {
        return `linear-gradient(to right, rgba(255,71,87,0.3) 0%, rgba(255,71,87,0.15) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
    }
    if (val > 0) {
        return `linear-gradient(to right, var(--border) 0%, var(--border) ${mid}%, rgba(61,220,132,0.15) ${mid}%, rgba(61,220,132,0.3) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`;
    }
    return 'var(--border)';
}

function getThumbColor(value, thresholds) {
    if (!thresholds) return 'var(--accent)';
    let cls = 'ok';
    for (let i = thresholds.length - 1; i >= 0; i--) {
        if (value >= thresholds[i].value) { cls = thresholds[i].color; break; }
    }
    if (cls === 'danger') return '#FF4757';
    if (cls === 'warn') return '#F5A623';
    return '#3DDC84';
}

export default function SmartSlider({ label, min, max, step, value, unit, onChange, thresholds, isAqi, isSt }) {
    const thumbColor = useMemo(() => getThumbColor(value, thresholds), [value, thresholds]);
    const aqiCat = isAqi ? getAqiCategory(value) : null;

    const trackStyle = useMemo(() => {
        if (isAqi) {
            return {
                background: `linear-gradient(to right,
                    #3DDC84 0% 10%, #F5A623 10% 20%, #FF6B35 20% 30%,
                    #FF4757 30% 40%, #9B59B6 40% 60%, #7B0000 60% 100%)`,
            };
        }
        if (isSt) return { background: getStBg(value) };
        return { background: 'var(--border)' };
    }, [isAqi, isSt, value]);

    const pct = ((value - min) / (max - min)) * 100;
    const displayVal = typeof value === 'number'
        ? (Number.isInteger(step) || step >= 1 ? value : value.toFixed(2))
        : value;

    return (
        <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
            className="last:border-b-0">
            {/* Label + status dot + value — single line */}
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--sp-1)' }}>
                <span className="t-label" style={{ fontSize: 9, letterSpacing: '1.5px' }}>{label}</span>
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-1)',
                }}>
                    {thresholds && (
                        <span style={{
                            width: 5, height: 5, borderRadius: '50%',
                            backgroundColor: thumbColor, display: 'inline-block',
                        }} />
                    )}
                    {displayVal}{unit ? ` ${unit}` : ''}
                </span>
            </div>

            {/* Track */}
            <div className="relative" style={{ height: 24, display: 'flex', alignItems: 'center' }}>
                <div className="absolute w-full rounded-full overflow-hidden" style={{ ...trackStyle, height: 5 }}>
                    {!isAqi && !isSt && (
                        <div className="h-full rounded-full" style={{
                            width: `${pct}%`,
                            background: thumbColor,
                            opacity: 0.4,
                        }} />
                    )}
                </div>
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={e => onChange(parseFloat(e.target.value))}
                    className="absolute w-full cursor-pointer z-10"
                    style={{ WebkitAppearance: 'none', height: 24, opacity: 0 }}
                />
                <div className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `calc(${pct}% - 6px)`,
                        width: 12, height: 12,
                        background: thumbColor,
                        boxShadow: `0 0 6px ${thumbColor}40`,
                    }} />
            </div>

            {/* AQI category label */}
            {isAqi && aqiCat && (
                <div className="t-meta" style={{ color: aqiCat.color, marginTop: 'var(--sp-1)', fontSize: 9 }}>
                    {aqiCat.label}
                </div>
            )}
        </div>
    );
}
