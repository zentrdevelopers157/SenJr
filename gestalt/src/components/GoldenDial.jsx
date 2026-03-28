import React, { useState, useContext, createContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Admin context
export const AdminContext = createContext({ whatsappNumber: '919999999999', products: [], leads: [] });

// All dial positions with icon + label + route
const DIAL_POSITIONS = [
  { id: 'home',       icon: '⌂',  label: 'HOME',           route: '/' },
  { id: 'trending',   icon: '★',  label: 'TRENDING',       route: '/trending' },
  { id: 'hoodies',    icon: '⊞',  label: 'HOODIES',        route: '/category/hoodies' },
  { id: 'tshirts',    icon: '◈',  label: 'T-SHIRTS',       route: '/category/tshirts' },
  { id: 'trousers',   icon: '▣',  label: 'TROUSERS',       route: '/category/trousers' },
  { id: 'collections',icon: '◉',  label: 'COLLECTIONS',    route: '/collections' },
  { id: 'custom',     icon: '✦',  label: 'DESIGN YOUR OWN',route: '/customize' },
  { id: 'about',      icon: '◑',  label: 'ABOUT',          route: '/about' },
  { id: 'faq',        icon: '?',  label: 'FAQS',           route: '/faq' },
  { id: 'contact',    icon: '✉',  label: 'CONTACT',        route: '/contact' },
  { id: 'profile',    icon: '☉',  label: 'PROFILE',        route: '/contact' },
  { id: 'admin',      icon: '⚙',  label: 'ADMIN',          route: '/admin' },
];

export default function GoldenDial({ onClose }) {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const radius = 180; // px from center

  const handleClick = (pos) => {
    navigate(pos.route);
    onClose();
  };

  return (
    <div className="dial-overlay" onClick={onClose}>
      <div className="dial-container" onClick={e => e.stopPropagation()}>
        {/* Rotating outer ring */}
        <div className="dial-ring dial-ring-outer" />
        <div className="dial-ring dial-ring-mid" />

        {/* Center button */}
        <Link to="/customize" onClick={onClose}>
          <div className="dial-center">
            <span className="dial-center-icon">✦</span>
            <span className="dial-center-text">DESIGN<br/>YOUR OWN</span>
          </div>
        </Link>

        {/* Brand name */}
        <div className="dial-brand">GESTALT</div>

        {/* Positions around the clock */}
        {DIAL_POSITIONS.map((pos, i) => {
          const angle = (i * 360) / DIAL_POSITIONS.length - 90; // start at top
          const rad = (angle * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);
          const isHovered = hovered === pos.id;

          return (
            <button
              key={pos.id}
              className={`dial-item ${isHovered ? 'dial-item-hovered' : ''}`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
              onMouseEnter={() => setHovered(pos.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(pos)}
              title={pos.label}
            >
              <span className="dial-item-icon">{pos.icon}</span>
              {isHovered && (
                <span className="dial-item-label">{pos.label}</span>
              )}
            </button>
          );
        })}

        {/* Tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6) - 90;
          const rad = (angle * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const r1 = isMajor ? 218 : 212;
          const r2 = isMajor ? 226 : 218;
          return (
            <div key={i} className="dial-tick" style={{
              position: 'absolute',
              width: isMajor ? '2px' : '1px',
              height: isMajor ? '8px' : '5px',
              background: isMajor ? 'var(--gold)' : 'rgba(201,168,76,0.3)',
              top: '50%', left: '50%',
              transformOrigin: '50% 0',
              transform: `translate(-50%, -${r1}px) rotate(0deg)`,
            }} />
          );
        })}

        <button className="dial-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
