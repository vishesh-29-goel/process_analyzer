import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import CustomerDashboard from './components/CustomerDashboard';
import ProcessSubmissionForm from './components/ProcessSubmissionForm';
import AdminDashboard from './components/AdminDashboard';
import ProcessDetail from './components/ProcessDetail';

const API_URL = (() => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8888/api';
  }
  // Support Coder-style port subdomains (e.g., 5173--workspace--user.coder...)
  if (hostname.includes('coder-live.zamp.dev')) {
    const parts = hostname.split('.');
    const firstPart = parts[0];
    if (firstPart.includes('--')) {
      // Replaces the port part (before the first --) with 8888
      const newFirstPart = firstPart.replace(/^\d+/, '8888');
      return `https://${newFirstPart}.${parts.slice(1).join('.')}/api`;
    }
  }
  return 'https://processanalyzer.processeval-zamp.workers.dev/api';
})();

function App() {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    // Check for admin entry point
    if (window.location.pathname === '/admin' && !user) {
      setIsAdminLogin(true);
      setView('login');
      // Update browser history so refresh doesn't immediately go back to login unless on /admin
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Protected View Guard
  useEffect(() => {
    if (user && user.role !== 'admin') {
      const adminViews = ['admin-dashboard', 'admin-detail'];
      if (adminViews.includes(view)) {
        console.warn(`Unauthorized access attempt to ${view} by customer ${user.email}`);
        setView('customer-dashboard');
      }
    }
  }, [view, user]);

  useEffect(() => {
    if (user) {
      fetchProcesses();
    }
  }, [user]);

  async function checkUser() {
    const savedUser = localStorage.getItem('pace_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Enforce correct initial view based on role
      if (parsedUser.role === 'admin') {
        setView(prev => prev === 'login' || prev === 'landing' ? 'admin-dashboard' : prev);
      } else {
        setView(prev => prev === 'login' || prev === 'landing' ? 'customer-dashboard' : prev);
      }
    }
    setLoading(false);
  }

  async function fetchProcesses() {
    if (!user) return;
    try {
      const resp = await fetch(`${API_URL}/processes`, {
        headers: {
          'X-User-Id': user.id,
          'X-User-Role': user.role
        }
      });
      const data = await resp.json();
      const mappedData = data.map(p => ({
        ...p,
        submitted: p.submitted_at ? (p.submitted_at.includes('T') ? p.submitted_at.split('T')[0] : p.submitted_at.split(' ')[0]) : 'N/A'
      }));
      setProcesses(mappedData);
    } catch (error) {
      console.error('Error fetching processes:', error);
    }
  }

  const handleUpdateProcess = async (id, updatedData) => {
    if (!user) return;
    try {
      const resp = await fetch(`${API_URL}/processes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id,
          'X-User-Role': user.role
        },
        body: JSON.stringify(updatedData)
      });

      if (!resp.ok) throw new Error('Update failed');
      setProcesses(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    } catch (error) {
      console.error('Error updating process:', error);
      alert('Error updating process. Check console.');
    }
  };

  const handleProcessSubmit = async (data) => {
    if (!user) {
      alert('Please log in to submit a process.');
      return;
    }

    // Use data as-is but ensure mandatory fields
    const newProcess = {
      ...data,
      company: user.company_name || user.company || 'Acme Corp',
      user_id: user.id,
      status: 'New',
      recommendation: '-',
      // Don't overwrite impact if it's already there (from new form)
      impact: data.impact || { financial: [], efficiency: [], accuracy: [] },
      systems_detail: data.systems_detail || [],
    };

    try {
      const resp = await fetch(`${API_URL}/processes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id,
          'X-User-Role': user.role
        },
        body: JSON.stringify(newProcess)
      });

      const result = await resp.json();

      if (resp.ok && result.success) {
        setProcesses(prev => [{ ...newProcess, id: result.id, submitted: new Date().toISOString().split('T')[0] }, ...prev]);
        setView(user.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard');
        alert('Process submitted successfully!');
      } else {
        throw new Error(result.error || 'Server returned an error');
      }
    } catch (error) {
      console.error('Error submitting process:', error);
      alert(`Failed to submit process: ${error.message}`);
    }
  };

  const handleViewProcess = (proc) => {
    setSelectedProcess(proc);
    setView(user.role === 'admin' ? 'admin-detail' : 'customer-detail');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pace_user');
    setView('landing');
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Pace...</div>;

  return (
    <div className="app">
      {view !== 'landing' && view !== 'login' && <Navbar user={user} onLogout={handleLogout} setView={setView} />}

      {view === 'landing' && (
        <Landing
          onStart={() => { setIsAdminLogin(false); setView('login'); }}
          onAdminLogin={() => { setIsAdminLogin(true); setView('login'); }}
        />
      )}

      {view === 'login' && (
        <Login
          isAdminLogin={isAdminLogin}
          onLogin={(userData) => {
            setUser(userData);
            const targetView = (isAdminLogin && userData.role === 'admin')
              ? 'admin-dashboard'
              : 'customer-dashboard';
            setIsAdminLogin(false);
            setView(targetView);
          }}
          onBack={() => {
            setIsAdminLogin(false);
            setView('landing');
          }}
        />
      )}

      {view === 'customer-dashboard' && (
        <CustomerDashboard
          processes={processes.filter(p => p.user_id === user?.id || user?.role === 'admin')}
          onNewProcess={() => setView('submission')}
          onViewProcess={handleViewProcess}
        />
      )}

      {view === 'submission' && (
        <ProcessSubmissionForm API_URL={API_URL} onSubmit={handleProcessSubmit} onCancel={() => setView('customer-dashboard')} />
      )}

      {view === 'admin-dashboard' && <AdminDashboard API_URL={API_URL} processes={processes} onViewProcess={(p) => { setSelectedProcess(p); setView('admin-detail'); }} />}

      {view === 'admin-detail' && (
        <ProcessDetail
          process={processes.find(p => p.id === selectedProcess?.id)}
          onBack={() => setView('admin-dashboard')}
          onUpdate={handleUpdateProcess}
          userRole="admin"
        />
      )}

      {view === 'customer-detail' && (
        <ProcessDetail
          process={processes.find(p => p.id === selectedProcess?.id)}
          onBack={() => setView('customer-dashboard')}
          userRole="customer"
        />
      )}
    </div>
  );
}

export default App;
