import React from 'react';

const CustomerDashboard = ({ onNewProcess, processes }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed': return { bg: '#ecfdf5', color: '#059669', border: '#10b98120' };
            case 'Under Review': return { bg: '#eff6ff', color: '#2563eb', border: '#3b82f620' };
            case 'New': return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
            default: return { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };
        }
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div className="animate-fade-in-up" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '4rem'
            }}>
                <div>
                    <div className="badge" style={{ background: 'var(--secondary-color)', color: 'white', marginBottom: '1rem' }}>
                        Process Analyzer
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1' }}>
                        Your Automation <span className="gradient-text">Insights</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginTop: '0.75rem' }}>
                        Track your candidates and their strategic qualification status.
                    </p>
                </div>
                <button className="btn-primary" onClick={onNewProcess}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Analyze New Process
                </button>
            </div>

            <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem', animationDelay: '0.1s' }}>
                {[
                    { label: 'Total Scoped', value: processes.length, icon: '📋' },
                    { label: 'Under Review', value: processes.filter(p => p.status === 'Under Review').length, icon: '🔎' },
                    { label: 'Completed Analysis', value: processes.filter(p => p.status === 'Completed').length, icon: '🎯' }
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card animate-fade-in-up" style={{ overflow: 'hidden', animationDelay: '0.2s', padding: '0' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1.25rem 2rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Target Process</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stage</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Scores (V/F)</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Est. Annual ROI</th>
                                <th style={{ padding: '1.25rem 2rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processes.map((proc) => {
                                const status = getStatusStyles(proc.status);
                                return (
                                    <tr key={proc.id} className="table-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s ease' }}>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div>
                                                <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem' }}>{proc.name}</div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{proc.priority} Priority Focus</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 1.5rem' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '0.35rem 0.85rem',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                background: status.bg,
                                                color: status.color,
                                                border: `1px solid ${status.border}`
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.color, marginRight: '0.5rem' }} />
                                                {(proc.status || 'New').toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <ScoreBadge score={proc.value_score} label="V" />
                                                <ScoreBadge score={proc.feasibility_score} label="F" />
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 1.5rem' }}>
                                            <div style={{ fontWeight: '900', color: 'var(--primary-color)', fontSize: '1.125rem' }}>
                                                {proc.potential_value ? `$${parseFloat(proc.potential_value).toLocaleString()}` : '—'}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600' }}>
                                            {proc.submitted_at ? new Date(proc.submitted_at).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {processes.length === 0 && (
                    <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎯</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Start Your First Qualification</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Our analysts will review your submission and provide strategic scoring.</p>
                        <button className="btn-primary" onClick={onNewProcess}>Begin Analysis</button>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .table-row:hover { background-color: rgba(37, 99, 235, 0.03); cursor: pointer; }
            `}} />
        </div>
    );
};

const ScoreBadge = ({ score, label }) => (
    <span style={{
        fontSize: '0.6875rem',
        fontWeight: '800',
        padding: '0.2rem 0.5rem',
        borderRadius: '4px',
        background: score ? (score === 'High' ? '#dcfce7' : score === 'Medium' ? '#fef9c3' : '#fee2e2') : '#f1f5f9',
        color: score ? (score === 'High' ? '#166534' : score === 'Medium' ? '#854d0e' : '#991b1b') : '#94a3b8',
        border: score ? '1px solid currentColor' : '1px solid #e2e8f0',
        minWidth: '40px',
        textAlign: 'center'
    }}>
        {label}:{score ? score[0] : '-'}
    </span>
);

export default CustomerDashboard;
