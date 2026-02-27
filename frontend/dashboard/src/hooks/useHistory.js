import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'drivn_history';
const MAX_ENTRIES = 100;

export function useHistory() {
    const [history, setHistory] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch { /* quota exceeded — silently fail */ }
    }, [history]);

    const addReading = useCallback((apiResponse, inputs) => {
        setHistory(prev => {
            const entry = { ...apiResponse, inputs };
            const next = [...prev, entry];
            if (next.length > MAX_ENTRIES) next.shift();
            return next;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return { history, addReading, clearHistory };
}
