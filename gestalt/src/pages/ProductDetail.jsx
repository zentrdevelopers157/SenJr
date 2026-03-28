import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Configurator from '../components/Configurator';
import WhatsAppButton from '../components/WhatsAppButton';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { getProduct, waNumber, addLead } = useApp();
  const navigate = useNavigate();
  const product = getProduct(id);
  const [config, setConfig] = useState(null);
  const [sizeChart, setSizeChart] = useState(false);

  if (!product) return (
    <div className="page-wrapper" style={{ paddingTop: 120, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 20 }}>◎</div>
      <h2 className="font-heading">Product not found</h2>
      <Link to="/" className="btn btn-gold" style={{ marginTop: 24 }}>Go Home</Link>
    </div>
  );

  const allSelected = !!config;

  const waMessage = config ? `Hi GESTALT! I want to place a custom order:

━━━━━━━━━━━━━━━━━━━━
🛍️ PRODUCT: ${product.name}
📦 Product ID: ${product.id}
📏 Size: ${config.size}
🧵 Fabric: ${config.fabric}
🎨 Color: ${config.color}
✨ Print Type: ${config.printType}
🔢 Quantity: 1 piece
━━━━━━━━━━━━━━━━━━━━

Please share the total price and estimated delivery time. Thank you!` : '';

  const handleWhatsApp = () => {
    addLead({
      productId: product.id, productName: product.name,
      ...config, type: 'standard',
    });
  };

  const PRINT_COLORS = { 'Puff Print':'#b87cff','3D Gel Print':'#50e3c2','Shiny Metallic':'#ffd700','Classic Screen':'#80a0ff','DTG':'#ff9080' };

  return (
    <div className="page-wrapper product-detail" style={{ paddingTop: 90 }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / 
        <Link to={`/category/${product.category}`}> {product.category}</Link> / 
        <span> {product.name}</span>
      </div>

      <div className="pd-main">
        {/* LEFT: Product visual */}
        <div className="pd-left">
          <div className="pd-image-main float">
            {product.image
              ? <img src={product.image} alt={product.name} />
              : (
                <div className="pd-placeholder">
                  <span>{product.category === 'hoodies' ? '🧥' : product.category === 'tshirts' ? '👕' : '👖'}</span>
                </div>
              )
            }
            <div className="pd-print-badge" style={{
              background: `${PRINT_COLORS[product.printType] || '#ccc'}20`,
              borderColor: PRINT_COLORS[product.printType] || '#ccc',
              color: PRINT_COLORS[product.printType] || '#ccc',
            }}>
              {product.printType}
            </div>
          </div>

          <div className="pd-meta-strip">
            <div className="pd-meta-item">
              <span>Lead Time</span>
              <strong>{product.leadTime || '5-7 days'}</strong>
            </div>
            <div className="pd-meta-item">
              <span>MOQ</span>
              <strong>1 Piece</strong>
            </div>
            <div className="pd-meta-item">
              <span>Price</span>
              <strong style={{ color: 'var(--gold-light)' }}>₹{product.price?.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* RIGHT: Configurator */}
        <div className="pd-right">
          <h1 className="pd-name font-heading">{product.name}</h1>
          <p className="pd-desc">{product.description}</p>
          <div className="divider-gold" />

          <div className="pd-config-section">
            <div className="pd-config-header">
              <span className="pd-config-title">CONFIGURE YOUR ORDER</span>
              <button className="size-chart-btn" onClick={() => setSizeChart(true)}>
                📏 Size Chart
              </button>
            </div>
            <Configurator product={product} onComplete={setConfig} />
          </div>

          {/* WhatsApp status */}
          <div className={`wa-status ${allSelected ? 'wa-status-ready' : ''}`}>
            {allSelected
              ? '✓ All options selected — ready to connect!'
              : '⚠ Select all options above to enable WhatsApp'
            }
          </div>

          <WhatsAppButton
            message={waMessage}
            disabled={!allSelected}
            whatsappNumber={waNumber}
            label="Connect on WhatsApp"
            onClick={handleWhatsApp}
          />

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Link to="/customize" style={{ color: 'var(--gold-dark)', fontSize: '0.82rem' }}>
              Have your own design? Upload it here →
            </Link>
          </div>
        </div>
      </div>

      {/* SIZE CHART MODAL */}
      {sizeChart && (
        <div className="modal-overlay" onClick={() => setSizeChart(false)}>
          <div className="modal-box glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-heading">Size Chart (inches)</h3>
              <button onClick={() => setSizeChart(false)}>✕</button>
            </div>
            <table className="size-table">
              <thead><tr><th>Size</th><th>Chest</th><th>Length</th><th>Shoulder</th></tr></thead>
              <tbody>
                {[['S','38','28','17'],['M','40','29','18'],['L','42','30','18.5'],['XL','44','31','19'],['XXL','46','32','20']].map(r => (
                  <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
