import React, { useState } from 'react';
import './Configurator.css';

export default function Configurator({ product, onComplete }) {
  const [selections, setSelections] = useState({
    size: '', fabric: '', color: '', printType: ''
  });

  const set = (key, val) => {
    const next = { ...selections, [key]: val };
    setSelections(next);
    const done = Object.values(next).every(v => v);
    onComplete?.(done ? next : null);
  };

  const opts = (key, list) => (
    <div className="config-field">
      <label className="config-label">{key.toUpperCase()}</label>
      <div className="config-options">
        {list.map(item => (
          <button
            key={item}
            className={`config-opt ${selections[key] === item ? 'selected' : ''}`}
            onClick={() => set(key, item)}
          >{item}</button>
        ))}
      </div>
    </div>
  );

  const sizes   = product?.sizes   || ['S', 'M', 'L', 'XL', 'XXL'];
  const fabrics = product?.fabrics  || ['Luxury Fleece', 'Ultra-Soft Poly-Blend', 'Heavyweight Cotton'];
  const colors  = product?.colors   || ['Obsidian Black', 'Platinum White', 'Midnight Navy', 'Midnight Navy', 'Ember Red'];
  const prints  = product?.prints   || ['Puff Print', '3D Gel Print', 'Shiny Metallic', 'Classic Screen', 'DTG'];

  return (
    <div className="configurator">
      {opts('size', sizes)}
      {opts('fabric', fabrics)}
      {opts('color', colors)}
      {opts('printType', prints)}
    </div>
  );
}
