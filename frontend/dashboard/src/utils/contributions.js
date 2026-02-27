export function getContributions(hr, hrv, spo2, aqi, temp) {
    const hrC = (Math.max(0, hr - 60) / 140) * 40;
    const hrvC = (Math.max(0, 100 - hrv) / 100) * 30;
    const spo2C = (Math.max(0, 100 - spo2) / 15) * 20;
    const aqiC = (aqi / 500) * 10;
    const tempC = temp > 35 ? ((temp - 35) / 25) * 8 : (temp < 10 ? ((10 - temp) / 30) * 5 : 0);
    const total = hrC + hrvC + spo2C + aqiC + tempC || 1;
    return [
        { name: 'Heart Rate', value: hrC, pct: hrC / total * 100, raw: `${hr} bpm`, normal: '60–100 bpm', category: 'physiological' },
        { name: 'HRV', value: hrvC, pct: hrvC / total * 100, raw: `${hrv} ms`, normal: '40–100 ms', category: 'physiological' },
        { name: 'SpO₂', value: spo2C, pct: spo2C / total * 100, raw: `${spo2}%`, normal: '97–100%', category: 'physiological' },
        { name: 'AQI', value: aqiC, pct: aqiC / total * 100, raw: `${aqi}`, normal: '0–50', category: 'environmental' },
        { name: 'Temperature', value: tempC, pct: tempC / total * 100, raw: `${temp}°C`, normal: '18–28°C', category: 'environmental' },
    ];
}
