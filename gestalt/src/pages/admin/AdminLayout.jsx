import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';

const NAV = [
  { icon: '⊟', label: 'Dashboard',  route: '/admin/dashboard' },
  { icon: '◈', label: 'Products',   route: '/admin/products' },
  { icon: '📦', label: 'Orders',    route: '/admin/orders' },
  { icon: '🎨', label: 'Designs',   route: '/admin/designs' },
  { icon: '📊', label: 'Stock',     route: '/admin/stock' },
  { icon: '⚙', label: 'Settings',  route: '/admin/settings' },
];

export default function AdminLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('gestalt_admin');
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="brand-text font-heading">GESTALT</span>
          <span>ADMIN</span>
        </div>
        <nav className="admin-nav">
          {NAV.map(n => (
            <Link
              key={n.route} to={n.route}
              className={`admin-nav-item ${location.pathname === n.route ? 'active' : ''}`}
            >
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding: '12px 0', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <Link to="/" className="admin-nav-item" style={{ color: 'var(--text-muted)' }}>
            <span className="nav-icon">←</span><span>View Site</span>
          </Link>
          <button className="admin-nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }} onClick={handleLogout}>
            <span className="nav-icon">⏏</span><span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">{title}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/admin/settings" className="btn-admin btn-admin-ghost" style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: 6 }}>⚙ Settings</Link>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
