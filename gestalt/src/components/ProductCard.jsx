import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const PRINT_COLORS = {
  puff:    '#b87cff',
  '3d':    '#50e3c2',
  shiny:   '#ffd700',
  classic: '#80a0ff',
  dtg:     '#ff9080',
};

export default function ProductCard({ product }) {
  const { id, name, price, printType, category, image, stock } = product;
  const badgeColor = PRINT_COLORS[printType?.toLowerCase()] || '#cccccc';

  return (
    <Link to={`/product/${id}`} className="product-card glass-card shimmer">
      <div className="product-card-image-wrap">
        {image ? (
          <img src={image} alt={name} className="product-card-img" />
        ) : (
          <div className="product-card-placeholder">
            <span className="product-card-placeholder-icon">
              {category === 'hoodies' ? '🧥' : category === 'tshirts' ? '👕' : '👖'}
            </span>
          </div>
        )}
        <div className="product-card-badge" style={{ background: `${badgeColor}20`, borderColor: badgeColor, color: badgeColor }}>
          {printType || 'Custom Print'}
        </div>
        {stock === 0 && <div className="product-card-outofstock">Custom Order</div>}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-name">{name}</h3>
        <div className="product-card-footer">
          <span className="product-card-price">₹{price?.toLocaleString('en-IN') || '—'}</span>
          <span className="product-card-cta">Configure →</span>
        </div>
      </div>

      {/* Floating glow on hover (CSS handles) */}
      <div className="product-card-glow" />
    </Link>
  );
}
