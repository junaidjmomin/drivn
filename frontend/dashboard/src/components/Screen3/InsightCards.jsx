import { useMemo, useState } from 'react';
import { generateInsights } from '../../utils/insights';

const CATEGORY_COLORS = {
    CARDIOVASCULAR: '#FF4757',
    ENVIRONMENTAL: '#3DDC84',
    NEUROLOGICAL: '#9B59B6',
    COMBINED: '#F5A623',
};

export default function InsightCards({ inputs }) {
    const [expanded, setExpanded] = useState(null);

    const insights = useMemo(() => {
        if (!inputs) return [];
        return generateInsights(inputs);
    }, [inputs]);

    if (!insights.length) {
        return (
            <div className="card" style={{ padding: 'var(--sp-5)' }}>
                <div className="t-label" style={{ marginBottom: 'var(--sp-3)' }}>
                    CONTEXTUAL INSIGHTS
                </div>
                <div className="t-body">
                    No rule-based insights triggered. Values are within expected ranges.
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: 'var(--sp-5)' }}>
            <div className="t-label" style={{ marginBottom: 'var(--sp-4)' }}>
                CONTEXTUAL INSIGHTS
            </div>
            <div className="flex flex-col">
                {insights.map((ins, i) => {
                    const catColor = CATEGORY_COLORS[ins.category] || 'var(--accent)';
                    const isOpen = expanded === i;
                    return (
                        <div key={i}
                            onClick={() => setExpanded(isOpen ? null : i)}
                            className="cursor-pointer"
                            style={{
                                padding: '12px 0',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                borderLeft: `2px solid ${catColor}`,
                                paddingLeft: 'var(--sp-4)',
                            }}>
                            {/* Default: headline only */}
                            <div className="flex items-center justify-between">
                                <div className="t-body" style={{ fontSize: 13 }}>
                                    {ins.text}
                                </div>
                                <span className="t-meta shrink-0" style={{ fontSize: 9, marginLeft: 'var(--sp-3)' }}>
                                    {isOpen ? '▲' : '▼'}
                                </span>
                            </div>

                            {/* Expanded: why it matters */}
                            {isOpen && (
                                <div className="t-meta italic" style={{
                                    marginTop: 'var(--sp-2)',
                                    fontSize: 11,
                                    lineHeight: 1.5,
                                }}>
                                    Why this matters: {ins.why}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
