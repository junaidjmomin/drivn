import { useState } from 'react';
import ContributionChart from '../components/Screen3/ContributionChart';
import PrimaryStressorCard from '../components/Screen3/PrimaryStressorCard';
import PhysioEnvSplit from '../components/Screen3/PhysioEnvSplit';
import InsightCards from '../components/Screen3/InsightCards';
import EnrichedRecommendations from '../components/Screen3/EnrichedRecommendations';
import NormalRangeTable from '../components/Screen3/NormalRangeTable';

const TABS = [
    { key: 'breakdown', label: 'BREAKDOWN' },
    { key: 'insights', label: 'INSIGHTS' },
    { key: 'recommendations', label: 'RECOMMENDATIONS' },
    { key: 'reference', label: 'REFERENCE' },
];

export default function StressAnalyser({ result, inputs }) {
    const [subTab, setSubTab] = useState('breakdown');

    if (!result || !inputs) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center" style={{
                    padding: 'var(--sp-7)',
                    border: '2px dashed var(--border2)',
                    borderRadius: 12,
                    background: 'var(--surface)',
                    maxWidth: 400,
                }}>
                    <div style={{ fontSize: 40, marginBottom: 'var(--sp-3)', opacity: 0.2 }}>🔬</div>
                    <div className="font-display" style={{ fontSize: 24, letterSpacing: 2, color: 'var(--muted)' }}>
                        NO ANALYSIS AVAILABLE
                    </div>
                    <div className="t-meta" style={{ marginTop: 'var(--sp-2)' }}>
                        Run a prediction first to unlock the stress analyser.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto" style={{ padding: 'var(--sp-5)' }}>
            <div className="max-w-[1100px]">
                {/* Screen title */}
                <div className="t-section" style={{ marginBottom: 'var(--sp-5)' }}>
                    STRESS ANALYSER
                </div>

                {/* Secondary tab bar */}
                <div className="rounded-lg flex" style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    marginBottom: 'var(--sp-5)',
                    padding: 'var(--sp-1)',
                }}>
                    {TABS.map(tab => {
                        const active = subTab === tab.key;
                        return (
                            <button key={tab.key}
                                onClick={() => setSubTab(tab.key)}
                                className="flex-1 text-center cursor-pointer font-mono"
                                style={{
                                    fontSize: 10,
                                    letterSpacing: '1.5px',
                                    padding: '10px 0',
                                    borderRadius: 6,
                                    background: active ? 'var(--accent-dim)' : 'transparent',
                                    color: active ? 'var(--accent)' : 'var(--muted2)',
                                    border: 'none',
                                    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
                                }}>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab content */}
                <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
                    {subTab === 'breakdown' && (
                        <div className="flex flex-col" style={{ gap: 'var(--sp-5)' }}>
                            <div className="grid grid-cols-3" style={{ gap: 'var(--sp-5)' }}>
                                <div className="col-span-2">
                                    <ContributionChart inputs={inputs} />
                                </div>
                                <div className="flex flex-col" style={{ gap: 'var(--sp-5)' }}>
                                    <PrimaryStressorCard inputs={inputs} />
                                    <PhysioEnvSplit inputs={inputs} />
                                </div>
                            </div>
                        </div>
                    )}

                    {subTab === 'insights' && (
                        <InsightCards inputs={inputs} />
                    )}

                    {subTab === 'recommendations' && (
                        <EnrichedRecommendations
                            recommendations={result.recommendations}
                            stressLevel={result.stress_level}
                            inputs={inputs}
                        />
                    )}

                    {subTab === 'reference' && (
                        <NormalRangeTable inputs={inputs} />
                    )}
                </div>
            </div>
        </div>
    );
}
