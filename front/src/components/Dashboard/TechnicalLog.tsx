import React, { useEffect, useRef } from 'react';

interface AnalysisSection {
  hallazgos: string;
  estado: string;
}

interface TechnicalLogProps {
  sections: Record<string, AnalysisSection>;
}

export const TechnicalLog: React.FC<TechnicalLogProps> = ({ sections }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sections]);

  return (
    <div className="technical-log">
      <div className="log-header">TERMINAL_OUTPUT // ANALYSIS_LOG</div>
      <div className="log-content">
        {Object.entries(sections).map(([section, data], index) => (
          <div key={index} className="log-entry">
            <span className="log-section">[{section.toUpperCase()}]</span>
            <span className={`log-status status-${data.estado?.toLowerCase()}`}>
              [{data.estado?.toUpperCase()}]
            </span>
            <span className="log-findings">: {data.hallazgos}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
