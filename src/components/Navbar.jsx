import React from 'react';

const Navbar = ({ user, onLogout, setView }) => {
    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 40px)',
            maxWidth: '1200px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 1000,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
        }}>
            <div
                style={{ fontWeight: '800', fontSize: '1.5rem', cursor: 'pointer' }}
                className="gradient-text"
                onClick={() => setView(user?.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard')}
            >
                Process Analyzer
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Logged in as <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong> ({user.company})
                        </span>

                        {(user.role === 'customer' || user.role === 'admin') && (
                            <button
                                onClick={() => setView('customer-dashboard')}
                                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '500' }}
                            >
                                Dashboard
                            </button>
                        )}

                        {user.role === 'admin' && (
                            <button
                                onClick={() => setView('admin-dashboard')}
                                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '500' }}
                            >
                                Master View
                            </button>
                        )}

                        <button
                            className="glass"
                            style={{
                                padding: '0.5rem 1rem',
                                color: '#ef4444',
                                border: '1px solid rgba(239, 68, 68, 0.1)',
                                background: 'rgba(239, 68, 68, 0.05)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button className="btn-primary" onClick={() => setView('login')}>Login</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
