import { useEffect, useState } from 'react';

export default function ScoreRing({ score }) {
    const [offset, setOffset] = useState(339.29);
    const circumference = 339.29; // 2 * π * 54

    useEffect(() => {
        const timer = setTimeout(() => {
            setOffset(circumference * (1 - score / 100));
        }, 100);
        return () => clearTimeout(timer);
    }, [score]);

    return (
        <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
                {/* Background circle */}
                <circle
                    cx="70" cy="70" r="54"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="8"
                />
                {/* Foreground ring */}
                <circle
                    cx="70" cy="70" r="54"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 70 70)"
                    style={{
                        transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease',
                    }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="font-display text-5xl" style={{ color: 'var(--accent)', lineHeight: 1 }}>
                    {Math.round(score)}
                </span>
                <span className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--muted)' }}>
                    SCORE
                </span>
            </div>
        </div>
    );
}
