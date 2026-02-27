import { useState, useEffect } from 'react';
import HealthPill from './HealthPill';

const TABS = [
    { key: 'live', label: 'MONITOR' },
    { key: 'history', label: 'HISTORY' },
    { key: 'analyse', label: 'ANALYSER' },
];

export default function Navbar({ currentTab, onTabChange }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const tick = () => setTime(new Date().toLocaleTimeString('en-GB'));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <nav style={{
            height: 64,
            display: 'grid',
            gridTemplateColumns: '200px 1fr 280px',
            alignItems: 'center',
            padding: '0 32px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'rgba(5,5,10,0.96)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
        }}>
            {/* LEFT — Logo */}
            <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28,
                letterSpacing: 4,
                color: 'var(--text)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                userSelect: 'none',
                position: 'relative',
            }}>
                DRIVN
                <span style={{ color: 'var(--accent)', letterSpacing: 0 }}>{'>>'}</span>
                {/* Subtle halo glow */}
                <span style={{
                    position: 'absolute',
                    left: 0,
                    width: 120,
                    height: 64,
                    background: 'radial-gradient(ellipse at left center, rgba(232,184,75,0.06), transparent 70%)',
                    pointerEvents: 'none',
                }} />
            </div>

            {/* CENTER — Tabs */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0 }}>
                    {TABS.map((tab, i) => {
                        const active = currentTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => onTabChange(tab.key)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                                    padding: '0 20px',
                                    height: 64,
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: 10,
                                    letterSpacing: 2.5,
                                    textTransform: 'uppercase',
                                    color: active ? 'var(--accent)' : 'var(--muted2)',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    position: 'relative',
                                    transition: 'color 0.2s, border-color 0.2s',
                                }}
                                onMouseEnter={e => {
                                    if (!active) e.currentTarget.style.color = 'var(--text)';
                                }}
                                onMouseLeave={e => {
                                    if (!active) e.currentTarget.style.color = 'var(--muted2)';
                                }}
                            >
                                {tab.label}
                                {/* Separator tick between tabs */}
                                {i < TABS.length - 1 && (
                                    <span style={{
                                        position: 'absolute',
                                        right: 0,
                                        width: 1,
                                        height: 16,
                                        background: 'var(--border2)',
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT — Health + Divider + Clock */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 20,
            }}>
                <HealthPill />
                {/* Divider */}
                <span style={{
                    width: 1,
                    height: 20,
                    background: 'var(--border2)',
                }} />
                {/* Clock */}
                <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    letterSpacing: 1.5,
                    color: 'var(--muted2)',
                    minWidth: 60,
                    textAlign: 'right',
                }}>
                    {time}
                </span>
            </div>
        </nav>
    );
}
