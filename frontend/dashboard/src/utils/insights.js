export function generateInsights(inputs) {
    const { heart_rate: hr, spo2, hr_variability: hrv, qrs_duration: qrs, st_segment: st, aqi, temperature: temp } = inputs;
    const insights = [];

    if (hr > 100 && aqi > 100) {
        insights.push({
            category: 'COMBINED',
            text: 'High pollution environment raising cardiovascular load. Moving to clean air may reduce HR within 15–20 minutes.',
            why: 'Airborne particulates trigger inflammatory responses that increase cardiac workload.',
        });
    }

    if (hrv < 20 && temp > 35) {
        insights.push({
            category: 'NEUROLOGICAL',
            text: 'Low HRV + heat exposure signals autonomic thermal stress. Your nervous system is diverting resources for cooling.',
            why: 'Thermoregulation consumes autonomic bandwidth, reducing adaptive HRV.',
        });
    }

    if (spo2 < 95 && aqi > 100) {
        insights.push({
            category: 'ENVIRONMENTAL',
            text: 'Low blood oxygen correlates with your AQI reading. PM2.5 particles reduce oxygen absorption efficiency.',
            why: 'Fine particulate matter clogs alveolar gas exchange surfaces in the lungs.',
        });
    }

    if (hrv < 20 && hr > 100) {
        insights.push({
            category: 'CARDIOVASCULAR',
            text: 'The combination of elevated HR and suppressed HRV indicates your sympathetic nervous system is dominant — classic fight-or-flight response.',
            why: 'Sympathetic overdrive simultaneously increases heart rate and reduces variability.',
        });
    }

    if (qrs > 0.12) {
        insights.push({
            category: 'CARDIOVASCULAR',
            text: 'QRS duration above 0.12s suggests possible conduction delay. Not immediately dangerous but worth monitoring across readings.',
            why: 'Delayed electrical conduction can indicate bundle branch blocks or ventricular hypertrophy.',
        });
    }

    if (st < -0.05) {
        insights.push({
            category: 'CARDIOVASCULAR',
            text: 'ST depression detected. While this can be caused by exertion or position, consistent negative ST values warrant medical attention.',
            why: 'ST depression may indicate myocardial ischemia — reduced blood flow to heart muscle.',
        });
    }

    if (temp > 35 && aqi > 100) {
        insights.push({
            category: 'ENVIRONMENTAL',
            text: 'Heat and pollution are compounding each other. Urban heat islands concentrate pollutants — seek air-conditioned indoor environments.',
            why: 'Thermal inversions trap pollutants at ground level, worsening exposure during heat events.',
        });
    }

    if (hr < 60 && hrv > 60) {
        insights.push({
            category: 'CARDIOVASCULAR',
            text: 'Your physiological markers are excellent. Low resting HR with high HRV indicates strong cardiovascular fitness and low stress load.',
            why: 'Athletic hearts pump more efficiently, requiring fewer beats and showing greater variability.',
        });
    }

    if (spo2 >= 98 && hr <= 75 && hrv >= 40 && aqi <= 50) {
        insights.push({
            category: 'COMBINED',
            text: 'All vital signs are within optimal ranges. Your environment is clean and your body is well-regulated.',
            why: 'When all parameters align within healthy ranges, the stress load is minimal.',
        });
    }

    if (temp < 10) {
        insights.push({
            category: 'ENVIRONMENTAL',
            text: 'Cold stress detected. Low temperatures cause peripheral vasoconstriction and may elevate heart rate through shivering thermogenesis.',
            why: 'The body prioritises core temperature maintenance, diverting blood from extremities.',
        });
    }

    return insights;
}
