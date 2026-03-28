import React from 'react';
import AdminLayout from './AdminLayout';

export default function AdminDesigns() {
  const designs = JSON.parse(localStorage.getItem('gestalt_designs') || '[]');

  const markReviewed = (id) => {
    const updated = designs.map(d => d.id === id ? { ...d, status: 'reviewed' } : d);
    localStorage.setItem('gestalt_designs', JSON.stringify(updated));
    window.location.reload();
  };

  return (
    <AdminLayout title="Custom Design Review">
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Customer-uploaded design files. Download the high-res version and mark as reviewed after checking.
        </p>
      </div>

      {designs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎨</div>
          <h3 style={{ fontFamily: '"Oswald", sans-serif', color: 'var(--text-secondary)', marginBottom: 8 }}>No designs yet</h3>
          <p>Customer design uploads appear here when they use the "Design Your Own" page.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 20 }}>
          {designs.map(d => (
            <div key={d.id} className="admin-card" style={{ padding: 0 }}>
              <div style={{ height: 160, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
                {d.preview
                  ? <img src={d.preview} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  : <div style={{ fontSize: '3rem', opacity: 0.3 }}>📄</div>
                }
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span className="badge badge-gray">{d.name.split('.').pop()?.toUpperCase()}</span>
                  <span className={`badge ${d.status === 'reviewed' ? 'badge-green' : 'badge-gold'}`}>
                    {d.status === 'reviewed' ? '✓ Reviewed' : 'Pending'}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 12 }}>
                  {d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-IN') : '—'}
                  {d.size ? ` · ${(d.size/1024).toFixed(0)} KB` : ''}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {d.preview && (
                    <a
                      href={d.preview} download={d.name}
                      className="btn-admin btn-admin-primary"
                      style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}
                    >⬇ Download</a>
                  )}
                  {d.status !== 'reviewed' && (
                    <button className="btn-admin btn-admin-ghost" onClick={() => markReviewed(d.id)}>✓</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
