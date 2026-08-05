import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

export default function CustomDropdown({ options = [], value, onChange, placeholder = 'Seleccionar', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  const selectedLabel = (options.find((o) => o.value === value) || {}).label || '';

  return (
    <div className={`custom-dropdown ${className}`} ref={ref}>
      <button type="button" className="cd-btn" onClick={() => setOpen((s) => !s)}>
        <span className={`cd-label ${!selectedLabel ? 'placeholder' : ''}`}>{selectedLabel || placeholder}</span>
        <span className="cd-caret">▾</span>
      </button>

      {open && (
        <div className="cd-list">
          {options.map((opt) => (
            <button type="button" key={opt.value} className="cd-item" onClick={() => handleSelect(opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
