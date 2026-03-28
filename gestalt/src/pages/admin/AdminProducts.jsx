import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminLayout from './AdminLayout';

const EMPTY_PRODUCT = {
  name: '', category: 'hoodies', price: '', description: '', leadTime: '5-7 days',
  sizes: 'S,M,L,XL,XXL', fabrics: 'Luxury Fleece,Ultra-Soft Poly-Blend,Heavyweight Cotton',
  colors: 'Obsidian Black,Platinum White,Midnight Navy',
  prints: 'Puff Print,3D Gel Print,Shiny Metallic,DTG',
  printType: 'Puff Print', featured: false, image: '',
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [search, setSearch] = useState('');

  const openAdd = () => { setEditing(null); setForm(EMPTY_PRODUCT); setModal(true); };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ ...p, sizes: p.sizes?.join(','), fabrics: p.fabrics?.join(','), colors: p.colors?.join(','), prints: p.prints?.join(',') });
    setModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const data = {
      ...form, price: Number(form.price),
      sizes:   form.sizes.split(',').map(s => s.trim()),
      fabrics: form.fabrics.split(',').map(s => s.trim()),
      colors:  form.colors.split(',').map(s => s.trim()),
      prints:  form.prints.split(',').map(s => s.trim()),
    };
    if (editing) updateProduct(editing, data);
    else addProduct(data);
    setModal(false);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const f = (key, label, type = 'text') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === 'textarea' ? (
        <textarea className="input-gold" rows={3} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} />
      ) : type === 'select' ? (
        <select className="input-gold" value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}>
          <option value="hoodies">Hoodies</option>
          <option value="tshirts">T-Shirts</option>
          <option value="trousers">Trousers</option>
        </select>
      ) : (
        <input className="input-gold" type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} />
      )}
    </div>
  );

  return (
    <AdminLayout title="Products">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <input className="input-gold" placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 260 }} />
        <button className="btn-admin btn-admin-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead><tr>
              <th>Name</th><th>Category</th><th>Price</th><th>Print</th><th>Featured</th><th>Lead Time</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><span className="badge badge-blue">{p.category}</span></td>
                  <td style={{ color: 'var(--gold-light)', fontWeight: 600 }}>₹{p.price?.toLocaleString('en-IN')}</td>
                  <td><span className="badge badge-purple">{p.printType}</span></td>
                  <td>{p.featured ? <span className="badge badge-gold">Yes</span> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.leadTime}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-admin btn-admin-ghost" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn-admin btn-admin-danger" onClick={() => { if(window.confirm(`Delete ${p.name}?`)) deleteProduct(p.id); }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 30 }}>No products found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              {f('name', 'PRODUCT NAME')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {f('category', 'CATEGORY', 'select')}
                {f('price', 'BASE PRICE (₹)', 'number')}
              </div>
              {f('description', 'DESCRIPTION', 'textarea')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {f('printType', 'DEFAULT PRINT TYPE')}
                {f('leadTime', 'LEAD TIME')}
              </div>
              {f('sizes', 'SIZES (comma-separated: S,M,L,XL,XXL)')}
              {f('fabrics', 'FABRICS (comma-separated)')}
              {f('colors', 'COLORS (comma-separated)')}
              {f('prints', 'PRINT TYPES (comma-separated)')}
              {f('image', 'IMAGE URL (optional)')}
              <div className="form-group">
                <label style={{ display: 'flex', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} style={{ accentColor: 'var(--gold)' }} />
                  Show on Home page (Featured)
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" className="btn-admin btn-admin-primary" style={{ flex: 1, padding: 12 }}>
                  {editing ? '✓ Save Changes' : '+ Add Product'}
                </button>
                <button type="button" className="btn-admin btn-admin-ghost" onClick={() => setModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
