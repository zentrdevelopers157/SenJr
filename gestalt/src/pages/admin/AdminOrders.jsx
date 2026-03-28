import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from './AdminLayout';

const STATUSES = ['Lead Received','Design Under Review','Approved for Production','In Production','Ready to Ship','Shipped'];
const PILL_CLASS = { 'Lead Received':'status-lead','Design Under Review':'status-review','Approved for Production':'status-review','In Production':'status-production','Ready to Ship':'status-production','Shipped':'status-shipped' };

export default function AdminOrders() {
  const { leads, updateLead } = useApp();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? leads : leads.filter(l => l.status === filter);

  return (
    <AdminLayout title="Orders / Leads">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            className={`btn-admin ${filter === s ? 'btn-admin-primary' : 'btn-admin-ghost'}`}
            onClick={() => setFilter(s)}
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >{s}</button>
        ))}
      </div>

      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead><tr>
              <th>Order ID</th><th>Product</th><th>Type</th><th>Size</th><th>Print</th><th>Status</th><th>Date</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--gold-dark)', fontSize: '0.8rem' }}>{lead.id}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.productName || '—'}</td>
                  <td><span className={`badge ${lead.type === 'custom' ? 'badge-purple' : 'badge-blue'}`}>{lead.type === 'custom' ? 'Custom' : 'Standard'}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{lead.size || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{lead.printType || '—'}</td>
                  <td>
                    <select
                      className="input-gold"
                      value={lead.status}
                      onChange={e => updateLead(lead.id, { status: e.target.value })}
                      style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto', minWidth: 160 }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td>
                    <button className="btn-admin btn-admin-ghost" onClick={() => setSelected(lead)}>View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No leads yet. They appear here when customers contact you via WhatsApp from the website.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead detail modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Lead Details — {selected.id}</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid var(--border-gold)', borderRadius: 8, padding: 20, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
{`Order ID:    ${selected.id}
Product:     ${selected.productName || '—'}
Type:        ${selected.type || 'standard'}
Size:        ${selected.size || '—'}
Fabric:      ${selected.fabric || '—'}
Color:       ${selected.color || '—'}
Print Type:  ${selected.printType || '—'}
Design File: ${selected.designFile || '(none)'}
Date:        ${selected.createdAt ? new Date(selected.createdAt).toLocaleString('en-IN') : '—'}
Status:      ${selected.status}`}
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">UPDATE STATUS</label>
              <select className="input-gold" value={selected.status}
                onChange={e => { updateLead(selected.id, { status: e.target.value }); setSelected({...selected, status: e.target.value}); }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
