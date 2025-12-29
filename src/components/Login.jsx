import React, { useState, useEffect } from 'react';

const Login = ({ onLogin, onBack, isAdminLogin = false }) => {
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8787/api'
        : '/api';

    useEffect(() => {
        if (isAdminLogin) {
            setView('login');
        }
    }, [isAdminLogin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            if (view === 'login') {
                const resp = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await resp.json();

                if (!result.success || !result.user) {
                    throw new Error('Invalid login credentials');
                }

                const userObj = {
                    id: result.user.id,
                    email: email,
                    role: result.user.role || 'customer',
                    name: result.user.full_name,
                    company: result.user.company_name
                };

                localStorage.setItem('pace_user', JSON.stringify(userObj));
                onLogin(userObj);
            } else if (view === 'signup') {
                const resp = await fetch(`${API_URL}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, full_name: fullName, company_name: companyName })
                });
                const result = await resp.json();

                if (!result.success) {
                    throw new Error(result.error || 'Signup failed');
                }

                const userObj = {
                    id: result.user.id,
                    email: email,
                    role: 'customer',
                    name: fullName,
                    company: companyName
                };

                localStorage.setItem('pace_user', JSON.stringify(userObj));
                onLogin(userObj);
            } else if (view === 'forgot') {
                const resp = await fetch(`${API_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await resp.json();

                if (!result.success) {
                    throw new Error(result.error || 'Password reset failed');
                }

                setSuccessMsg('Password updated successfully. You can now sign in.');
                setTimeout(() => setView('login'), 3000);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decor */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '400px',
                height: '400px',
                background: isAdminLogin ? 'rgba(37, 99, 235, 0.05)' : 'rgba(124, 58, 237, 0.05)',
                filter: 'blur(100px)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            <div className="card animate-fade-in" style={{
                width: '100%',
                maxWidth: '480px',
                padding: '3.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: isAdminLogin ? 'rgba(37, 99, 235, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                        color: isAdminLogin ? 'var(--primary-color)' : 'var(--accent-color)',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '1.5rem'
                    }}>
                        {isAdminLogin ? 'Admin Portal' : 'Customer Access'}
                    </div>

                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '900',
                        letterSpacing: '-0.05em',
                        marginBottom: '0.75rem',
                        color: 'var(--text-primary)'
                    }}>
                        {view === 'forgot' ? 'Reset' : (isAdminLogin ? 'Welcome, ' : 'Hello ')}
                        <span className="gradient-text">
                            {view === 'forgot' ? ' Password' : (isAdminLogin ? 'Admin' : 'There')}
                        </span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        {view === 'forgot'
                            ? 'Enter your email and a new password to reset your account.'
                            : (isAdminLogin
                                ? 'Secure access to the Pace management dashboard.'
                                : (view === 'login' ? 'Welcome back! Please enter your details.' : 'Create a Pace account to get started.'))}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {view === 'signup' && !isAdminLogin && (
                        <>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Jane Doe"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-color)',
                                        background: 'white',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>Company Name</label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Acme Corp"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-color)',
                                        background: 'white',
                                        outline: 'none'
                                    }}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'white',
                                outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                {view === 'forgot' ? 'New Password' : 'Password'}
                            </label>
                            {view === 'login' && (
                                <button
                                    type="button"
                                    onClick={() => setView('forgot')}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                                >
                                    Forgot password?
                                </button>
                            )}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    paddingRight: '3rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    outline: 'none'
                                }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            marginBottom: '2rem',
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            marginBottom: '2rem',
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>
                            {successMsg}
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1.125rem',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '800',
                            marginTop: '1rem',
                            boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.3)'
                        }}
                    >
                        {loading ? 'Processing...' : (view === 'login' ? 'Sign In' : (view === 'signup' ? 'Create Account' : 'Reset Password'))}
                    </button>

                    {view === 'forgot' && (
                        <button
                            type="button"
                            onClick={() => setView('login')}
                            style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer', marginTop: '1rem' }}
                        >
                            Back to Sign In
                        </button>
                    )}
                </form>

                {!isAdminLogin && view !== 'forgot' && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', textAlign: 'center', marginTop: '2rem' }}>
                        {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary-color)',
                                fontWeight: '800',
                                cursor: 'pointer',
                                padding: '0'
                            }}
                        >
                            {view === 'login' ? 'Create one now' : 'Sign in here'}
                        </button>
                    </p>
                )}

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
                        onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                    >
                        Return to Website
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
