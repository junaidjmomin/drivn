import { useState, useMemo } from 'react';
import HistoryHeader from '../components/Screen2/HistoryHeader';
import StressTimeline from '../components/Screen2/StressTimeline';
import CardioPanel from '../components/Screen2/CardioPanel';
import ECGPanel from '../components/Screen2/ECGPanel';
import EnvironmentPanel from '../components/Screen2/EnvironmentPanel';
import CorrelationHeatmap from '../components/Screen2/CorrelationHeatmap';
import ClinicalTable from '../components/Screen2/ClinicalTable';

export default function HistoryTrends({ history }) {
    const [range, setRange] = useState('ALL TIME');

    const filtered = useMemo(() => {
        if (!history.length) return [];
        if (range === 'ALL TIME') return history;
        if (range === 'LAST 10') return history.slice(-10);

        const now = Date.now();
        if (range === 'LAST HOUR') {
            return history.filter(r => new Date(r.timestamp).getTime() > now - 3600000);
        }
        if (range === 'LAST DAY') {
            return history.filter(r => new Date(r.timestamp).getTime() > now - 86400000);
        }
        return history;
    }, [history, range]);

    if (!history.length) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-10 rounded-xl max-w-md"
                    style={{ border: '2px dashed var(--border2)', background: 'var(--surface)' }}>
                    <div className="text-4xl mb-3 opacity-20">📊</div>
                    <div className="font-display text-[24px] tracking-wider" style={{ color: 'var(--muted)' }}>
                        NO HISTORY YET
                    </div>
                    <div className="font-mono text-[11px] mt-2" style={{ color: 'var(--muted)' }}>
                        Make predictions to build your history timeline.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-[1200px]">
                <HistoryHeader history={filtered} range={range} setRange={setRange} />
                <StressTimeline history={filtered} />
                <CardioPanel history={filtered} />
                <ECGPanel history={filtered} />
                <EnvironmentPanel history={filtered} />
                <CorrelationHeatmap history={filtered} />
                <ClinicalTable history={filtered} />
            </div>
        </div>
    );
}
