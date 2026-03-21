import React from 'react';
import './Dashboard.css';

interface ForensicScannerProps {
  message: string;
}

export const ForensicScanner: React.FC<ForensicScannerProps> = ({ message }) => {
  return (
    <div className="forensic-scanner-overlay">
      <div className="scanner-container">
        <svg className="scanner-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100" y2="0" className="scanner-line">
            <animate 
              attributeName="y1" 
              values="0;100;0" 
              dur="4s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="y2" 
              values="0;100;0" 
              dur="4s" 
              repeatCount="indefinite" 
            />
          </line>
        </svg>
        <div className="scanner-glass" />
      </div>
      <div className="scanner-info">
        <div className="scanner-loader" />
        <p className="scanner-text">{message}</p>
      </div>
    </div>
  );
};
