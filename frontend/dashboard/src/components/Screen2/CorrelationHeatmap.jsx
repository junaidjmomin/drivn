import { useMemo, useState } from 'react';
import { computeCorrelationMatrix, getExplanation } from '../../utils/correlations';

const KEYS = ['HR', 'SpO2', 'HRV', 'AQI', 'Temp', 'Score'];

function interpolateColor(corr) {
    const r1 = [0x4d, 0xab, 0xf7];
    const r0 = [0x1c, 0x1c, 0x2e];
    const r2 = [0xff, 0x47, 0x57];
    const t = Math.max(-1, Math.min(1, corr));
    let rgb;
    if (t >= 0) rgb = r0.map((c, i) => Math.round(c + (r2[i] - c) * t));
    else rgb = r0.map((c, i) => Math.round(c + (r1[i] - c) * Math.abs(t)));
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export default function CorrelationHeatmap({ history }) {
    const [tooltip, setTooltip] = useState(null);

    const matrix = useMemo(() => {
        if (history.length < 5) return null;
        return computeCorrelationMatrix(history, KEYS);
    }, [history.length]);

    // Find strongest non-diagonal correlation
    const summary = useMemo(() => {
        if (!matrix) return null;
        let maxVal = 0, maxI = 0, maxJ = 1;
        for (let i = 0; i < KEYS.length; i++) {
            for (let j = i + 1; j < KEYS.length; j++) {
                if (Math.abs(matrix[i][j]) > Math.abs(maxVal)) {
                    maxVal = matrix[i][j]; maxI = i; maxJ = j;
                }
            }
        }
        const dir = maxVal > 0 ? 'positively' : 'negatively';
        const str = Math.abs(maxVal) > 0.7 ? 'strongly' : Math.abs(maxVal) > 0.4 ? 'moderately' : 'weakly';
        return `Strongest relationship: ${KEYS[maxI]} and ${KEYS[maxJ]} are ${str} ${dir} correlated (${maxVal.toFixed(2)}).`;
    }, [matrix]);

    if (history.length < 5) {
        return (
            <div className="card text-center" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-5)' }}>
                <div className="t-label" style={{ marginBottom: 'var(--sp-4)' }}>CORRELATION HEATMAP</div>
                <div className="t-body">Need at least 5 readings for meaningful correlations</div>
                <div className="t-meta" style={{ marginTop: 'var(--sp-2)' }}>{history.length} / 5 readings collected</div>
            </div>
        );
    }

    return (
        <div className="card relative" style={{ padding: 28, marginBottom: 'var(--sp-5)' }}>
            <div className="t-label" style={{
                marginBottom: 'var(--sp-4)',
                paddingBottom: 'var(--sp-3)',
                borderBottom: '1px solid var(--border)',
            }}>CORRELATION HEATMAP</div>

            <div className="overflow-x-auto">
                <div className="inline-grid" style={{ gridTemplateColumns: `60px repeat(${KEYS.length}, 1fr)`, gap: 1 }}>
                    <div />
                    {KEYS.map(k => (
                        <div key={k} className="text-center t-label" style={{ padding: '8px 0', minWidth: 72 }}>{k}</div>
                    ))}
                    {KEYS.map((rowKey, i) => (
                        <>
                            <div key={`l-${i}`} className="t-label flex items-center pr-2">{rowKey}</div>
                            {KEYS.map((colKey, j) => {
                                const val = matrix[i][j];
                                const isDiag = i === j;
                                const tipKey = `${i}-${j}`;
                                return (
                                    <div key={tipKey}
                                        className="flex items-center justify-center cursor-pointer relative"
                                        style={{
                                            background: isDiag ? 'var(--accent-dim)' : interpolateColor(val),
                                            minWidth: 72, height: 52,
                                            borderRadius: 4,
                                            border: isDiag ? '1px solid var(--accent)' : '1px solid transparent',
                                        }}
                                        onClick={() => setTooltip(tooltip === tipKey ? null : tipKey)}
                                    >
                                        <span className="font-mono" style={{ fontSize: 10, color: isDiag ? 'var(--accent)' : 'var(--text)' }}>
                                            {val.toFixed(2)}
                                        </span>
                                        {tooltip === tipKey && (
                                            <div className="absolute z-20 rounded-lg shadow-lg"
                                                style={{
                                                    bottom: '110%', left: '50%', transform: 'translateX(-50%)',
                                                    padding: 12, maxWidth: 250,
                                                    background: 'var(--bg)', border: '1px solid var(--border2)',
                                                }}>
                                                <div className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
                                                    {rowKey} ↔ {colKey}
                                                </div>
                                                <div className="t-body" style={{ fontSize: 11 }}>{getExplanation(rowKey, colKey)}</div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
            </div>

            {/* Plain-language summary */}
            {summary && (
                <div className="t-body" style={{ marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--border)', fontSize: 11 }}>
                    {summary}
                </div>
            )}
        </div>
    );
}
