import React, { useState } from 'react';

const ProcessSubmissionForm = ({ onSubmit, onCancel }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        team_activity: '',
        work_type: '',
        team_size: '',
        time_spent: '',
        monthly_volume: '',
        frequency: '',
        automation_goals: '',
        challenges: [],
        bottleneck_effect: '',
        importance: '',
        documentation_status: '',
        explainability: '',
        consistency_rate: '',
        systems_count: '',
        systems_type: '',
        comm_channels: [],
        industry: '',
        notes: ''
    });

    const handleNext = () => {
        if (step === 1 && (!formData.name || !formData.team_activity)) {
            alert('Please provide a name and activity area.');
            return;
        }
        setStep(s => Math.min(s + 1, 5));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const toggleArrayField = (field, value) => {
        setFormData(prev => {
            const current = prev[field] || [];
            const next = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: next };
        });
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        fontSize: '0.9375rem',
        outline: 'none',
        transition: 'all 0.2s',
        marginTop: '0.5rem'
    };

    const labelStyle = {
        display: 'block',
        fontWeight: '700',
        color: 'var(--text-primary)',
        fontSize: '0.8125rem',
        textTransform: 'uppercase',
        letterSpacing: '0.02em'
    };

    const stepInfo = [
        { title: 'Process', desc: 'Identity' },
        { title: 'Scale', desc: 'Effort' },
        { title: 'Priority', desc: 'Pain' },
        { title: 'Details', desc: 'Technical' },
        { title: 'Submit', desc: 'Review' }
    ];

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="animate-fade-in-up">
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em' }}>The <span className="gradient-text">Identity</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Define the core scope of your process.</p>
                        </div>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Process Name</label>
                                <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Accounts Payable Reconciliation" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Industry</label>
                                <select value={formData.industry} onChange={e => updateField('industry', e.target.value)} style={inputStyle}>
                                    <option value="">Select industry...</option>
                                    <option>Financial Services</option>
                                    <option>Healthcare</option>
                                    <option>Retail & E-commerce</option>
                                    <option>Manufacturing</option>
                                    <option>Tech & Software</option>
                                    <option>Professional Services</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Functional Area</label>
                                <select value={formData.team_activity} onChange={e => updateField('team_activity', e.target.value)} style={inputStyle}>
                                    <option value="">Choose an area...</option>
                                    <option>Data Entry / Processing</option>
                                    <option>Document Management</option>
                                    <option>Approvals & Workflows</option>
                                    <option>Reconciliation / Auditing</option>
                                    <option>Reporting & Analytics</option>
                                    <option>Coordination & Communication</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Work Type (What does the team handle?)</label>
                                <select value={formData.work_type} onChange={e => updateField('work_type', e.target.value)} style={inputStyle}>
                                    <option value="">Select data type...</option>
                                    <option>System-to-System Data</option>
                                    <option>Standard Documents (Forms/Invoices)</option>
                                    <option>Complex Documents (Contracts/Unstructured)</option>
                                    <option>Email-driven Coordination</option>
                                    <option>Mixed / Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in-up">
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Scale & <span className="gradient-text">Effort</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Quantify the human effort involved.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Team Size</label>
                                <select value={formData.team_size} onChange={e => updateField('team_size', e.target.value)} style={inputStyle}>
                                    <option value="">Headcount...</option>
                                    <option>1 person</option>
                                    <option>2-5 people</option>
                                    <option>6-15 people</option>
                                    <option>16-50 people</option>
                                    <option>50+ people</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Individual Time Spent</label>
                                <select value={formData.time_spent} onChange={e => updateField('time_spent', e.target.value)} style={inputStyle}>
                                    <option value="">% of day...</option>
                                    <option>Under 25%</option>
                                    <option>25-50%</option>
                                    <option>50-75%</option>
                                    <option>Over 75%</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Monthly Volume (Transactions/Events)</label>
                                <select value={formData.monthly_volume} onChange={e => updateField('monthly_volume', e.target.value)} style={inputStyle}>
                                    <option value="">Select volume...</option>
                                    <option>Under 500</option>
                                    <option>500 - 2,000</option>
                                    <option>2,000 - 10,000</option>
                                    <option>10,000 - 50,000</option>
                                    <option>Over 50,000</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={labelStyle}>Execution Frequency</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    {['Continuous', 'Daily', 'Weekly', 'Rarely'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => updateField('frequency', f)}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: formData.frequency === f ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                                background: formData.frequency === f ? 'rgba(37, 99, 235, 0.05)' : 'white',
                                                color: formData.frequency === f ? 'var(--primary-color)' : 'var(--text-secondary)',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-fade-in-up">
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Pain & <span className="gradient-text">Priority</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Why is this a candidate for automation?</p>
                        </div>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Primary Goal</label>
                                <select value={formData.automation_goals} onChange={e => updateField('automation_goals', e.target.value)} style={inputStyle}>
                                    <option value="">Select primary goal...</option>
                                    <option>Reduce Costs</option>
                                    <option>Increase Speed</option>
                                    <option>Reduce Errors</option>
                                    <option>Handle Higher Volume</option>
                                    <option>Improve Experience</option>
                                    <option>Compliance / Audit Trail</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Current Challenges (Multi-select)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    {['Too Slow', 'High Error Rate', 'Volume Issues', 'Key Person Risk', 'Compliance Risk', 'No Visibility'].map(c => (
                                        <div
                                            key={c}
                                            onClick={() => toggleArrayField('challenges', c)}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: formData.challenges.includes(c) ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                                background: formData.challenges.includes(c) ? 'rgba(37, 99, 235, 0.05)' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.8125rem',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <div style={{ width: '14px', height: '14px', border: '1px solid var(--primary-color)', borderRadius: '3px', background: formData.challenges.includes(c) ? 'var(--primary-color)' : 'transparent' }} />
                                            {c}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Team Bottleneck Level</label>
                                <select value={formData.bottleneck_effect} onChange={e => updateField('bottleneck_effect', e.target.value)} style={inputStyle}>
                                    <option value="">Select impact...</option>
                                    <option>Self-contained</option>
                                    <option>Minor delays to others</option>
                                    <option>Regular delays / Bottleneck</option>
                                    <option>Major organization blocker</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="animate-fade-in-up">
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Process <span className="gradient-text">DNA</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Technical details for feasibility analysis.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Documentation Status</label>
                                <select value={formData.documentation_status} onChange={e => updateField('documentation_status', e.target.value)} style={inputStyle}>
                                    <option value="">Select status...</option>
                                    <option>Up to date</option>
                                    <option>Outdated</option>
                                    <option>Tribal Knowledge Only</option>
                                    <option>No documentation</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Consistency Rate</label>
                                <select value={formData.consistency_rate} onChange={e => updateField('consistency_rate', e.target.value)} style={inputStyle}>
                                    <option value="">How repetitive?</option>
                                    <option>Highly Repetitive (90%+)</option>
                                    <option>Mostly Repetitive (70-90%)</option>
                                    <option>Variable (50-70%)</option>
                                    <option>Ad-hoc (Under 50%)</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>System Count</label>
                                <select value={formData.systems_count} onChange={e => updateField('systems_count', e.target.value)} style={inputStyle}>
                                    <option value="">Number of tools...</option>
                                    <option>1 system</option>
                                    <option>2-3 systems</option>
                                    <option>4-6 systems</option>
                                    <option>7+ systems</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Infrastructure Type</label>
                                <select value={formData.systems_type} onChange={e => updateField('systems_type', e.target.value)} style={inputStyle}>
                                    <option value="">Select type...</option>
                                    <option>All Cloud / SaaS</option>
                                    <option>Mixed Cloud & Legacy</option>
                                    <option>Mostly Legacy / Desktop</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Process Importance</label>
                                <select value={formData.importance} onChange={e => updateField('importance', e.target.value)} style={inputStyle}>
                                    <option value="">Select priority...</option>
                                    <option>Critical (Operational Necessity)</option>
                                    <option>High (Daily dependency)</option>
                                    <option>Medium (Helpful but not vital)</option>
                                    <option>Low (Occasional usage)</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Explainability / Logic</label>
                                <select value={formData.explainability} onChange={e => updateField('explainability', e.target.value)} style={inputStyle}>
                                    <option value="">Select complexity...</option>
                                    <option>Simple Rules (IF/THEN)</option>
                                    <option>Moderate (Some judgment)</option>
                                    <option>Complex (Expert judgment required)</option>
                                    <option>Creative / Ad-hoc</option>
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Active Comm Channels</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {['Email', 'Slack/Teams', 'Internal Portal'].map(ch => (
                                        <div
                                            key={ch}
                                            onClick={() => toggleArrayField('comm_channels', ch)}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: formData.comm_channels.includes(ch) ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                                background: formData.comm_channels.includes(ch) ? 'rgba(37, 99, 235, 0.05)' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.8125rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {ch}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="animate-fade-in-up">
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Final <span className="gradient-text">Review</span></h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Review your information before submission.</p>
                        </div>
                        <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                                <div><span style={{ color: 'var(--text-secondary)' }}>Process:</span> <br /> <strong>{formData.name || '-'}</strong></div>
                                <div><span style={{ color: 'var(--text-secondary)' }}>Functional Area:</span> <br /> <strong>{formData.team_activity || '-'}</strong></div>
                                <div><span style={{ color: 'var(--text-secondary)' }}>Scale:</span> <br /> <strong>{formData.team_size} people</strong></div>
                                <div><span style={{ color: 'var(--text-secondary)' }}>Monthly Volume:</span> <br /> <strong>{formData.monthly_volume}</strong></div>
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <label style={labelStyle}>Additional Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={e => updateField('notes', e.target.value)}
                                placeholder="Any specific requirements or edge cases?"
                                style={{ ...inputStyle, height: '100px', resize: 'none' }}
                            />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div style={{ paddingTop: '100px', paddingBottom: '100px', maxWidth: '700px', margin: '0 auto' }}>
            {/* Steps Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative', padding: '0 1rem' }}>
                <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: 'var(--border-color)', zIndex: 0 }} />
                <div style={{ position: 'absolute', top: '15px', left: '10%', width: `${((step - 1) / 4) * 80}%`, height: '2px', background: 'var(--primary-color)', zIndex: 0, transition: 'width 0.3s' }} />
                {stepInfo.map((s, i) => (
                    <div key={i} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: step > i + 1 ? 'var(--primary-color)' : (step === i + 1 ? 'white' : 'var(--surface-color)'),
                            border: `2px solid ${step >= i + 1 ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            color: step > i + 1 ? 'white' : (step === i + 1 ? 'var(--primary-color)' : 'var(--text-secondary)'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                        }}>
                            {step > i + 1 ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: '0.625rem', fontWeight: '800', textTransform: 'uppercase', marginTop: '0.5rem', display: 'block', color: step >= i + 1 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.title}</span>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '3rem' }}>
                {renderStep()}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '3rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <button onClick={step === 1 ? onCancel : handleBack} className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    <button
                        className="btn-primary"
                        onClick={step === 5 ? () => onSubmit(formData) : handleNext}
                        style={{ padding: '0.75rem 2rem' }}
                    >
                        {step === 5 ? 'Submit for Audit' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProcessSubmissionForm;
