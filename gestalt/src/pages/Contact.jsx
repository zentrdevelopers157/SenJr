import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Contact() {
  const { waNumber } = useApp();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleWhatsApp = () => {
    if (!form.name || !form.message) return;
    const msg = encodeURIComponent(`Hi GESTALT!\n\nName: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: 90, paddingBottom: 80 }}>
      <div style={{ padding: '60px 5vw 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>✉</div>
        <h1 className="font-heading" style={{ color: 'var(--gold-light)', textShadow: '0 0 30px rgba(201,168,76,0.4)', marginBottom: 12 }}>
          CONNECT WITH US
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
          Have a question or want to discuss a custom order? We're always happy to help.
        </p>
        <div className="section-divider" />
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 5vw' }}>
        {sent ? (
          <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✓</div>
            <h2 className="font-heading" style={{ color: 'var(--gold-light)', marginBottom: 12 }}>Message Sent!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>WhatsApp opened with your message. We'll reply soon!</p>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: 36 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: '0.72rem', letter: 'wide', color: 'var(--gold)', display: 'block', marginBottom: 6, letterSpacing: '0.12em' }}>YOUR NAME</label>
                <input className="input-gold" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Enter your name" />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--gold)', display: 'block', marginBottom: 6, letterSpacing: '0.12em' }}>EMAIL</label>
                <input className="input-gold" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--gold)', display: 'block', marginBottom: 6, letterSpacing: '0.12em' }}>MESSAGE</label>
                <textarea className="input-gold" rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us about your custom order idea..." style={{ resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                className="btn btn-whatsapp"
                onClick={handleWhatsApp}
                disabled={!form.name || !form.message}
                style={{ width: '100%' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Send via WhatsApp
              </button>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
                Opens WhatsApp directly · No account required
              </p>
            </div>
          </div>
        )}

        {/* Quick contact */}
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { icon: '📞', label: 'WhatsApp', val: 'Click button above', link: `https://wa.me/${waNumber}` },
            { icon: '⏰', label: 'Response Time', val: 'Within 2-4 hours', link: null },
          ].map(c => (
            <div key={c.label} className="glass-card" style={{ padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{c.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
