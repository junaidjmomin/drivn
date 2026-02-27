import ScoreRing from './ScoreRing';

export default function ScoreHero({ result }) {
    if (!result) return null;

    const { stress_score, stress_level, confidence, timestamp } = result;

    return (
        <div className="card relative overflow-hidden"
            style={{
                padding: '32px 36px',
                animation: 'slideInUp 0.25s ease-out',
            }}>
            {/* Radial glow on right */}
            <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 100% 30%, var(--accent-glow), transparent 70%)',
                }} />

            <div className="flex items-center relative z-10" style={{ gap: 36 }}>
                <ScoreRing score={stress_score} />

                <div className="flex-1">
                    <div className="t-label" style={{ marginBottom: 'var(--sp-2)' }}>
                        STRESS LEVEL
                    </div>
                    <div className="font-display leading-none"
                        style={{
                            fontSize: 40,
                            letterSpacing: 2,
                            color: 'var(--accent)',
                            animation: 'slideInUp 0.25s ease-out',
                        }}>
                        {stress_level?.toUpperCase()}
                    </div>

                    <div className="flex items-center" style={{ gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
                        <span className="font-mono" style={{
                            fontSize: 10,
                            padding: '4px 12px',
                            borderRadius: 20,
                            background: 'var(--accent-dim)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent)',
                            borderColor: 'rgba(232,184,75,0.2)',
                        }}>
                            Confidence · {Math.round((confidence || 0) * 100)}%
                        </span>
                        <span className="t-meta">
                            {timestamp ? new Date(timestamp).toLocaleTimeString('en-GB') : ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
