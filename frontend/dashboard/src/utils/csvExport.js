export function downloadCSV(history) {
    if (!history.length) return;

    const headers = [
        'timestamp', 'stress_level', 'stress_score', 'confidence',
        'heart_rate', 'spo2', 'hrv', 'qrs_duration', 'st_segment',
        'aqi', 'temperature', 'risk_factors', 'recommendations'
    ];

    const rows = history.map(r => {
        const inp = r.inputs || {};
        return [
            r.timestamp,
            r.stress_level,
            r.stress_score,
            r.confidence,
            inp.heart_rate,
            inp.spo2,
            inp.hr_variability,
            inp.qrs_duration,
            inp.st_segment,
            inp.aqi,
            inp.temperature,
            (r.risk_factors || []).join('; '),
            (r.recommendations || []).join('; '),
        ].map(v => `"${v ?? ''}"`).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `drivn_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}
