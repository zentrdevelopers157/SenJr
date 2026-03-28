import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const STATUS_PILL = {
  'Lead Received': 'status-lead',
  'Design Under Review': 'status-review',
  'Approved for Production': 'status-review',
  'In Production': 'status-production',
  'Ready to Ship': 'status-production',
  'Shipped': 'status-shipped',
};

export default function AdminDashboard() {
  const { leads, products } = useApp();
  const designs = JSON.parse(localStorage.getItem('gestalt_designs') || '[]');
  const pendingDesigns = designs.filter(d => d.status === 'pending').length;
  const recentLeads = leads.slice(0, 8);

  return (
    <AdminLayout title="Dashboard">
      {/* Metric cards */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Total Leads</div>
          <div className="metric-value">{leads.length}</div>
          <div className="metric-sub">WhatsApp inquiries</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Pending Designs</div>
          <div className="metric-value">{pendingDesigns}</div>
          <div className="metric-sub">Awaiting review</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Active Products</div>
          <div className="metric-value">{products.length}</div>
          <div className="metric-sub">In catalogue</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Custom Orders</div>
          <div className="metric-value">{leads.filter(l => l.type === 'custom').length}</div>
          <div className="metric-sub">Design uploads</div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <Link to="/admin/products" className="btn-admin btn-admin-primary">+ Add Product</Link>
        <Link to="/admin/orders" className="btn-admin btn-admin-ghost">View All Leads</Link>
        <Link to="/admin/designs" className="btn-admin btn-admin-ghost">Review Designs</Link>
      </div>

      {/* Recent leads table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Recent WhatsApp Leads</div>
          <Link to="/admin/orders" style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>View All →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {recentLeads.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No leads yet. Leads appear here when customers click "Connect on WhatsApp".
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map(lead => (
                  <tr key={lead.id}>
                    <td style={{ color: 'var(--gold-dark)', fontFamily: 'monospace' }}>{lead.id}</td>
                    <td>{lead.productName || '—'}</td>
                    <td>
                      <span className={`badge ${lead.type === 'custom' ? 'badge-purple' : 'badge-blue'}`}>
                        {lead.type === 'custom' ? 'Custom' : 'Standard'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {lead.size && `${lead.size} · ${lead.printType}`}
                    </td>
                    <td>
                      <span className={`status-pill ${STATUS_PILL[lead.status] || 'status-lead'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
