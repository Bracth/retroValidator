import React from 'react';
import { getColorByConfidence } from '../../services/forensicService';

interface ConfidenceGaugeProps {
  confidence: number;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ confidence }) => {
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * Math.PI; // Semi-circle
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="confidence-gauge">
      <svg
        height={radius + 10}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius + 10}`}
      >
        {/* Background Arc */}
        <path
          d={`M ${stroke},${radius} A ${normalizedRadius},${normalizedRadius} 0 0 1 ${radius * 2 - stroke},${radius}`}
          fill="none"
          stroke="#333"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <path
          d={`M ${stroke},${radius} A ${normalizedRadius},${normalizedRadius} 0 0 1 ${radius * 2 - stroke},${radius}`}
          fill="none"
          stroke={getColorByConfidence(confidence)}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        {/* Text */}
        <text
          x="50%"
          y={radius - 10}
          textAnchor="middle"
          fill="white"
          fontSize="28px"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {confidence}%
        </text>
      </svg>
      <div className="gauge-label">CONFIDENCE SCORE</div>
    </div>
  );
};
