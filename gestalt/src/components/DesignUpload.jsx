import React, { useRef, useState } from 'react';
import './DesignUpload.css';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/svg+xml', 'application/postscript', 'application/octet-stream'];
const ACCEPT_EXT = '.png,.jpg,.jpeg,.svg,.ai,.psd';

export default function DesignUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    // Preview for image files
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => { setPreview(e.target.result); onUpload?.(e.target.result, f); };
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
      onUpload?.(null, f);
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="design-upload">
      <div className="upload-title">UPLOAD YOUR CUSTOM DESIGN</div>
      <div className="upload-formats">
        <span>✓ PNG (transparent preferred)</span>
        <span>✓ SVG (vector)</span>
        <span>✓ AI / PSD (high-res)</span>
        <span>✓ JPG (min 300 DPI at print size)</span>
      </div>

      <div
        className={`upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {file ? (
          <div className="upload-done">
            {preview
              ? <img src={preview} className="upload-preview" alt="Design preview" />
              : <div className="upload-file-icon">📄</div>
            }
            <div className="upload-file-name">{file.name}</div>
            <div className="upload-change">Click to change</div>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">⬆</div>
            <div className="upload-text">Drag & Drop your design file here</div>
            <button className="btn btn-outline upload-btn" type="button">Browse Files</button>
          </div>
        )}
        <input
          ref={inputRef} type="file"
          accept={ACCEPT_EXT}
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
