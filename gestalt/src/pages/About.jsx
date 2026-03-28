import React from 'react';
import { Link } from 'react-router-dom';

const TIMELINE = [
  { year: '2020', event: 'Founded with a passion for trending streetwear prints' },
  { year: '2021', event: 'Mastered Puff Print technique — became local favourite' },
  { year: '2022', event: 'Added 3D Gel & Shiny Metallic to the print repertoire' },
  { year: '2023', event: 'Launched single-piece custom orders via WhatsApp' },
  { year: '2024', event: 'GESTALT born — your designs, our craft, maximum quality' },
];

export default function About() {
  return (
    <div className="page-wrapper" style={{ paddingTop: 90, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '60px 5vw 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>◑</div>
        <h1 className="font-heading" style={{ color: 'var(--gold-light)', textShadow: '0 0 30px rgba(201,168,76,0.4)', marginBottom: 12 }}>
          OUR STORY
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto' }}>
          We started with a needle, thread, and a vision — to make custom printed streetwear accessible to everyone, one piece at a time.
        </p>
        <div className="section-divider" />
      </div>

      {/* Timeline */}
      <div style={{ padding: '20px 5vw', maxWidth: 800, margin: '0 auto' }}>
        {TIMELINE.map((item, i) => (
          <div key={item.year} style={{
            display: 'flex', gap: 28, marginBottom: 32,
            opacity: 0, animation: `fadeUp 0.6s ease ${i * 0.15}s forwards`,
          }}>
            <div style={{ flex: '0 0 80px', textAlign: 'right' }}>
              <div style={{ fontFamily: '"Oswald", sans-serif', color: 'var(--gold)', fontSize: '1rem', fontWeight: 700 }}>{item.year}</div>
            </div>
            <div style={{ width: 2, background: 'linear-gradient(to bottom, var(--gold), var(--border-gold))', position: 'relative', flexShrink: 0 }}>
              <div style={{
                position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                width: 12, height: 12, borderRadius: '50%',
                background: 'var(--gold)', boxShadow: '0 0 16px rgba(201,168,76,0.8)',
              }} />
            </div>
            <div className="glass-card" style={{ flex: 1, padding: '16px 22px', marginTop: -2 }}>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{item.event}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div style={{ padding: '40px 5vw' }}>
        <h2 className="font-heading" style={{ color: 'var(--gold-light)', textAlign: 'center', marginBottom: 40 }}>
          What We Stand For
        </h2>
        <div className="grid-3">
          {[
            { icon: '◉', title: 'Quality First', desc: 'Premium fabrics and printing techniques that last wash after wash.' },
            { icon: '✦', title: 'Your Design', desc: 'We believe your outfit should tell your story — not someone else\'s.' },
            { icon: '◎', title: 'Single Piece', desc: 'No minimum orders. One hoodie for you is just as important to us.' },
          ].map(v => (
            <div key={v.title} className="glass-card" style={{ padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', color: 'var(--gold-light)', marginBottom: 12 }}>{v.icon}</div>
              <h3 className="font-heading" style={{ color: 'var(--text-primary)', marginBottom: 10, fontSize: '1rem' }}>{v.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Link to="/contact" className="btn btn-gold">Connect With Us ✦</Link>
      </div>

      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
