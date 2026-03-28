import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import './Home.css';

const SLIDES = [
  {
    title: 'DESIGN YOUR REALITY',
    sub: 'Puff Print · 3D Gel · Shiny Metallic',
    desc: 'Custom hoodies, t-shirts & trousers — single piece welcome.',
    cta: 'Explore Hoodies',
    link: '/category/hoodies',
    emoji: '🧥',
    color1: '#1a1a1a', color2: '#0a0a0a',
  },
  {
    title: 'TRENDING PRINTS',
    sub: 'Premium Streetwear · 100% Custom',
    desc: 'Your design, your style. We print, you slay.',
    cta: 'See T-Shirts',
    link: '/category/tshirts',
    emoji: '👕',
    color1: '#2a2010', color2: '#1a1510',
  },
  {
    title: 'MAKE IT YOURS',
    sub: 'Upload Your Design · We Handle The Rest',
    desc: 'Got your own artwork? Send it to us and we bring it to life.',
    cta: 'Design Your Own',
    link: '/customize',
    emoji: '✦',
    color1: '#151a1a', color2: '#0a0a10',
  },
];

const PRINT_BADGES = [
  { name: 'Puff Print', icon: '◎', desc: 'Raised 3D texture — feels premium, looks bold' },
  { name: '3D Gel Print', icon: '◉', desc: 'High-gloss gel creates depth & dimension' },
  { name: 'Shiny Metallic', icon: '✦', desc: 'Reflective foil that catches every light' },
  { name: 'DTG Print', icon: '▣', desc: 'Photorealistic full-color detail' },
];

export default function Home() {
  const { featured } = useApp();
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState([]);
  const cardsRef = useRef(null);

  // Auto-slide hero
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Intersection observer for fade-up cards
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisible(prev => [...prev, e.target.dataset.idx]);
      });
    }, { threshold: 0.1 });
    const cards = cardsRef.current?.querySelectorAll('[data-idx]');
    cards?.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  const s = SLIDES[slide];

  return (
    <div className="home">
      {/* ---- HERO BANNER ---- */}
      <section
        className="hero"
        style={{ background: `radial-gradient(ellipse at 30% 60%, ${s.color1} 0%, ${s.color2} 40%, transparent 70%)` }}
      >
        <div className="hero-content fade-up visible">
          <div className="hero-badge">NEW COLLECTION 2024</div>
          <h1 className="hero-title">{s.title}</h1>
          <p className="hero-sub">{s.sub}</p>
          <p className="hero-desc">{s.desc}</p>
          <div className="hero-actions">
            <Link to={s.link} className="btn btn-gold hero-cta">{s.cta}</Link>
            <Link to="/customize" className="btn btn-outline">Custom Design ✦</Link>
          </div>
        </div>

        <div className="hero-visual float">
          <div className="hero-emoji">{s.emoji}</div>
          <div className="hero-glow" style={{ background: s.color1 }} />
        </div>

        {/* Slide dots */}
        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === slide ? 'active' : ''}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>

        {/* Scroll arrow */}
        <div className="scroll-arrow">
          <span>▼</span>
        </div>
      </section>

      {/* ---- PRINT TYPES ---- */}
      <section className="section">
        <h2 className="section-title">Our Print Techniques</h2>
        <p className="section-sub">Every print type tells a different story. We master them all.</p>
        <div className="section-divider" />
        <div className="grid-4" ref={cardsRef}>
          {PRINT_BADGES.map((p, i) => (
            <div
              key={p.name}
              data-idx={`print-${i}`}
              className={`print-badge-card glass-card fade-up ${visible.includes(`print-${i}`) ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="print-icon">{p.icon}</div>
              <div className="print-name">{p.name}</div>
              <div className="print-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- FEATURED PRODUCTS ---- */}
      <section className="section" style={{ paddingTop: 20 }}>
        <h2 className="section-title">Featured Products</h2>
        <p className="section-sub">Handpicked premium pieces. All fully customizable.</p>
        <div className="section-divider" />
        <div className="grid-3">
          {featured.map((p, i) => (
            <div
              key={p.id}
              data-idx={`feat-${i}`}
              className={`fade-up ${visible.includes(`feat-${i}`) ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/category/hoodies" className="btn btn-outline">View All Products</Link>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="section how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="section-divider" />
        <div className="steps">
          {[
            { n: '01', t: 'Choose Product', d: 'Select from hoodies, t-shirts, trousers' },
            { n: '02', t: 'Configure It', d: 'Pick your size, fabric, color & print type' },
            { n: '03', t: 'Add Your Design', d: 'Upload your artwork or choose trending prints' },
            { n: '04', t: 'WhatsApp Us', d: 'Hit connect — all your details go directly to us' },
          ].map((step, i) => (
            <div key={step.n} className="step-card glass-card">
              <div className="step-num">{step.n}</div>
              <div className="step-title">{step.t}</div>
              <div className="step-desc">{step.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CATEGORIES ---- */}
      <section className="section" style={{ paddingTop: 20 }}>
        <h2 className="section-title">Shop by Category</h2>
        <div className="section-divider" />
        <div className="cat-grid">
          {[
            { label: 'HOODIES', icon: '🧥', route: '/category/hoodies', color: '#1a1a1a' },
            { label: 'T-SHIRTS', icon: '👕', route: '/category/tshirts', color: '#2a2010' },
            { label: 'TROUSERS', icon: '👖', route: '/category/trousers', color: '#151a1a' },
            { label: 'CUSTOM DESIGN', icon: '✦', route: '/customize', color: '#2a2a2a' },
          ].map(cat => (
            <Link key={cat.label} to={cat.route} className="cat-card glass-card shimmer"
              style={{ '--cat-color': cat.color }}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-label">{cat.label}</div>
              <div className="cat-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- CTA STRIP ---- */}
      <section className="cta-strip">
        <div className="cta-strip-inner">
          <h2 className="font-heading" style={{ color: 'var(--gold-light)', marginBottom: 10 }}>
            Have Your Own Design?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Upload your artwork and we'll turn it into premium custom apparel — single piece welcome.
          </p>
          <Link to="/customize" className="btn btn-gold" style={{ fontSize: '1.05rem', padding: '14px 36px' }}>
            ✦ Design Your Own
          </Link>
        </div>
      </section>
    </div>
  );
}
