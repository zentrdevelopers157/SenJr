import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const waNumber = localStorage.getItem('gestalt_wa_number') || '919999999999';
  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      background: 'rgba(5,5,16,0.9)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(201,168,76,0.12)',
      padding: '48px 5vw 28px',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ fontFamily: '"Oswald", sans-serif', fontSize: '1.4rem', color: 'var(--gold-light)', marginBottom: 12 }}>
            GESTALT
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
            Premium custom printed apparel. Puff, 3D & Shiny prints. Single piece orders welcome.
          </p>
        </div>
        <div>
          <div style={{ fontFamily: '"Oswald", sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: 16 }}>PRODUCTS</div>
          {['Hoodies', 'T-Shirts', 'Trousers', 'Design Your Own'].map(l => (
            <Link key={l} to={`/category/${l.toLowerCase().replace(/\s/g,'-')}`}
              style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 8, transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color='var(--gold-light)'}
              onMouseOut={e => e.target.style.color='var(--text-secondary)'}
            >{l}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: '"Oswald", sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: 16 }}>INFO</div>
          {[['About', '/about'], ['FAQ', '/faq'], ['Contact', '/contact']].map(([l,r]) => (
            <Link key={l} to={r}
              style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 8 }}
            >{l}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: '"Oswald", sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--gold)', marginBottom: 16 }}>CONNECT</div>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#25d366', fontSize: '0.9rem', marginBottom: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Direct WhatsApp Chat
          </a>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Custom orders · Single piece welcome</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        © 2024 GESTALT. All Rights Reserved. · Crafted with precision.
      </div>
    </footer>
  );
}
