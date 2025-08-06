// src/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, onSave, content }) => {
  if (!isOpen) return null;

  const handleSave = () => {
    const newContent = document.getElementById('modal-input').value;
    onSave(newContent);
    onClose();
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2>Edit File</h2>
        <textarea
          id="modal-input"
          defaultValue={content}
          style={textareaStyle}
        />
        <div style={buttonContainerStyle}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  width: '80%',
  maxWidth: '600px',
};

const textareaStyle = {
  width: '100%',
  height: '200px',
  marginBottom: '10px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

export default Modal;
