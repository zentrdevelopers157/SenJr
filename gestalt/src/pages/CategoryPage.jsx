import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const CAT_META = {
  hoodies:  { label: 'Hoodies',  icon: '🧥', desc: 'Premium custom hoodies — puff, 3D, shiny & more.' },
  tshirts:  { label: 'T-Shirts', icon: '👕', desc: 'Bold graphic tees with any print you can imagine.' },
  trousers: { label: 'Trousers', icon: '👖', desc: 'Custom printed track pants & joggers — your style.' },
  'design-your-own': { label: 'Custom Design', icon: '✦', desc: 'Upload your own artwork and wear your imagination.' },
};

export default function CategoryPage() {
  const { category } = useParams();
  const { byCategory } = useApp();
  const meta = CAT_META[category] || { label: category, icon: '◎', desc: '' };
  const products = byCategory(category);
  const gridRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    const cards = gridRef.current?.querySelectorAll('.fade-up');
    cards?.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [category]);

  if (category === 'design-your-own') {
    window.location.replace('/customize'); return null;
  }

  return (
    <div className="page-wrapper" style={{ paddingTop: 90 }}>
      {/* Category header */}
      <div style={{ padding: '60px 5vw 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 16, filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.4))' }}
          className="float-slow"
        >{meta.icon}</div>
        <h1 className="font-heading" style={{ color: 'var(--gold-light)', textShadow: '0 0 30px rgba(201,168,76,0.5)', marginBottom: 12 }}>
          {meta.label.toUpperCase()}
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>{meta.desc}</p>
        <div className="section-divider" />
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '0 5vw 20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <Link to="/" style={{ color: 'var(--gold-dark)' }}>Home</Link>
        {' / '}
        <span style={{ color: 'var(--text-secondary)' }}>{meta.label}</span>
      </div>

      {/* Products grid */}
      <div style={{ padding: '0 5vw 80px' }} ref={gridRef}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>◎</div>
            <h3 className="font-heading" style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>No products yet</h3>
            <p style={{ marginBottom: 24 }}>Check back soon or upload your own design.</p>
            <Link to="/customize" className="btn btn-gold">Design Your Own ✦</Link>
          </div>
        ) : (
          <div className="grid-3">
            {products.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ transitionDelay: `${i * 0.07}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom design CTA */}
      <div style={{
        margin: '0 5vw 80px',
        background: 'var(--bg-card)', border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px', textAlign: 'center',
        boxShadow: 'var(--shadow-gold)',
      }}>
        <h3 className="font-heading" style={{ color: 'var(--gold-light)', marginBottom: 10 }}>
          Don't see what you want?
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
          Upload your own design and we'll print it on any apparel of your choice.
        </p>
        <Link to="/customize" className="btn btn-gold">✦ Custom Design</Link>
      </div>
    </div>
  );
}
