import React, { useState, useEffect } from 'react';
import { calculateImpact, getProcessTotals } from '../utils/CalculationEngine';

const ProcessSubmissionForm = ({ API_URL, onSubmit, onCancel }) => {
    const [step, setStep] = useState(1);
    const [settings, setSettings] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        industry: '',
        team_activity: '',
        work_type: '',

        // Scale & Effort
        team_size: '1 person',
        time_spent: 'Under 25%',
        monthly_volume: 'Under 500',
        frequency: 'Daily',

        // Impact Logic Inputs
        hours_per_cycle: '0',
        error_count_monthly: '0',

        // Qualification
        automation_goals: '',
        challenges: [],
        bottleneck_effect: 'Self-contained',
        importance: 'Medium',

        // Process DNA
        documentation_status: 'No documentation',
        explainability: 'Simple Rules (IF/THEN)',
        consistency_rate: 'Variable (50-70%)',
        systems_count: '1 system',
        systems_type: 'All Cloud / SaaS',
        comm_channels: [],

        // Granular Data Structures
        impact: {
            financial: [],
            efficiency: [],
            accuracy: []
        },
        systems_detail: [],
        integration_method: 'Manual',
        notes: ''
    });

    // Fetch settings for calculations
    useEffect(() => {
        fetch(`${API_URL}/settings`)
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('Failed to load settings', err));
    }, [API_URL]);

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleNext = () => {
        if (step === 1 && (!formData.name || !formData.team_activity)) {
            alert('Please provide a name and activity area.');
            return;
        }
        setStep(s => Math.min(s + 6, 6)); // We'll have 6 steps now
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Dynamic Calculation Logic ---
    const runCalculations = () => {
        const hourlyRate = parseFloat(settings.hourly_rate || 45);
        const errorCost = parseFloat(settings.error_cost || 150);

        // Map common inputs to impact metrics
        const laborValue = parseFloat(formData.hours_per_cycle) * (formData.frequency === 'Daily' ? 20 : 4) * hourlyRate * 12;
        const errorValue = parseFloat(formData.error_count_monthly) * errorCost * 12;

        return {
            labor: laborValue,
            error: errorValue,
            total: laborValue + errorValue
        };
    };

    const totals = runCalculations();

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="animate-fade-in-up">
                        <div className="form-group">
                            <label className="form-label">Process Identity</label>
                            <input className="form-input" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Accounts Payable Reconciliation" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Industry</label>
                            <select className="form-input" value={formData.industry} onChange={e => updateField('industry', e.target.value)}>
                                <option value="">Select industry...</option>
                                <option>Financial Services</option><option>Healthcare</option><option>Retail</option><option>Software</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">What is the primary activity?</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {['Data Entry', 'Approvals', 'Reconciliation', 'Reporting', 'Customer Support'].map(a => (
                                    <button key={a} onClick={() => updateField('team_activity', a)} className={`chip ${formData.team_activity === a ? 'active' : ''}`}>{a}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in-up">
                        <label className="form-label">Effort Estimation</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem' }}>Hours spent per cycle</label>
                                <input type="number" className="form-input" value={formData.hours_per_cycle} onChange={e => updateField('hours_per_cycle', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.7rem' }}>Frequency</label>
                                <select className="form-input" value={formData.frequency} onChange={e => updateField('frequency', e.target.value)}>
                                    <option>Daily</option><option>Weekly</option><option>Monthly</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Estimated Monthly Errors</label>
                            <input type="number" className="form-input" value={formData.error_count_monthly} onChange={e => updateField('error_count_monthly', e.target.value)} />
                        </div>
                        <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Live Impact Estimation:</p>
                            <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{settings.currency_symbol || '$'}{totals.total.toLocaleString()}<span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}> / year</span></h3>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-fade-in-up">
                        <label className="form-label">Challenges & Pain Points</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {['Too Slow', 'High Error Rate', 'Scalability Issue', 'Compliance Risk', 'Key Person Risk', 'No Visibility'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => {
                                        const next = formData.challenges.includes(c) ? formData.challenges.filter(x => x !== c) : [...formData.challenges, c];
                                        updateField('challenges', next);
                                    }}
                                    className={`chip ${formData.challenges.includes(c) ? 'active' : ''}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="animate-fade-in-up">
                        <label className="form-label">System Landscape (Advanced)</label>
                        <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Number of systems</label>
                            <select className="form-input" value={formData.systems_count} onChange={e => updateField('systems_count', e.target.value)}>
                                <option>1 system</option><option>2-3 systems</option><option>4+ systems</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Primary System Architecture</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {['Cloud / SaaS', 'Legacy / On-Prem', 'Hybrid'].map(t => (
                                    <button key={t} onClick={() => updateField('systems_type', t)} className={`chip ${formData.systems_type === t ? 'active' : ''}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Anticipated Integration Method</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {['API', 'DB Access', 'RPA', 'Manual'].map(m => (
                                    <button key={m} onClick={() => updateField('integration_method', m)} className={`chip ${formData.integration_method === m ? 'active' : ''}`}>{m}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="animate-fade-in-up">
                        <label className="form-label">Summary & Final Notes</label>
                        <textarea className="form-input" style={{ height: '120px' }} value={formData.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Add any final context or special requirements..." />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '50px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem' }}>Step {step} <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>of 5</span></h2>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                {renderStep()}

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <button className="btn-secondary" onClick={step === 1 ? onCancel : handleBack}>{step === 1 ? 'Cancel' : 'Back'}</button>
                    <button className="btn-primary" onClick={step === 5 ? () => {
                        const finalData = {
                            ...formData,
                            potential_value: totals.total,
                            impact: {
                                financial: [{ id: 'f1', name: 'Labor Savings', value: totals.labor, type: 'labor' }, { id: 'f2', name: 'Error Reduction', value: totals.error, type: 'error' }],
                                efficiency: [],
                                accuracy: []
                            }
                        };
                        onSubmit(finalData);
                    } : () => setStep(step + 1)}>
                        {step === 5 ? 'Submit Audit' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProcessSubmissionForm;
