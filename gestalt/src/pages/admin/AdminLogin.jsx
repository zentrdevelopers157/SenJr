import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const ADMIN_PASSWORD = 'gestalt2024';

export default function AdminLogin() {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem('gestalt_admin_pw') || ADMIN_PASSWORD;
    if (pw === stored) {
      sessionStorage.setItem('gestalt_admin', '1');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box glass-card">
        <div className="admin-brand font-heading">GESTALT</div>
        <div className="admin-login-title">Admin Portal</div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--gold)', display: 'block', marginBottom: 6, letterSpacing: '0.12em' }}>PASSWORD</label>
            <input
              className="input-gold"
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p style={{ color: '#ff6060', fontSize: '0.82rem', marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '13px' }}>
            Enter Admin Panel →
          </button>
        </form>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 16, textAlign: 'center' }}>
          Default password: gestalt2024
        </p>
      </div>
    </div>
  );
}
