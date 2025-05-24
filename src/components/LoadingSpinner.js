import React from 'react';
import '../styles/LoadingSpinner.style.css';

const LoadingSpinner = ({ fullPage, text = 'Loading...' }) => {
  return (
    <div className={`loading-container ${fullPage ? 'loading-fullpage' : ''}`}>
      <div className="loading-content">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        {text && <div className="loading-text">{text}</div>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
