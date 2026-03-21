import React from 'react';
import { formatJsonHighlight } from '../../services/forensicService';

interface JsonViewerProps {
  json: unknown;
  onClose: () => void;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ json, onClose }) => {
  const highlightedLines = formatJsonHighlight(json);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" 
      onClick={onClose}
    >
      <div 
        className="bg-surface-container-low border border-outline-variant/30 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300" 
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high">
          <h3 className="font-headline font-bold text-primary tracking-tight uppercase">RAW ANALYSIS DATA // GOD MODE</h3>
          <button 
            className="text-zinc-500 hover:text-on-surface text-3xl leading-none transition-colors" 
            onClick={onClose}
          >
            &times;
          </button>
        </header>
        <div className="flex-1 overflow-auto p-6 font-mono text-xs md:text-sm bg-surface-container-lowest">
          <pre className="selection:bg-primary/20">
            {highlightedLines.map((line, i) => {
              if (line.isMatch) {
                return (
                  <div key={i} className="py-0.5">
                    <span className="text-zinc-600">{line.indent}</span>
                    <span className="text-primary font-bold">"{line.key}"</span>
                    <span className="text-zinc-400">:</span>
                    <span className="text-secondary">{line.rest}</span>
                  </div>
                );
              }
              return <div key={i} className="py-0.5 text-zinc-400">{line.line}</div>;
            })}
          </pre>
        </div>
        <footer className="p-4 border-t border-outline-variant/10 bg-surface-container-low flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-surface-container-high hover:bg-surface-variant text-[11px] font-bold uppercase tracking-widest text-on-surface border border-outline-variant/30 transition-all"
          >
            Close Terminal
          </button>
        </footer>
      </div>
    </div>
  );
};
