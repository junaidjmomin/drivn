export default function EmptyState() {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-10 rounded-xl max-w-md"
                style={{
                    border: '2px dashed var(--border2)',
                    background: 'var(--surface)',
                }}>
                <div className="text-5xl mb-4 opacity-20">🧠</div>
                <div className="font-display text-[28px] tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
                    NO READING YET
                </div>
                <div className="font-mono text-[11px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                    Load a sensor preset or adjust the sliders,<br />
                    then hit <span style={{ color: 'var(--accent)' }}>PREDICT STRESS</span> to begin.
                </div>
            </div>
        </div>
    );
}
