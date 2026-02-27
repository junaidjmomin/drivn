import { useMemo, useState } from 'react';
import { getLevelColor } from '../../utils/stressTheme';

export default function ClinicalTable({ history }) {
    const [sortKey, setSortKey] = useState('timestamp');
    const [sortDir, setSortDir] = useState('desc');
    const [expandedRow, setExpandedRow] = useState(null);
    const [page, setPage] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const PAGE_SIZE = 20;

    const toggleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('desc'); }
    };

    const sorted = useMemo(() => {
        const arr = [...history];
        arr.sort((a, b) => {
            let va, vb;
            if (sortKey === 'timestamp') { va = a.timestamp; vb = b.timestamp; }
            else if (sortKey === 'level') { va = a.stress_level; vb = b.stress_level; }
            else if (sortKey === 'score') { va = a.stress_score; vb = b.stress_score; }
            else if (sortKey === 'confidence') { va = a.confidence; vb = b.confidence; }
            else { va = a.inputs?.[sortKey] || 0; vb = b.inputs?.[sortKey] || 0; }
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return arr;
    }, [history, sortKey, sortDir]);

    const displayed = showAll ? sorted : sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
    const sortIcon = (key) => sortKey !== key ? '⇅' : sortDir === 'asc' ? '↑' : '↓';

    const COLS = [
        { key: 'timestamp', label: 'Time' },
        { key: 'level', label: 'Level' },
        { key: 'score', label: 'Score' },
        { key: 'confidence', label: 'Conf' },
        { key: 'heart_rate', label: 'HR' },
        { key: 'spo2', label: 'SpO₂' },
        { key: 'hr_variability', label: 'HRV' },
        { key: 'qrs_duration', label: 'QRS' },
        { key: 'st_segment', label: 'ST' },
        { key: 'aqi', label: 'AQI' },
        { key: 'temperature', label: 'Temp' },
    ];

    if (!history.length) {
        return (
            <div className="card text-center" style={{ padding: 'var(--sp-5)' }}>
                <div className="t-body">No clinical data recorded yet</div>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden" style={{ padding: 0 }}>
            <div className="t-label" style={{
                padding: '16px 16px 12px',
                borderBottom: '1px solid var(--border)',
            }}>CLINICAL TABLE</div>

            <div className="overflow-x-auto">
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {COLS.map(col => (
                                <th key={col.key}
                                    onClick={() => toggleSort(col.key)}
                                    className="text-left cursor-pointer select-none t-label"
                                    style={{
                                        padding: '8px 16px',
                                        background: 'var(--surface2)',
                                        fontSize: 9,
                                        letterSpacing: '2px',
                                        borderBottom: '1px solid var(--border)',
                                    }}>
                                    {col.label} <span style={{ fontSize: 8 }}>{sortIcon(col.key)}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayed.map((r, idx) => {
                            const isCrit = r.stress_level === 'critical';
                            const inp = r.inputs || {};
                            const isEven = idx % 2 === 0;
                            return (
                                <>
                                    <tr key={idx}
                                        onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                                        className="cursor-pointer"
                                        style={{
                                            borderBottom: '1px solid var(--border)',
                                            borderLeft: isCrit ? '3px solid #FF4757' : '3px solid transparent',
                                            background: isEven ? 'rgba(255,255,255,0.01)' : 'transparent',
                                        }}>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--muted2)' }}>
                                            {r.timestamp ? new Date(r.timestamp).toLocaleTimeString('en-GB') : ''}
                                        </td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <span className="font-mono" style={{
                                                fontSize: 9, padding: '2px 8px', borderRadius: 4,
                                                backgroundColor: `${getLevelColor(r.stress_level)}15`,
                                                color: getLevelColor(r.stress_level),
                                            }}>
                                                {r.stress_level?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text)' }}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 rounded-full overflow-hidden" style={{ height: 4, background: 'var(--border)' }}>
                                                    <div className="h-full rounded-full" style={{ width: `${r.stress_score}%`, background: getLevelColor(r.stress_level) }} />
                                                </div>
                                                {r.stress_score?.toFixed(1)}
                                            </div>
                                        </td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--muted2)' }}>
                                            {Math.round((r.confidence || 0) * 100)}%
                                        </td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text)' }}>{inp.heart_rate}</td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text)' }}>{inp.spo2}</td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text)' }}>{inp.hr_variability}</td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text)' }}>{inp.qrs_duration}</td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text)' }}>{inp.st_segment}</td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text)' }}>{inp.aqi}</td>
                                        <td className="font-mono" style={{ padding: '10px 16px', fontSize: 10, color: 'var(--text)' }}>{inp.temperature}</td>
                                    </tr>
                                    {expandedRow === idx && (
                                        <tr key={`expand-${idx}`}>
                                            <td colSpan={11} style={{ padding: '16px 24px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                                                <div className="grid grid-cols-2" style={{ gap: 'var(--sp-5)' }}>
                                                    <div>
                                                        <div className="t-label" style={{ marginBottom: 'var(--sp-2)' }}>RISK FACTORS</div>
                                                        {(r.risk_factors || []).map((rf, i) => (
                                                            <div key={i} className="font-mono" style={{ fontSize: 10, marginBottom: 4, color: '#FF4757' }}>⚠ {rf}</div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <div className="t-label" style={{ marginBottom: 'var(--sp-2)' }}>RECOMMENDATIONS</div>
                                                        {(r.recommendations || []).map((rec, i) => (
                                                            <div key={i} className="font-mono" style={{ fontSize: 10, marginBottom: 4, color: 'var(--text)' }}>→ {rec}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center" style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
                <button onClick={() => setShowAll(!showAll)}
                    className="font-mono cursor-pointer"
                    style={{ fontSize: 10, background: 'none', border: 'none', color: 'var(--accent)' }}>
                    {showAll ? 'Paginate' : 'Show all'}
                </button>
                {!showAll && totalPages > 1 && (
                    <div className="flex font-mono" style={{ gap: 'var(--sp-2)', fontSize: 10 }}>
                        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                            className="cursor-pointer" style={{ background: 'none', border: 'none', color: page === 0 ? 'var(--muted)' : 'var(--accent)' }}>
                            ← Prev
                        </button>
                        <span style={{ color: 'var(--muted2)' }}>{page + 1} / {totalPages}</span>
                        <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                            className="cursor-pointer" style={{ background: 'none', border: 'none', color: page >= totalPages - 1 ? 'var(--muted)' : 'var(--accent)' }}>
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
