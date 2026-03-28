import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Configurator from '../components/Configurator';
import DesignUpload from '../components/DesignUpload';
import WhatsAppButton from '../components/WhatsAppButton';
import './CustomizePage.css';

export default function CustomizePage() {
  const { waNumber, addLead } = useApp();
  const [apparel, setApparel] = useState('');
  const [config, setConfig] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreview, setUploadedPreview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const allDone = apparel && config && uploadedFile && confirmed;

  const waMessage = allDone ? `Hi GESTALT! I have a CUSTOM DESIGN order:

━━━━━━━━━━━━━━━━━━━━
✦ ORDER TYPE: Custom Design Upload
👕 Apparel: ${apparel}
📏 Size: ${config.size}
🧵 Fabric: ${config.fabric}
🎨 Color: ${config.color}
✨ Print Type: ${config.printType}
📎 Design File: ${uploadedFile.name} (${(uploadedFile.size/1024).toFixed(0)} KB)
🔢 Quantity: 1 piece
━━━━━━━━━━━━━━━━━━━━

My design file is attached. Please confirm receipt and share the price & delivery timeline. Thank you!` : '';

  const handleUpload = (preview, file) => {
    setUploadedPreview(preview);
    setUploadedFile(file);
    if (file) {
      // Save to localStorage for admin review
      const designs = JSON.parse(localStorage.getItem('gestalt_designs') || '[]');
      designs.unshift({ id: `D${Date.now()}`, name: file.name, size: file.size, preview, createdAt: new Date().toISOString(), status: 'pending' });
      localStorage.setItem('gestalt_designs', JSON.stringify(designs));
    }
  };

  const handleWhatsApp = () => {
    addLead({ productName: apparel, designFile: uploadedFile?.name, ...config, type: 'custom' });
  };

  const APPAREL = [
    { id: 'Hoodie',   icon: '🧥' },
    { id: 'T-Shirt',  icon: '👕' },
    { id: 'Trouser',  icon: '👖' },
  ];

  return (
    <div className="page-wrapper customize-page" style={{ paddingTop: 90 }}>
      <div className="section-header" style={{ padding: '40px 5vw 0', textAlign: 'center' }}>
        <h1 className="font-heading" style={{ color: 'var(--gold-light)', textShadow: '0 0 30px rgba(201,168,76,0.4)' }}>
          DESIGN YOUR OWN
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '12px auto 0' }}>
          Upload your artwork and we'll print it on premium custom apparel. Single piece welcome.
        </p>
        <div className="section-divider" />
      </div>

      <div className="customize-grid" style={{ padding: '0 5vw 80px' }}>
        {/* LEFT column */}
        <div className="customize-left">
          {/* Step 1: Choose apparel */}
          <div className="customize-step glass-card">
            <div className="step-label">STEP 1 — CHOOSE APPAREL</div>
            <div className="apparel-grid">
              {APPAREL.map(a => (
                <button key={a.id} className={`apparel-btn ${apparel === a.id ? 'selected' : ''}`}
                  onClick={() => setApparel(a.id)}>
                  <span style={{ fontSize: '2.2rem' }}>{a.icon}</span>
                  <span>{a.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Upload design */}
          <div className="customize-step glass-card">
            <div className="step-label">STEP 2 — UPLOAD YOUR DESIGN</div>
            <DesignUpload onUpload={handleUpload} />
          </div>

          {/* Mockup preview */}
          {uploadedPreview && apparel && (
            <div className="mockup-preview glass-card">
              <div className="step-label">DESIGN PREVIEW</div>
              <div className="mockup-wrap">
                <div className="mockup-apparel">
                  {apparel === 'Hoodie' ? '🧥' : apparel === 'T-Shirt' ? '👕' : '👖'}
                </div>
                <img src={uploadedPreview} className="mockup-design" alt="Your design" />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', marginTop: 8 }}>
                Approximate placement preview only
              </p>
            </div>
          )}
        </div>

        {/* RIGHT column */}
        <div className="customize-right">
          {/* Step 3: Configure */}
          <div className="customize-step glass-card">
            <div className="step-label">STEP 3 — CONFIGURE DETAILS</div>
            <Configurator onComplete={setConfig} />
          </div>

          {/* Step 4: Confirm + WhatsApp */}
          <div className="customize-step glass-card">
            <div className="step-label">STEP 4 — CONFIRM & SEND</div>

            <div className="checklist">
              {[
                { ok: !!apparel, label: 'Apparel selected' },
                { ok: !!uploadedFile, label: 'Design uploaded' },
                { ok: !!config, label: 'All options configured' },
              ].map(item => (
                <div key={item.label} className={`checklist-item ${item.ok ? 'done' : ''}`}>
                  <span>{item.ok ? '✓' : '○'}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <label className={`confirm-checkbox ${(!apparel || !uploadedFile || !config) ? 'disabled' : ''}`}>
              <input
                type="checkbox"
                checked={confirmed}
                disabled={!apparel || !uploadedFile || !config}
                onChange={e => setConfirmed(e.target.checked)}
              />
              <span>I confirm my custom design is ready and I agree to proceed</span>
            </label>

            <div className={`wa-status ${allDone ? 'wa-status-ready' : ''}`} style={{ marginTop: 16 }}>
              {allDone ? '✓ Ready to connect on WhatsApp!' : '⚠ Complete all steps above first'}
            </div>

            <WhatsAppButton
              message={waMessage}
              disabled={!allDone}
              whatsappNumber={waNumber}
              label="Send Custom Order on WhatsApp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
