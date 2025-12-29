import React, { useState, useEffect } from 'react';

const AdminProcessDetail = ({ process, onBack, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('Submission');
    const [localProcess, setLocalProcess] = useState({
        ...process,
        impact: process.impact || { financial: [], efficiency: [], accuracy: [] },
        systems_detail: process.systems_detail || [],
        notes: process.notes || ''
    });

    // Pre-populate impact metrics if empty
    useEffect(() => {
        const defaultImpact = {
            financial: [
                { id: 'f1', name: 'Potential labor savings', unit: '$', baseline: '0', target: '0', value: 0 },
                { id: 'f2', name: 'Cost of undetected errors', unit: '$', baseline: '0', target: '0', value: 0 }
            ],
            efficiency: [
                { id: 'e1', name: 'Process turnaround time', unit: 'Days', baseline: '0', target: '0', value: 0 },
                { id: 'e2', name: 'Manual effort reduction', unit: 'Hours', baseline: '0', target: '0', value: 0 }
            ],
            accuracy: [
                { id: 'a1', name: 'Error reduction rate', unit: '%', baseline: '0', target: '0', value: 0 },
                { id: 'a2', name: 'Zero-touch rate', unit: '%', baseline: '0', target: '0', value: 0 }
            ]
        };

        if (Object.values(localProcess.impact).every(arr => arr.length === 0)) {
            setLocalProcess(prev => ({ ...prev, impact: defaultImpact }));
        }
    }, []);

    const updateField = (field, val) => setLocalProcess(prev => ({ ...prev, [field]: val }));

    const updateImpact = (type, id, field, val) => {
        const updated = {
            ...localProcess.impact,
            [type]: localProcess.impact[type].map(m => m.id === id ? { ...m, [field]: val } : m)
        };
        setLocalProcess(prev => ({ ...prev, impact: updated }));
    };

    const addImpactMetric = (type) => {
        const newMetric = { id: Date.now(), name: 'New Metric', unit: '', baseline: '0', target: '0', value: 0 };
        setLocalProcess(prev => ({
            ...prev,
            impact: { ...prev.impact, [type]: [...prev.impact[type], newMetric] }
        }));
    };

    const addSystem = () => {
        const newSys = { id: Date.now(), name: 'System Name', type: 'Cloud', access: 'API' };
        setLocalProcess(prev => ({ ...prev, systems_detail: [...prev.systems_detail, newSys] }));
    };

    const updateSystem = (id, field, val) => {
        setLocalProcess(prev => ({
            ...prev,
            systems_detail: prev.systems_detail.map(s => s.id === id ? { ...s, [field]: val } : s)
        }));
    };

    const handleSave = () => {
        // Calculate total potential value from financial impact
        const totalValue = localProcess.impact.financial.reduce((sum, m) => sum + (parseFloat(m.value) || 0), 0);

        onUpdate(process.id, {
            ...localProcess,
            potential_value: totalValue
        });
        alert('Process update successful.');
    };

    const inputStyle = {
        width: '100%',
        padding: '0.625rem 0.875rem',
        borderRadius: '8px',
        background: 'white',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        fontSize: '0.875rem',
        outline: 'none'
    };

    const sectionTitleStyle = {
        fontSize: '0.75rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--text-secondary)',
        marginBottom: '1rem',
        display: 'block'
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'Submission':
                return (
                    <div className="animate-fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                            <div className="card" style={{ padding: '2rem' }}>
                                <span style={sectionTitleStyle}>Core Scope</span>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <DetailRow label="Name" value={localProcess.name} />
                                    <DetailRow label="Description" value={localProcess.description} />
                                    <DetailRow label="Company" value={localProcess.company} />
                                    <DetailRow label="Industry" value={localProcess.industry} />
                                    <DetailRow label="Activity" value={localProcess.team_activity} />
                                    <DetailRow label="Work Type" value={localProcess.work_type} />
                                </div>
                            </div>
                            <div className="card" style={{ padding: '2rem' }}>
                                <span style={sectionTitleStyle}>Scale & Effort</span>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <DetailRow label="Team Size" value={localProcess.team_size} />
                                    <DetailRow label="Time Spent" value={localProcess.time_spent} />
                                    <DetailRow label="Monthly Volume" value={localProcess.monthly_volume} />
                                    <DetailRow label="Frequency" value={localProcess.frequency} />
                                </div>
                            </div>
                            <div className="card" style={{ padding: '2rem' }}>
                                <span style={sectionTitleStyle}>Pain Points</span>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <DetailRow label="Goals" value={localProcess.automation_goals} />
                                    <DetailRow label="Challenges" value={localProcess.challenges?.join(', ')} />
                                    <DetailRow label="Bottleneck" value={localProcess.bottleneck_effect} />
                                    <DetailRow label="Client Priority" value={localProcess.priority} />
                                </div>
                            </div>
                            <div className="card" style={{ padding: '2rem' }}>
                                <span style={sectionTitleStyle}>Process DNA</span>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <DetailRow label="Documentation" value={localProcess.documentation_status} />
                                    <DetailRow label="Repetitiveness" value={localProcess.consistency_rate} />
                                    <DetailRow label="Systems" value={`${localProcess.systems_count} (${localProcess.systems_type})`} />
                                    <DetailRow label="Channels" value={localProcess.comm_channels?.join(', ')} />
                                    <DetailRow label="Importance" value={localProcess.importance} />
                                    <DetailRow label="Logic" value={localProcess.explainability} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Scoring':
                return (
                    <div className="animate-fade-in">
                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="card" style={{ padding: '2rem' }}>
                                <span style={sectionTitleStyle}>Strategic Qualification</span>
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Value Score</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {['High', 'Medium', 'Low'].map(s => (
                                                <button key={s} onClick={() => updateField('value_score', s)} className={localProcess.value_score === s ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1, padding: '0.5rem' }}>{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Feasibility Score</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {['High', 'Medium', 'Low'].map(s => (
                                                <button key={s} onClick={() => updateField('feasibility_score', s)} className={localProcess.feasibility_score === s ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1, padding: '0.5rem' }}>{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Priority Signal</label>
                                        <select value={localProcess.priority_signal} onChange={(e) => updateField('priority_signal', e.target.value)} style={inputStyle}>
                                            <option value="">Select signal...</option>
                                            <option>Champion Ready</option>
                                            <option>Interested</option>
                                            <option>Low Urgency</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{ padding: '2rem' }}>
                                <span style={sectionTitleStyle}>Final Verdict</span>
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Action Signal</label>
                                        <select value={localProcess.action_signal} onChange={(e) => updateField('action_signal', e.target.value)} style={{ ...inputStyle, fontWeight: '700', color: 'var(--primary-color)' }}>
                                            <option value="">Select action...</option>
                                            <option>Pursue</option>
                                            <option>Discovery</option>
                                            <option>Deprioritize</option>
                                            <option>Pass</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>Analyst Recommendation</label>
                                        <textarea
                                            value={localProcess.recommendation}
                                            onChange={(e) => updateField('recommendation', e.target.value)}
                                            placeholder="Write the executive summary recommendation..."
                                            style={{ ...inputStyle, height: '120px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Impact':
                return (
                    <div className="animate-fade-in">
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {['financial', 'efficiency', 'accuracy'].map(type => (
                                <div key={type} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
                                        <span style={{ fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem' }}>{type} Impact</span>
                                        <button onClick={() => addImpactMetric(type)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>+ Add</button>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left' }}>Metric</th>
                                                <th style={{ padding: '0.75rem 1rem' }}>Unit</th>
                                                <th style={{ padding: '0.75rem 1rem' }}>Baseline</th>
                                                <th style={{ padding: '0.75rem 1rem' }}>Target</th>
                                                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right' }}>Annual Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {localProcess.impact[type].map(m => (
                                                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '0.5rem 1.5rem' }}><input value={m.name} onChange={(e) => updateImpact(type, m.id, 'name', e.target.value)} style={{ ...inputStyle, border: 'none', padding: '0' }} /></td>
                                                    <td style={{ padding: '0.5rem 1rem' }}><input value={m.unit} onChange={(e) => updateImpact(type, m.id, 'unit', e.target.value)} style={{ ...inputStyle, border: 'none', padding: '0', textAlign: 'center' }} /></td>
                                                    <td style={{ padding: '0.5rem 1rem' }}><input value={m.baseline} onChange={(e) => updateImpact(type, m.id, 'baseline', e.target.value)} style={{ ...inputStyle, border: 'none', padding: '0', textAlign: 'center' }} /></td>
                                                    <td style={{ padding: '0.5rem 1rem' }}><input value={m.target} onChange={(e) => updateImpact(type, m.id, 'target', e.target.value)} style={{ ...inputStyle, border: 'none', padding: '0', textAlign: 'center' }} /></td>
                                                    <td style={{ padding: '0.5rem 1.5rem', textAlign: 'right' }}><input value={m.value} onChange={(e) => updateImpact(type, m.id, 'value', e.target.value)} style={{ ...inputStyle, border: 'none', padding: '0', textAlign: 'right', fontWeight: '700' }} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Systems':
                return (
                    <div className="animate-fade-in">
                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
                                <span style={{ fontWeight: '800', textTransform: 'uppercase', fontSize: '0.75rem' }}>System Landscape</span>
                                <button onClick={addSystem} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>+ Add System</button>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left' }}>System Name</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                                        <th style={{ padding: '0.75rem 1rem' }}>Integration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(localProcess.systems_detail || []).map(sys => (
                                        <tr key={sys.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.75rem 1.5rem' }}><input value={sys.name} onChange={(e) => updateSystem(sys.id, 'name', e.target.value)} style={{ ...inputStyle, border: 'none', padding: '0' }} /></td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <select value={sys.type} onChange={(e) => updateSystem(sys.id, 'type', e.target.value)} style={{ ...inputStyle, border: 'none', padding: '0' }}>
                                                    <option>Cloud / SaaS</option>
                                                    <option>Legacy Desktop</option>
                                                    <option>Mainframe / Green Screen</option>
                                                    <option>Excel / Local File</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '0.75rem 1rem' }}>
                                                <select value={sys.access} onChange={(e) => updateSystem(sys.id, 'access', e.target.value)} style={{ ...inputStyle, border: 'none', padding: '0' }}>
                                                    <option>API Available</option>
                                                    <option>DB Access</option>
                                                    <option>UI / Surface Only</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Notes':
                return (
                    <div className="animate-fade-in">
                        <div className="card" style={{ padding: '2rem' }}>
                            <span style={sectionTitleStyle}>Internal Analyst Notes</span>
                            <textarea
                                value={localProcess.notes}
                                onChange={(e) => updateField('notes', e.target.value)}
                                placeholder="Add internal observations, next steps, or risks..."
                                style={{ ...inputStyle, height: '400px', resize: 'none' }}
                            />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1rem', fontWeight: '700', fontSize: '0.875rem' }}>
                        ← Back to Master View
                    </button>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1' }}>{localProcess.name}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{localProcess.company} · Scoped on {new Date(localProcess.submitted_at).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={localProcess.status}
                        onChange={(e) => updateField('status', e.target.value)}
                        style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: 'white', border: '1px solid var(--border-color)', fontWeight: '700', outline: 'none' }}
                    >
                        <option>New</option>
                        <option>Under Review</option>
                        <option>Completed</option>
                    </select>
                    <button onClick={handleSave} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Save Changes</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                {['Submission', 'Scoring', 'Impact', 'Systems', 'Notes'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '1rem 0.5rem',
                            background: 'none',
                            border: 'none',
                            color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-secondary)',
                            fontWeight: '800',
                            fontSize: '0.8125rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            borderBottom: activeTab === tab ? '3px solid var(--primary-color)' : '3px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ minHeight: '500px' }}>
                {renderTab()}
            </div>
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{label}:</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{value || '-'}</span>
    </div>
);

export default AdminProcessDetail;
