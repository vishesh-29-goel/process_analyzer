import React, { useState } from 'react';

const AdminDashboard = ({ processes, onViewProcess }) => {
    const [filters, setFilters] = useState({
        company: 'All Companies',
        industry: 'All Industries',
        value_score: 'All Value',
        feasibility_score: 'All Feasibility',
        action_signal: 'All Actions',
        status: 'All Statuses',
        search: ''
    });

    const stats = {
        total: processes.length,
        new: processes.filter(p => p.status === 'New').length,
        pursue: processes.filter(p => p.action_signal === 'Pursue').length,
        pipeline: processes.reduce((acc, p) => {
            if (p.action_signal === 'Pursue' || p.action_signal === 'Discovery') {
                return acc + (parseFloat(p.potential_value) || 0);
            }
            return acc;
        }, 0)
    };

    const filteredProcesses = processes.filter(p => {
        const matchesCompany = filters.company === 'All Companies' || p.company === filters.company;
        const matchesIndustry = filters.industry === 'All Industries' || p.industry === filters.industry;
        const matchesValue = filters.value_score === 'All Value' || p.value_score === filters.value_score;
        const matchesFeasibility = filters.feasibility_score === 'All Feasibility' || p.feasibility_score === filters.feasibility_score;
        const matchesAction = filters.action_signal === 'All Actions' || p.action_signal === filters.action_signal;
        const matchesStatus = filters.status === 'All Statuses' || p.status === filters.status;
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) ||
            p.company.toLowerCase().includes(searchTerm) ||
            (p.industry && p.industry.toLowerCase().includes(searchTerm));

        return matchesCompany && matchesIndustry && matchesValue && matchesFeasibility && matchesAction && matchesStatus && matchesSearch;
    });

    const uniqueValues = (field) => {
        const items = processes.map(p => p[field]).filter(Boolean);
        const label = field === 'industry' ? 'All Industries' : 'All Companies';
        return [label, ...new Set(items)];
    };

    const companies = uniqueValues('company');
    const industries = uniqueValues('industry');

    const filterStyle = {
        padding: '0.625rem 0.75rem',
        borderRadius: '10px',
        background: 'white',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        outline: 'none',
        fontSize: '0.8125rem',
        minWidth: '140px'
    };

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <div className="animate-fade-in-up">
                <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div className="badge" style={{ background: 'var(--secondary-color)', color: 'white', marginBottom: '1rem' }}>
                            Admin Operations
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1' }}>
                            Process <span className="gradient-text">Master View</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginTop: '0.75rem' }}>
                            Advanced qualification and pipeline management.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {[
                        { label: 'Total Scoped', value: stats.total, icon: '📋' },
                        { label: 'Unscored', value: stats.new, icon: '✨' },
                        { label: 'High Priority', value: stats.pursue, icon: '🎯' },
                        { label: 'Est. Pipeline Value', value: `$${stats.pipeline.toLocaleString()}`, icon: '💰', color: 'var(--primary-color)' }
                    ].map((stat, i) => (
                        <div key={i} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{stat.label}</p>
                            <h2 style={{ fontSize: '1.75rem', color: stat.color || 'var(--text-primary)', fontWeight: '900' }}>{stat.value}</h2>
                        </div>
                    ))}
                </div>

                <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', opacity: 0.5 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input
                                type="text"
                                placeholder="Search by name, company, or industry..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    borderRadius: '10px',
                                    background: 'white',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontSize: '0.9375rem'
                                }}
                            />
                        </div>
                        <button
                            className="btn-secondary"
                            style={{ padding: '0 1.5rem', fontSize: '0.8125rem' }}
                            onClick={() => setFilters({
                                company: 'All Companies',
                                industry: 'All Industries',
                                value_score: 'All Value',
                                feasibility_score: 'All Feasibility',
                                action_signal: 'All Actions',
                                status: 'All Statuses',
                                search: ''
                            })}
                        >
                            Reset
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <select value={filters.company} onChange={e => setFilters({ ...filters, company: e.target.value })} style={filterStyle}>
                            {companies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={filters.industry} onChange={e => setFilters({ ...filters, industry: e.target.value })} style={filterStyle}>
                            {industries.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                        <select value={filters.value_score} onChange={e => setFilters({ ...filters, value_score: e.target.value })} style={filterStyle}>
                            <option>All Value</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <select value={filters.feasibility_score} onChange={e => setFilters({ ...filters, feasibility_score: e.target.value })} style={filterStyle}>
                            <option>All Feasibility</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <select value={filters.action_signal} onChange={e => setFilters({ ...filters, action_signal: e.target.value })} style={filterStyle}>
                            <option>All Actions</option>
                            <option>Pursue</option>
                            <option>Discovery</option>
                            <option>Deprioritize</option>
                            <option>Pass</option>
                        </select>
                        <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={filterStyle}>
                            <option>All Statuses</option>
                            <option>New</option>
                            <option>Under Review</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Process & Company</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Industry</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Scores (V/F)</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Action Signal</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProcesses.map((proc) => (
                                    <tr key={proc.id} className="table-row" style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => onViewProcess(proc)}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{proc.name}</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{proc.company}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem' }}>
                                            {proc.industry || '-'}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                <ScoreTag score={proc.value_score} label="V" />
                                                <ScoreTag score={proc.feasibility_score} label="F" />
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            {proc.action_signal ? (
                                                <span style={{
                                                    padding: '0.25rem 0.625rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '700',
                                                    background: proc.action_signal === 'Pursue' ? '#dcfce7' : proc.action_signal === 'Discovery' ? '#dbeafe' : '#f1f5f9',
                                                    color: proc.action_signal === 'Pursue' ? '#166534' : proc.action_signal === 'Discovery' ? '#1e40af' : '#475569'
                                                }}>
                                                    {proc.action_signal.toUpperCase()}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: proc.status === 'New' ? '#2563eb' : '#94a3b8' }} />
                                                {proc.status}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>Review</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredProcesses.length === 0 && (
                        <div style={{ padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No processes match your current filters.
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .table-row:hover { background: rgba(37, 99, 235, 0.03); }
            `}} />
        </div>
    );
};

const ScoreTag = ({ score, label }) => {
    if (!score) return <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{label}:-</span>;
    const colors = { High: { bg: '#dcfce7', text: '#166534' }, Medium: { bg: '#fef9c3', text: '#854d0e' }, Low: { bg: '#fee2e2', text: '#991b1b' } };
    const c = colors[score] || { bg: '#f1f5f9', text: '#475569' };
    return (
        <span style={{ fontSize: '0.6875rem', fontWeight: '800', padding: '0.15rem 0.4rem', borderRadius: '4px', background: c.bg, color: c.text, border: `1px solid ${c.text}20` }}>
            {label}:{score[0]}
        </span>
    );
};

export default AdminDashboard;
