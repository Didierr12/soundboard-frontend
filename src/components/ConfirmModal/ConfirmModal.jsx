import React from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ open, title, message, confirmText = 'Aceptar', cancelText = 'Cancelar', onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="cm-overlay">
      <div className="cm-dialog">
        <div className="cm-icon">!</div>
        <div className="cm-content">
          {title ? <h3 className="cm-title">{title}</h3> : null}
          <p className="cm-message">{message}</p>
          <div className="cm-actions">
            <button className="cm-btn cm-cancel" onClick={onCancel}>{cancelText}</button>
            <button className="cm-btn cm-confirm" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
