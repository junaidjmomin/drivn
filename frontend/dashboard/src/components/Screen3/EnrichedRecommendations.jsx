import { useState } from 'react';

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

function getTargets(text, inputs) {
    const targets = [];
    const t = text.toLowerCase();
    if (t.includes('heart') || t.includes('hr') || t.includes('cardio')) targets.push(`HR (${inputs.heart_rate} bpm)`);
    if (t.includes('oxygen') || t.includes('spo') || t.includes('blood')) targets.push(`SpO₂ (${inputs.spo2}%)`);
    if (t.includes('air') || t.includes('aqi') || t.includes('pollut')) targets.push(`AQI (${inputs.aqi})`);
    if (t.includes('temp') || t.includes('heat') || t.includes('cool')) targets.push(`Temp (${inputs.temperature}°C)`);
    if (t.includes('rest') || t.includes('stress') || t.includes('relax')) targets.push(`HRV (${inputs.hr_variability} ms)`);
    if (!targets.length) targets.push('Stress Score');
    return targets.join(' + ');
}

function getWhyHelps(text) {
    const t = text.toLowerCase();
    if (t.includes('breath')) return 'Controlled breathing activates the parasympathetic nervous system, increasing HRV and reducing cortisol.';
    if (t.includes('rest') || t.includes('sleep')) return 'Rest allows autonomic recovery, reducing sympathetic dominance and normalizing heart rate.';
    if (t.includes('hydrat') || t.includes('water')) return 'Proper hydration maintains blood volume and reduces cardiac strain.';
    if (t.includes('air') || t.includes('fresh') || t.includes('environment')) return 'Moving to cleaner air reduces particulate exposure and inflammatory response.';
    if (t.includes('walk') || t.includes('movement')) return 'Light movement promotes circulation and endorphin release without excessive cardiac load.';
    if (t.includes('healthcare') || t.includes('medical')) return 'Professional assessment can identify underlying conditions contributing to sustained high readings.';
    return 'This recommendation addresses the specific physiological or environmental stressors detected.';
}

export default function EnrichedRecommendations({ recommendations = [], stressLevel, inputs }) {
    const [expanded, setExpanded] = useState(null);
    if (!recommendations.length || !inputs) return null;

    const urgency = getUrgency(stressLevel);

    return (
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
            <div className="t-label" style={{ marginBottom: 'var(--sp-4)' }}>
                ENRICHED RECOMMENDATIONS
            </div>
            <div className="flex flex-col">
                {recommendations.map((rec, i) => {
                    const isOpen = expanded === i;
                    return (
                        <div key={i}
                            onClick={() => setExpanded(isOpen ? null : i)}
                            className="cursor-pointer"
                            style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                            }}>
                            {/* Default: emoji + text + urgency + chevron */}
                            <div className="flex items-center" style={{ gap: 'var(--sp-3)' }}>
                                <span style={{ fontSize: 18, flexShrink: 0 }}>{getIcon(rec)}</span>
                                <span className="flex-1 t-body" style={{ fontSize: 12 }}>{rec}</span>
                                <span className="t-meta shrink-0" style={{
                                    fontSize: 8, padding: '2px 8px', borderRadius: 4,
                                    background: `${urgency.color}12`, color: urgency.color,
                                }}>
                                    {urgency.label}
                                </span>
                                <span className="t-meta shrink-0" style={{ fontSize: 9 }}>
                                    {isOpen ? '▲' : '▼'}
                                </span>
                            </div>

                            {/* Expanded: targets + why */}
                            {isOpen && (
                                <div style={{ marginTop: 'var(--sp-2)', paddingLeft: 30 }}>
                                    <div className="t-meta" style={{ color: 'var(--accent)', fontSize: 10 }}>
                                        Targets: {getTargets(rec, inputs)}
                                    </div>
                                    <div className="t-meta italic" style={{ marginTop: 'var(--sp-1)', fontSize: 10 }}>
                                        Why it helps: {getWhyHelps(rec)}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
