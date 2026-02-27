export const THEMES = {
    low: { accent: '#3DDC84', dim: 'rgba(61,220,132,0.08)', glow: 'rgba(61,220,132,0.15)' },
    moderate: { accent: '#F5A623', dim: 'rgba(245,166,35,0.08)', glow: 'rgba(245,166,35,0.15)' },
    high: { accent: '#FF6B35', dim: 'rgba(255,107,53,0.08)', glow: 'rgba(255,107,53,0.15)' },
    critical: { accent: '#FF4757', dim: 'rgba(255,71,87,0.08)', glow: 'rgba(255,71,87,0.15)' }
};

export function applyTheme(level) {
    const t = THEMES[level];
    if (!t) return;
    const r = document.documentElement;
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-dim', t.dim);
    r.style.setProperty('--accent-glow', t.glow);

    if (level === 'critical') {
        document.body.classList.add('is-critical');
    } else {
        document.body.classList.remove('is-critical');
    }
}

export function getLevelColor(level) {
    return THEMES[level]?.accent || '#e8b84b';
}
