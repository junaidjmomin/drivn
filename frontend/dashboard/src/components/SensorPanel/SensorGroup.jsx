import { useState } from 'react';
import SmartSlider from './SmartSlider';

const HR_THRESHOLDS = [{ value: 0, color: 'ok' }, { value: 100, color: 'warn' }, { value: 120, color: 'danger' }];
const SPO2_THRESHOLDS = [{ value: 0, color: 'danger' }, { value: 95, color: 'warn' }, { value: 97, color: 'ok' }];
const HRV_THRESHOLDS = [{ value: 0, color: 'danger' }, { value: 20, color: 'warn' }, { value: 40, color: 'ok' }];
const QRS_THRESHOLDS = [{ value: 0, color: 'ok' }, { value: 0.10, color: 'warn' }, { value: 0.12, color: 'danger' }];

const GROUPS = [
    {
        icon: '❤️',
        label: 'MAX30102',
        sublabel: 'OPTICAL SENSOR',
        borderColor: '#FF4757',
        summaryKeys: ['heart_rate', 'spo2'],
        summaryLabels: ['HR', 'SpO₂'],
        summaryUnits: ['', '%'],
        defaultOpen: true,
        sliders: [
            { key: 'heart_rate', label: 'HEART RATE', min: 30, max: 200, step: 1, unit: 'bpm', thresholds: HR_THRESHOLDS },
            { key: 'spo2', label: 'SpO₂', min: 85, max: 100, step: 1, unit: '%', thresholds: SPO2_THRESHOLDS },
            { key: 'raw_ir', label: 'RAW IR', min: 40000, max: 65000, step: 100, unit: '', thresholds: null },
            { key: 'raw_red', label: 'RAW RED', min: 38000, max: 60000, step: 100, unit: '', thresholds: null },
        ],
    },
    {
        icon: '📈',
        label: 'ECG',
        sublabel: 'ELECTROCARDIOGRAM',
        borderColor: '#4dabf7',
        summaryKeys: ['hr_variability', 'qrs_duration'],
        summaryLabels: ['HRV', 'QRS'],
        summaryUnits: ['ms', 's'],
        defaultOpen: false,
        sliders: [
            { key: 'hr_variability', label: 'HRV', min: 5, max: 100, step: 0.5, unit: 'ms', thresholds: HRV_THRESHOLDS },
            { key: 'qrs_duration', label: 'QRS DURATION', min: 0.06, max: 0.20, step: 0.01, unit: 's', thresholds: QRS_THRESHOLDS },
            { key: 'st_segment', label: 'ST SEGMENT', min: -0.20, max: 0.20, step: 0.01, unit: 'mV', thresholds: null, isSt: true },
        ],
    },
    {
        icon: '🌍',
        label: 'ENV',
        sublabel: 'ENVIRONMENT',
        borderColor: '#3DDC84',
        summaryKeys: ['aqi', 'temperature'],
        summaryLabels: ['AQI', 'Temp'],
        summaryUnits: ['', '°C'],
        defaultOpen: false,
        sliders: [
            { key: 'aqi', label: 'AQI', min: 0, max: 500, step: 1, unit: '', thresholds: null, isAqi: true },
            { key: 'temperature', label: 'TEMPERATURE', min: -20, max: 60, step: 0.5, unit: '°C', thresholds: null },
        ],
    },
];

function formatVal(val, unit) {
    if (val >= 10000) return `${(val / 1000).toFixed(0)}k`;
    if (Number.isInteger(val)) return `${val}${unit ? ' ' + unit : ''}`;
    return `${val.toFixed(1)}${unit ? ' ' + unit : ''}`;
}

export default function SensorGroup({ values, onChange }) {
    const [openGroup, setOpenGroup] = useState(0); // accordion: only one open at a time

    const toggle = (idx) => {
        setOpenGroup(openGroup === idx ? -1 : idx);
    };

    return (
        <div className="flex flex-col" style={{ gap: 'var(--sp-2)' }}>
            {GROUPS.map((group, idx) => {
                const isOpen = openGroup === idx;
                return (
                    <div key={group.label}
                        className="rounded-lg overflow-hidden"
                        style={{
                            background: 'var(--surface)',
                            borderLeft: `3px solid ${group.borderColor}`,
                        }}>
                        {/* Collapsed header — always visible */}
                        <button
                            onClick={() => toggle(idx)}
                            className="w-full flex items-center justify-between cursor-pointer"
                            style={{
                                padding: 'var(--sp-3) var(--sp-4)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text)',
                            }}
                        >
                            <div className="flex items-center" style={{ gap: 'var(--sp-2)' }}>
                                <span className="text-sm">{group.icon}</span>
                                <span className="t-label" style={{ letterSpacing: '1.5px' }}>{group.label}</span>
                            </div>

                            <div className="flex items-center" style={{ gap: 'var(--sp-3)' }}>
                                {/* Summary chips — shown when collapsed */}
                                {!isOpen && group.summaryKeys.map((k, i) => (
                                    <span key={k} className="t-meta" style={{ fontSize: 10 }}>
                                        {group.summaryLabels[i]}: {formatVal(values[k], '')}
                                    </span>
                                ))}
                                <span className="t-meta" style={{ fontSize: 9, opacity: 0.5 }}>
                                    {isOpen ? '▲' : '▼'}
                                </span>
                            </div>
                        </button>

                        {/* Expandable sliders */}
                        <div className={`collapsible-enter ${isOpen ? 'collapsible-open' : ''}`}
                            style={{ borderTop: isOpen ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ padding: 'var(--sp-3) var(--sp-4)' }}>
                                {group.sliders.map(s => (
                                    <SmartSlider
                                        key={s.key}
                                        label={s.label}
                                        min={s.min}
                                        max={s.max}
                                        step={s.step}
                                        value={values[s.key]}
                                        unit={s.unit}
                                        onChange={v => onChange(s.key, v)}
                                        thresholds={s.thresholds}
                                        isAqi={s.isAqi || false}
                                        isSt={s.isSt || false}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
