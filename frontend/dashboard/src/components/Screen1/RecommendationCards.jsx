function getIcon(text) {
    const t = text.toLowerCase();
    if (t.includes('breath') || t.includes('breathing')) return '💨';
    if (t.includes('rest') || t.includes('sleep')) return '😴';
    if (t.includes('hydrat') || t.includes('water')) return '💧';
    if (t.includes('air') || t.includes('environment') || t.includes('fresh')) return '🌿';
    if (t.includes('break') || t.includes('stop')) return '🛑';
    if (t.includes('healthcare') || t.includes('provider') || t.includes('medical') || t.includes('doctor')) return '🩺';
    if (t.includes('walk') || t.includes('movement') || t.includes('exercis')) return '🚶';
    return '✨';
}

function getUrgency(level) {
    if (level === 'critical' || level === 'high') return { label: 'DO NOW', color: '#FF4757' };
    if (level === 'moderate') return { label: 'SOON', color: '#F5A623' };
    return { label: 'WHEN ABLE', color: '#3DDC84' };
}

export default function RecommendationCards({ recommendations = [], stressLevel }) {
    if (!recommendations.length) return null;
    const urgency = getUrgency(stressLevel);

    return (
        <div>
            <div className="t-label" style={{ marginBottom: 'var(--sp-4)' }}>
                RECOMMENDATIONS
            </div>
            {/* Single-column strip list */}
            <div className="flex flex-col">
                {recommendations.map((rec, i) => (
                    <div key={i}
                        className="flex items-center"
                        style={{
                            padding: '12px 16px',
                            gap: 'var(--sp-3)',
                            borderLeft: `4px solid ${urgency.color}30`,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                        }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{getIcon(rec)}</span>
                        <span className="flex-1 t-body" style={{ fontSize: 12 }}>
                            {rec}
                        </span>
                        <span className="t-meta shrink-0" style={{
                            fontSize: 8,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: `${urgency.color}12`,
                            color: urgency.color,
                        }}>
                            {urgency.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
