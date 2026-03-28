import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GoldenDial from './GoldenDial';

export default function Navbar() {
  const [dialOpen, setDialOpen] = useState(false);

  return (
    <>
      <nav 
        style={{ 
          padding: '20px 5vw', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'fixed', 
          top: 0, 
          width: '100%', 
          zIndex: 90, 
          background: 'rgba(10,10,10,0.85)', 
          backdropFilter: 'blur(16px)', 
          borderBottom: '1px solid rgba(255,255,255,0.05)' 
        }}
      >
        <Link 
          to="/" 
          className="font-heading" 
          style={{ 
            fontSize: '1.4rem', 
            letterSpacing: '0.05em',
            color: 'var(--gold-light)', 
            textDecoration: 'none' 
          }}
        >
          GESTALT
        </Link>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link 
            to="/about" 
            style={{ 
              fontSize: '0.9rem', 
              color: 'var(--text-primary)', 
              textDecoration: 'none',
              letterSpacing: '0.05em',
              fontWeight: 500
            }}
          >
            ABOUT
          </Link>

          <Link 
            to="/customize" 
            className="btn btn-outline" 
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            CUSTOM DESIGN
          </Link>

          <button 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--gold-light)', 
              fontSize: '1.8rem', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              lineHeight: '0.4',
              justifyContent: 'center',
              paddingBottom: '8px'
            }} 
            onClick={() => setDialOpen(true)}
            title="Golden Dial Menu"
          >
            ⋮
          </button>
        </div>
      </nav>

      {dialOpen && <GoldenDial onClose={() => setDialOpen(false)} />}
    </>
  );
}
