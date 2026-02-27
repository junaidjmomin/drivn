import { useState, useEffect } from 'react';
import { health } from '../api/drivnApi';

export default function HealthPill() {
    const [online, setOnline] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);

    useEffect(() => {
        const check = async () => {
            try {
                const res = await health();
                setOnline(true);
                setModelLoaded(res.data?.model_loaded ?? false);
            } catch {
                setOnline(false);
                setModelLoaded(false);
            }
        };
        check();
        const id = setInterval(check, 10000);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 0,
            background: 'none',
        }}>
            <span style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: online ? '#3DDC84' : '#FF4757',
                boxShadow: online
                    ? '0 0 8px rgba(61,220,132,0.6)'
                    : '0 0 8px rgba(255,71,87,0.6)',
                animation: online ? 'pulse 2s ease-in-out infinite' : 'none',
            }} />
            <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: 1,
                color: 'var(--muted2)',
            }}>
                {online
                    ? `online${modelLoaded ? ' · model loaded' : ''}`
                    : 'offline'}
            </span>
        </div>
    );
}
