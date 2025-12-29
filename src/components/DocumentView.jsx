import React from 'react';

const DocumentView = ({ onBack }) => {
    // Hardcoded based on the identified file in "Input Documents"
    const documents = [
        {
            name: 'processfit-antigravity-prompt.md',
            size: '9.5 KB',
            type: 'Markdown',
            lastModified: '2023-12-23'
        }
    ];

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <button
                onClick={onBack}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-color)',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}
            >
                ← Back to Home
            </button>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                Input <span className="gradient-text">Documents</span>
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1rem'
            }}>
                {documents.map((doc, i) => (
                    <div key={i} className="glass" style={{
                        padding: '1.5rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'border-color 0.2s ease'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '8px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary-color)'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{doc.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    {doc.type} • {doc.size} • Modified {doc.lastModified}
                                </p>
                            </div>
                        </div>

                        <button className="glass" style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                        }}>
                            View File
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Drop more files into the <code>Input Documents</code> folder to see them here.
                </p>
            </div>
        </div>
    );
};

export default DocumentView;
