import React from 'react';
import { formatJsonHighlight } from '../../services/forensicService';
import './Dashboard.css';

interface JsonViewerProps {
  json: unknown;
  onClose: () => void;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ json, onClose }) => {
  const highlightedLines = formatJsonHighlight(json);

  return (
    <div className="json-viewer-overlay" onClick={onClose}>
      <div className="json-viewer-content" onClick={(e) => e.stopPropagation()}>
        <header className="json-viewer-header">
          <h3>RAW ANALYSIS DATA // GOD MODE</h3>
          <button className="json-viewer-close" onClick={onClose}>&times;</button>
        </header>
        <div className="json-viewer-body">
          <pre className="json-viewer-pre">
            {highlightedLines.map((line, i) => {
              if (line.isMatch) {
                return (
                  <div key={i} className="json-line">
                    {line.indent}<span className="json-key">"{line.key}"</span>:{line.rest}
                  </div>
                );
              }
              return <div key={i} className="json-line">{line.line}</div>;
            })}
          </pre>
        </div>
      </div>
    </div>
  );
};
