export function pearsonCorrelation(x, y) {
    const n = x.length;
    if (n < 2) return 0;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, denX = 0, denY = 0;
    for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = y[i] - meanY;
        num += dx * dy;
        denX += dx * dx;
        denY += dy * dy;
    }
    const den = Math.sqrt(denX * denY);
    return den === 0 ? 0 : num / den;
}

export function computeCorrelationMatrix(history, keys) {
    const data = {};
    keys.forEach(k => { data[k] = []; });

    history.forEach(r => {
        const inp = r.inputs || {};
        const map = {
            HR: inp.heart_rate,
            SpO2: inp.spo2,
            HRV: inp.hr_variability,
            AQI: inp.aqi,
            Temp: inp.temperature,
            Score: r.stress_score,
        };
        keys.forEach(k => {
            data[k].push(map[k] ?? 0);
        });
    });

    const matrix = [];
    for (let i = 0; i < keys.length; i++) {
        const row = [];
        for (let j = 0; j < keys.length; j++) {
            row.push(pearsonCorrelation(data[keys[i]], data[keys[j]]));
        }
        matrix.push(row);
    }
    return matrix;
}

export const CORRELATION_EXPLANATIONS = {
    'HR-SpO2': 'Higher heart rates can decrease oxygen saturation efficiency.',
    'HR-HRV': 'Elevated heart rate typically suppresses heart rate variability — less parasympathetic control.',
    'HR-AQI': 'Poor air quality causes cardiovascular strain, raising heart rate.',
    'HR-Temp': 'Heat stress elevates heart rate as the body attempts thermoregulation.',
    'HR-Score': 'Heart rate is a primary physiological stress indicator.',
    'SpO2-HRV': 'Low oxygen levels trigger autonomic imbalance, reducing HRV.',
    'SpO2-AQI': 'PM2.5 particles reduce oxygen absorption in the lungs.',
    'SpO2-Temp': 'Extreme temperatures can affect breathing efficiency and oxygen levels.',
    'SpO2-Score': 'Blood oxygen below 95% directly contributes to stress scoring.',
    'HRV-AQI': 'Polluted environments suppress parasympathetic nervous system activity.',
    'HRV-Temp': 'Thermal stress reduces autonomic flexibility measured by HRV.',
    'HRV-Score': 'Low HRV is a key marker of sympathetic dominance and stress.',
    'AQI-Temp': 'Urban heat islands concentrate pollutants, compounding air quality issues.',
    'AQI-Score': 'Environmental pollution is a direct input to the stress model.',
    'Temp-Score': 'Temperature extremes contribute to physiological stress load.',
};

export function getExplanation(k1, k2) {
    if (k1 === k2) return 'Self-correlation is always 1.0';
    const key = [k1, k2].sort().join('-');
    return CORRELATION_EXPLANATIONS[key] || 'Relationship between these parameters.';
}
