import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  const alertClasses = {
    success: 'alert alert-success',
    warning: 'alert alert-warning',
    error: 'alert alert-error',
    info: 'alert alert-info'
  };

  return (
    <div className={alertClasses[type]}>
      <p>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="alert-close"
          aria-label="Cerrar"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;