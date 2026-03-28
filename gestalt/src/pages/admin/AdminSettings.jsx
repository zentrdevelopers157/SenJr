import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from './AdminLayout';

export default function AdminSettings() {
  const { waNumber, setWaNumber } = useApp();
  const [wa, setWa] = useState(waNumber);
  const [pw, setPw] = useState('');
  const [saved, setSaved] = useState('');

  const saveWA = () => {
    const clean = wa.replace(/\D/g, '');
    setWaNumber(clean);
    setSaved('WhatsApp number saved!');
    setTimeout(() => setSaved(''), 2500);
  };
  const savePW = () => {
    if (pw.length < 6) { setSaved('Password must be at least 6 characters.'); return; }
    localStorage.setItem('gestalt_admin_pw', pw);
    setSaved('Password updated!'); setPw('');
    setTimeout(() => setSaved(''), 2500);
  };

  return (
    <AdminLayout title="Settings">
      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {saved && (
          <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366', padding: '10px 16px', borderRadius: 8, fontSize: '0.85rem' }}>
            ✓ {saved}
          </div>
        )}

        {/* WhatsApp number */}
        <div className="admin-card">
          <div className="admin-card-header"><div className="admin-card-title">WhatsApp Number</div></div>
          <div className="admin-card-body">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: 14 }}>
              All customer orders from the website will be sent to this WhatsApp number. Include country code (e.g. 919876543210 for India).
            </p>
            <div className="form-group">
              <label className="form-label">WHATSAPP NUMBER (with country code, no +)</label>
              <input className="input-gold" value={wa} onChange={e => setWa(e.target.value)} placeholder="919876543210" />
            </div>
            <div style={{ marginTop: 4, color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 14 }}>
              Current: wa.me/{waNumber}
            </div>
            <button className="btn-admin btn-admin-primary" onClick={saveWA}>Save WhatsApp Number</button>
          </div>
        </div>

        {/* Change password */}
        <div className="admin-card">
          <div className="admin-card-header"><div className="admin-card-title">Change Admin Password</div></div>
          <div className="admin-card-body">
            <div className="form-group">
              <label className="form-label">NEW PASSWORD (min 6 characters)</label>
              <input className="input-gold" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="New password..." />
            </div>
            <button className="btn-admin btn-admin-primary" onClick={savePW}>Update Password</button>
          </div>
        </div>

        {/* Info */}
        <div className="admin-card">
          <div className="admin-card-header"><div className="admin-card-title">Platform Info</div></div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['Platform', 'GESTALT v1.0'],
              ['Data Storage', 'Browser localStorage'],
              ['WhatsApp Integration', 'wa.me deep links'],
              ['Admin Password Default', 'gestalt2024'],
            ].map(([k,v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{k}</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.83rem', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
