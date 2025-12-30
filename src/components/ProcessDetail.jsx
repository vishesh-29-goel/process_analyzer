import React, { useState, useEffect } from 'react';

const ProcessDetail = ({ process, onBack, onUpdate, userRole = 'admin' }) => {
    const isAdmin = userRole === 'admin';
    const [isEditing, setIsEditing] = useState(false);
    const [localProcess, setLocalProcess] = useState({
        ...process,
        impact: process.impact || { financial: [], efficiency: [], accuracy: [] },
        systems_detail: process.systems_detail || [],
        integration_method: process.integration_method || 'Manual'
    });

    const updateField = (field, val) => {
        if (!isAdmin) return;
        setLocalProcess(prev => ({ ...prev, [field]: val }));
    };

    const updateImpact = (type, id, field, val) => {
        const nextImpact = { ...localProcess.impact };
        nextImpact[type] = nextImpact[type].map(m =>
            m.id === id ? { ...m, [field]: val } : m
        );
        recalcAndSet(nextImpact);
    };

    const addMetric = (type) => {
        const nextImpact = { ...localProcess.impact };
        const newMetric = {
            id: Math.random().toString(36).substr(2, 9),
            name: 'New Metric',
            unit: 'units',
            baseline: '0',
            target: '0',
            value: 0
        };
        nextImpact[type] = [...(nextImpact[type] || []), newMetric];
        recalcAndSet(nextImpact);
    };

    const removeMetric = (type, id) => {
        const nextImpact = { ...localProcess.impact };
        nextImpact[type] = nextImpact[type].filter(m => m.id !== id);
        recalcAndSet(nextImpact);
    };

    const recalcAndSet = (nextImpact) => {
        const total = (nextImpact.financial || []).reduce((s, m) => s + (parseFloat(m.value) || 0), 0) +
            (nextImpact.efficiency || []).reduce((s, m) => s + (parseFloat(m.value) || 0), 0) +
            (nextImpact.accuracy || []).reduce((s, m) => s + (parseFloat(m.value) || 0), 0);
        setLocalProcess(prev => ({ ...prev, impact: nextImpact, potential_value: total }));
    };

    const handleSave = () => {
        onUpdate(process.id, localProcess);
        setIsEditing(false);
        alert('Changes saved successfully.');
    };

    const sectionHeaderStyle = {
        background: 'var(--primary-color)',
        color: 'white',
        padding: '0.75rem 1.25rem',
        borderRadius: '8px',
        fontWeight: '800',
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '1.5rem',
        marginTop: '2rem'
    };

    const metricHeaderStyle = {
        background: '#3b82f6',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '700',
        marginBottom: '0.5rem'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '2rem'
    };

    const thStyle = {
        padding: '0.75rem 1rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid var(--border-color)',
        fontWeight: '700'
    };

    const tdStyle = {
        padding: '1rem',
        fontSize: '0.875rem',
        borderBottom: '1px solid var(--border-color)'
    };

    return (
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <button onClick={onBack} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', marginBottom: '1rem' }}>← Back</button>
                    <h1 style={{ fontSize: '2.5rem' }}>{localProcess.name} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{localProcess.industry}</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>{localProcess.company} · Scoped on {new Date(localProcess.submitted_at).toLocaleDateString()}</p>
                </div>
                {isAdmin && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {isEditing ? (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)' }}>ACTION SIGNAL</label>
                                    <select className="form-input" value={localProcess.action_signal || ''} onChange={e => updateField('action_signal', e.target.value)} style={{ width: 'auto', padding: '0.4rem' }}>
                                        <option value="">None</option>
                                        <option>Pursue</option><option>Discovery</option><option>Deprioritize</option><option>Pass</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)' }}>STATUS</label>
                                    <select className="form-input" value={localProcess.status} onChange={e => updateField('status', e.target.value)} style={{ width: 'auto', padding: '0.4rem' }}>
                                        <option>New</option><option>Under Review</option><option>Completed</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-secondary" onClick={() => { setLocalProcess({ ...process }); setIsEditing(false); }} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Cancel</button>
                                    <button className="btn-primary" onClick={handleSave} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Save Changes</button>
                                </div>
                            </>
                        ) : (
                            <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit Details</button>
                        )}
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                {isAdmin && isEditing ? (
                    <textarea
                        className="form-input"
                        style={{ height: '80px', marginBottom: '1.5rem', background: '#f8fafc' }}
                        value={localProcess.description || ''}
                        onChange={e => updateField('description', e.target.value)}
                        placeholder="Process description..."
                    />
                ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem', marginBottom: '2rem' }}>
                        {localProcess.description || "No description provided."}
                    </p>
                )}

                {/* Section 1: Business Impact */}
                <div style={sectionHeaderStyle}>Section 1: Business Impact</div>

                {['financial', 'efficiency', 'accuracy'].map((type, idx) => (
                    <div key={type} style={{ marginBottom: '2rem' }}>
                        <div style={{ ...metricHeaderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{String.fromCharCode(65 + idx)}. {type.charAt(0).toUpperCase() + type.slice(1)} Impact</span>
                            {isAdmin && isEditing && (
                                <button
                                    onClick={() => addMetric(type)}
                                    style={{ background: 'white', color: 'var(--primary-color)', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', fontSize: '0.65rem', fontWeight: '800', cursor: 'pointer' }}
                                >
                                    + Add Metric
                                </button>
                            )}
                        </div>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Metric</th>
                                    <th style={thStyle}>Unit</th>
                                    <th style={thStyle}>Baseline</th>
                                    <th style={thStyle}>Target</th>
                                    <th style={{ ...thStyle, textAlign: 'right' }}>Annual Value</th>
                                    {isAdmin && isEditing && <th style={{ ...thStyle, width: '40px' }}></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {(localProcess.impact[type] || []).map(m => (
                                    <tr key={m.id}>
                                        <td style={tdStyle}>
                                            {isAdmin && isEditing ? (
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                    value={m.name || ''}
                                                    onChange={e => updateImpact(type, m.id, 'name', e.target.value)}
                                                />
                                            ) : m.name}
                                        </td>
                                        <td style={tdStyle}>
                                            {isAdmin && isEditing ? (
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                    value={m.unit || ''}
                                                    onChange={e => updateImpact(type, m.id, 'unit', e.target.value)}
                                                />
                                            ) : m.unit || '-'}
                                        </td>
                                        <td style={tdStyle}>
                                            {isAdmin && isEditing ? (
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                    value={m.baseline || '0'}
                                                    onChange={e => updateImpact(type, m.id, 'baseline', e.target.value)}
                                                />
                                            ) : m.baseline || '0'}
                                        </td>
                                        <td style={tdStyle}>
                                            {isAdmin && isEditing ? (
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                    value={m.target || '0'}
                                                    onChange={e => updateImpact(type, m.id, 'target', e.target.value)}
                                                />
                                            ) : m.target || '0'}
                                        </td>
                                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '700' }}>
                                            {isAdmin && isEditing ? (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                                                    <span>$</span>
                                                    <input
                                                        type="number"
                                                        className="form-input"
                                                        style={{ width: '100px', padding: '0.25rem 0.5rem', fontSize: '0.8rem', textAlign: 'right' }}
                                                        value={m.value || '0'}
                                                        onChange={e => updateImpact(type, m.id, 'value', e.target.value)}
                                                    />
                                                </div>
                                            ) : `$${(parseFloat(m.value) || 0).toLocaleString()}`}
                                        </td>
                                        {isAdmin && isEditing && (
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                                                <button onClick={() => removeMetric(type, m.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', fontSize: '1rem' }}>×</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}

                <div className="glass" style={{ padding: '2rem', borderRadius: '12px', textAlign: 'center', background: '#f8fafc' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Potential Annual Value</p>
                    <h2 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>${(parseFloat(localProcess.potential_value) || 0).toLocaleString()}</h2>
                </div>

                {/* Section 2: Feasibility Assessment */}
                <div style={sectionHeaderStyle}>Section 2: Feasibility Assessment</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                    <AssessGroup label="Monthly Volume" value={localProcess.monthly_volume} isAdmin={isAdmin && isEditing} type="volume" onChange={val => updateField('monthly_volume', val)} />
                    <AssessGroup label="Process Frequency" value={localProcess.frequency} isAdmin={isAdmin && isEditing} type="frequency" onChange={val => updateField('frequency', val)} />
                    <AssessGroup label="Team Size" value={localProcess.team_size} isAdmin={isAdmin && isEditing} type="team" onChange={val => updateField('team_size', val)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Strategic Scores</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <label style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>VALUE</label>
                                <select
                                    className="form-input"
                                    value={localProcess.value_score || ''}
                                    onChange={e => updateField('value_score', e.target.value)}
                                    disabled={!isAdmin || !isEditing}
                                    style={{ padding: '0.3rem', fontSize: '0.8rem' }}
                                >
                                    <option value="">Unscored</option>
                                    <option>High</option><option>Medium</option><option>Low</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <label style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>FEASIBILITY</label>
                                <select
                                    className="form-input"
                                    value={localProcess.feasibility_score || ''}
                                    onChange={e => updateField('feasibility_score', e.target.value)}
                                    disabled={!isAdmin || !isEditing}
                                    style={{ padding: '0.3rem', fontSize: '0.8rem' }}
                                >
                                    <option value="">Unscored</option>
                                    <option>High</option><option>Medium</option><option>Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Integration Feasibility</label>
                    {isAdmin && isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>INTEGRATION METHOD</label>
                            <select
                                className="form-input"
                                value={localProcess.integration_method || 'Manual'}
                                onChange={e => updateField('integration_method', e.target.value)}
                                style={{ width: 'auto', padding: '0.4rem' }}
                            >
                                <option>API</option>
                                <option>DB Access</option>
                                <option>RPA / Screen Scraping</option>
                                <option>File Export/Import</option>
                                <option>Manual</option>
                            </select>
                        </div>
                    ) : (
                        <div style={{ fontWeight: '800', color: 'var(--primary-color)' }}>{localProcess.integration_method || 'Manual'}</div>
                    )}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Main Challenges</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {localProcess.challenges?.map(c => <span key={c} className="chip active" style={{ cursor: 'default' }}>{c}</span>)}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>Technical Landscape</label>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Number of Systems</th>
                                <th style={thStyle}>Architecture Type</th>
                                <th style={thStyle}>Connectivity Context</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tdStyle}>
                                    {isAdmin && isEditing ? (
                                        <select className="form-input" value={localProcess.systems_count} onChange={e => updateField('systems_count', e.target.value)}>
                                            <option>1 system</option><option>2-3 systems</option><option>4+ systems</option>
                                        </select>
                                    ) : localProcess.systems_count}
                                </td>
                                <td style={tdStyle}>
                                    {isAdmin && isEditing ? (
                                        <select className="form-input" value={localProcess.systems_type} onChange={e => updateField('systems_type', e.target.value)}>
                                            <option>All Cloud / SaaS</option><option>Legacy / On-Prem</option><option>Hybrid</option>
                                        </select>
                                    ) : localProcess.systems_type}
                                </td>
                                <td style={tdStyle}>
                                    {localProcess.comm_channels ? (Array.isArray(localProcess.comm_channels) ? localProcess.comm_channels.join(', ') : localProcess.comm_channels) : '-'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AssessGroup = ({ label, value, isAdmin, type, onChange }) => {
    const options = {
        volume: ['Under 500', '500-2,000', '2,000-5,000', '5,000+'],
        frequency: ['Daily', 'Weekly', 'Monthly', 'Ad-hoc'],
        team: ['1 person', '2-5 people', '6-15 people', '15+ people']
    };

    return (
        <div>
            <label className="form-label" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>{label}</label>
            {isAdmin ? (
                <select
                    className="form-input"
                    style={{ padding: '0.4rem', fontSize: '0.875rem' }}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                >
                    <option value="">Select...</option>
                    {options[type].map(o => <option key={o}>{o}</option>)}
                </select>
            ) : (
                <div style={{ fontWeight: '800' }}>{value || '-'}</div>
            )}
        </div>
    );
};

export default ProcessDetail;
