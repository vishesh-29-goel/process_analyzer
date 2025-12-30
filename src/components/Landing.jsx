import React from 'react';

const Landing = ({ onStart, onAdminLogin }) => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-color)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0) 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, rgba(56, 189, 248, 0) 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            {/* Header */}
            <header className="glass" style={{
                margin: '1.5rem 2rem',
                padding: '1rem 2.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
                position: 'sticky',
                top: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/pace-logo.png" alt="Pace Logo" style={{ height: '32px', width: 'auto' }} />
                    <span style={{
                        fontWeight: '800',
                        fontSize: '1.5rem',
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Pace</span>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                zIndex: 1
            }}>
                <div className="animate-fade-in-up" style={{ maxWidth: '1000px', textAlign: 'center' }}>
                    <div className="badge" style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary-color)',
                        marginBottom: '2rem',
                        display: 'inline-flex'
                    }}>
                        New: AI-Powered Process Scoring
                    </div>

                    <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: '900', lineHeight: '0.95', letterSpacing: '-0.06em', marginBottom: '1.5rem' }}>
                        The definitive standard for <span className="gradient-text">process qualification</span>
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        maxWidth: '680px',
                        margin: '0 auto 3.5rem',
                        fontWeight: '400'
                    }}>
                        Stop guessing where to automate. Get a precision diagnostic of your business processes and quantify ROI before you spend a single dollar.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            onClick={onStart}
                            className="btn-primary"
                            style={{
                                padding: '1.25rem 2.5rem',
                                fontSize: '1.125rem'
                            }}
                        >
                            Start Free Analysis
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>

                    {/* Dashboard Preview Hint */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem', marginBottom: '1.5rem' }}>
                        <img src="/pace-logo.png" alt="Pace Logo" style={{ height: '48px', width: 'auto' }} />
                        <span className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>
                            Pace
                        </span>
                    </div>
                    <div className="animate-float" style={{ marginTop: '5rem', opacity: 0.8 }}>
                        <div className="glass" style={{
                            padding: '1rem 2rem',
                            borderRadius: '16px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '1rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }} />
                                ))}
                            </div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                Leading enterprises trust Pace
                            </span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border-color)',
                zIndex: 1
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span>© 2025 Pace. Build for efficiency.</span>
                        <button
                            onClick={onAdminLogin}
                            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                        >
                            Log in as Admin
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
