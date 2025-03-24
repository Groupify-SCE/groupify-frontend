import React from 'react';

const ConfirmDeletion = ({ onConfirm, onCancel }) => {
  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
        Are you sure you want to delete this project?
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          onClick={onConfirm}
          style={{
            backgroundColor: '#8c5ff2',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: '#ccc',
            color: '#333',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeletion;
