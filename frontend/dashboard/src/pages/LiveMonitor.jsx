import EmptyState from '../components/Screen1/EmptyState';
import ScoreHero from '../components/Screen1/ScoreHero';
import MetricCards from '../components/Screen1/MetricCards';
import RecommendationCards from '../components/Screen1/RecommendationCards';
import SensorPayload from '../components/Screen1/SensorPayload';

function RiskFactors({ factors = [] }) {
    if (!factors.length) return null;
    const visible = factors.slice(0, 5);
    const overflow = factors.length - 5;

    return (
        <div>
            <div className="t-label" style={{ marginBottom: 'var(--sp-3)' }}>
                RISK FACTORS
            </div>
            <div className="flex flex-wrap" style={{ gap: 'var(--sp-2)' }}>
                {visible.map((rf, i) => {
                    const isNormal = rf.toLowerCase().includes('normal');
                    return (
                        <span key={i} className="font-mono"
                            style={{
                                fontSize: 10,
                                padding: '4px 12px',
                                borderRadius: 6,
                                background: isNormal ? 'rgba(61,220,132,0.06)' : 'rgba(255,71,87,0.06)',
                                color: isNormal ? '#3DDC84' : '#FF4757',
                                border: `1px solid ${isNormal ? 'rgba(61,220,132,0.12)' : 'rgba(255,71,87,0.12)'}`,
                            }}>
                            {rf}
                        </span>
                    );
                })}
                {overflow > 0 && (
                    <span className="font-mono"
                        style={{
                            fontSize: 10,
                            padding: '4px 12px',
                            borderRadius: 6,
                            background: 'var(--surface2)',
                            color: 'var(--muted2)',
                            border: '1px solid var(--border)',
                        }}>
                        +{overflow} more
                    </span>
                )}
            </div>
        </div>
    );
}

export default function LiveMonitor({ result, inputs, history }) {
    return (
        <div className="relative flex-1 overflow-y-auto" style={{ padding: 'var(--sp-5)' }}>
            {/* Ambient glow */}
            <div className="ambient-glow fixed pointer-events-none"
                style={{
                    top: 56, right: 0,
                    width: '60%', height: '100%',
                    background: 'radial-gradient(ellipse 700px 500px at 90% 0%, var(--accent-glow), transparent 70%)',
                    zIndex: 0,
                }} />

            <div className="relative z-10 flex flex-col max-w-[1100px]" style={{ gap: 'var(--sp-5)' }}>
                {!result ? (
                    <EmptyState />
                ) : (
                    <>
                        <ScoreHero result={result} />
                        <RiskFactors factors={result.risk_factors} />
                        <MetricCards result={result} history={history} />
                        <RecommendationCards
                            recommendations={result.recommendations}
                            stressLevel={result.stress_level}
                        />
                        <SensorPayload inputs={inputs} />
                    </>
                )}
            </div>
        </div>
    );
}
