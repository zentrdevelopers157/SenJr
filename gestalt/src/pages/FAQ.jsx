import React, { useState } from 'react';

const FAQS = [
  { q: 'Do you accept single piece orders?', a: 'Yes! We welcome single piece orders. No minimum quantity required. Connect on WhatsApp and we\'ll sort you out.' },
  { q: 'What print types do you offer?', a: 'We specialize in Puff Print, 3D Gel Print, Shiny Metallic Print, Classic Screen Print, and DTG (Direct to Garment) printing.' },
  { q: 'How long does an order take?', a: 'Typically 5-10 days depending on print type and complexity. Puff/3D prints take a bit longer (7-10 days). We\'ll confirm exact time on WhatsApp.' },
  { q: 'Can I upload my own design?', a: 'Absolutely! Visit the "Design Your Own" page, upload your PNG, SVG, or AI file and fill in your apparel preferences. We\'ll take it from there.' },
  { q: 'What file formats do you accept for custom designs?', a: 'We accept PNG (with transparency preferred), SVG (vector), Adobe Illustrator (.ai), Photoshop (.psd), and high-res JPG. Minimum 300 DPI at intended print size.' },
  { q: 'How does the WhatsApp ordering process work?', a: 'Select your product & options on our website → click "Connect on WhatsApp" → your order details are auto-sent to us → we discuss price, timeline, and confirm your order.' },
  { q: 'What sizes are available?', a: 'We stock S, M, L, XL, XXL. Custom sizes may be available on request — just ask us on WhatsApp.' },
  { q: 'Do you ship across India?', a: 'Yes! We ship pan-India. Shipping charges and timelines vary by location and will be confirmed on WhatsApp before you confirm the order.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="page-wrapper" style={{ paddingTop: 90, paddingBottom: 80 }}>
      <div style={{ padding: '60px 5vw 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>?</div>
        <h1 className="font-heading" style={{ color: 'var(--gold-light)', textShadow: '0 0 30px rgba(201,168,76,0.4)', marginBottom: 12 }}>
          FREQUENTLY ASKED
        </h1>
        <div className="section-divider" />
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 5vw' }}>
        {FAQS.map((item, i) => (
          <div key={i} className="glass-card" style={{ marginBottom: 12, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.4 }}>{item.q}</span>
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem', flexShrink: 0, transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </div>
            {open === i && (
              <div style={{ padding: '0 22px 18px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, borderTop: '1px solid var(--border-glass)', paddingTop: 14 }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
