import React from 'react';

export default function Toast({ message, onRetry, onClose }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: '#fff',
        color: '#1c1c1c',
        padding: '1rem 1.5rem',
        borderRadius: 8,
        boxShadow: '0px 0px 10px 0px rgba(102, 102, 102, 0.2)',
        zIndex: 1000,
      }}
    >
      <div>{message}</div>
      <button
        onClick={onRetry}
        style={{
          marginTop: 10,
          background: '#3B82F6',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: 4,
          cursor: 'pointer',
        }}
        aria-label="Повторить запрос"
      >
        Повторить
      </button>
      <button
        onClick={onClose}
        style={{
          marginLeft: 10,
          background: 'transparent',
          color: '#aaa',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
        }}
        aria-label="Закрыть уведомление"
      >
        ×
      </button>
    </div>
  );
}
