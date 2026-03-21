import React, { useState, useEffect, useCallback } from 'react';
import { ImageDropzone } from './ImageDropzone';
import { ForensicScanner } from './ForensicScanner';
import { ConfidenceGauge } from './ConfidenceGauge';
import { TechnicalLog } from './TechnicalLog';
import { JsonViewer } from './JsonViewer';
import { runForensicAnalysis } from '../../services/forensicService';
import { PeritajeResponse } from '../../hooks/usePeritaje';
import { demoCases } from '../../utils/demoData';
import type { DemoCase } from '../../utils/demoData';
import './Dashboard.css';

type DashboardState = 'READY' | 'ANALYZING' | 'RESULTS';

export const ForensicDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>('READY');
  const [images, setImages] = useState<{
    front?: string;
    back?: string;
    pins?: string;
  }>({});
  const [analysisResult, setAnalysisResult] = useState<PeritajeResponse | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [scannerMessage, setScannerMessage] = useState("");

  const hasAnyImage = !!(images.front || images.back || images.pins);
  const hasAllImages = !!(images.front && images.back && images.pins);

  const handleStartAnalysis = useCallback(async () => {
    setState('ANALYZING');
    
    try {
      const filteredImages = [images.front, images.back, images.pins].filter((img): img is string => !!img);

      const result = await runForensicAnalysis(filteredImages, (msg) => setScannerMessage(msg));

      setAnalysisResult(result);
      setState('RESULTS');

    } catch (error) {
      console.error('Analysis failed:', error);
      setState('READY');
    }
  }, [images]);

  useEffect(() => {
    if (state === 'READY' && hasAllImages) {
      const timer = setTimeout(() => {
        handleStartAnalysis();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state, hasAllImages, handleStartAnalysis]);

  const handleManualAnalyze = () => {
    if (!hasAllImages) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
    handleStartAnalysis();
  };

  const handleUpload = (type: 'front' | 'back' | 'pins') => (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImages((prev) => ({ ...prev, [type]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const loadDemo = (demoCase: DemoCase) => {
    setImages({
      front: demoCase.front,
      back: demoCase.back,
      pins: demoCase.pins,
    });
  };

  const clearScanner = () => {
    setImages({});
    setState('READY');
    setAnalysisResult(null);
  };

  const getStatus = (type: 'front' | 'back' | 'pins') => {
    if (state === 'ANALYZING') return 'pending';
    if (state === 'RESULTS' && analysisResult) {
      return analysisResult.veredicto_final === 'ORIGINAL' ? 'success' : 'fail';
    }
    return images[type] ? 'success' : 'idle';
  };

  return (
    <div className="forensic-dashboard">
      <header className="dashboard-header">
        <h1>RetroValidator // Forensic Analysis Unit</h1>
        <div className="status-indicator">SYSTEM STATE: {state}</div>
      </header>

      <main className="image-grid">
        <ImageDropzone
          label="Front Cover"
          imageUrl={images.front}
          onUpload={handleUpload('front')}
          status={getStatus('front')}
        />
        <ImageDropzone
          label="Back Cover"
          imageUrl={images.back}
          onUpload={handleUpload('back')}
          status={getStatus('back')}
        />
        <ImageDropzone
          label="PCB Pins"
          imageUrl={images.pins}
          onUpload={handleUpload('pins')}
          status={getStatus('pins')}
        />
        {state === 'ANALYZING' && <ForensicScanner message={scannerMessage} />}
      </main>

      {state === 'READY' && (
        <div className="manual-trigger">
          <button 
            className="btn-analyze" 
            onClick={handleManualAnalyze}
            disabled={!hasAnyImage}
          >
            ANALYZE NOW
          </button>
          {showWarning && (
            <div className="soft-warning">
              Warning: Partial data. For best results, upload all 3 views.
            </div>
          )}
        </div>
      )}

      <section className="demo-controls">
        <button 
          className="btn-demo" 
          onClick={() => loadDemo(demoCases.MK64_ORIGINAL)}
          disabled={state === 'ANALYZING'}
        >
          LOAD DEMO: MK64
        </button>
        <button 
          className="btn-demo" 
          onClick={() => loadDemo(demoCases.MK64_REPRO)}
          disabled={state === 'ANALYZING'}
        >
          LOAD DEMO: PKMN_FAKE
        </button>
        <button 
          className="btn-demo" 
          onClick={clearScanner}
          disabled={state === 'ANALYZING'}
        >
          CLEAR SCANNER
        </button>
      </section>

      {state === 'RESULTS' && analysisResult && (
        <div className="results-container">
          <button 
            className="btn-god-mode" 
            onClick={() => setIsJsonModalOpen(true)}
          >
            {'{ }'} VER JSON ORIGINAL
          </button>

          <div className={`verdict-banner verdict-${analysisResult.veredicto_final.toLowerCase()}`}>
            VERDICT: {analysisResult.veredicto_final}
          </div>
          
          <div className="results-grid">
            <ConfidenceGauge confidence={analysisResult.confianza_analisis} />
            <TechnicalLog sections={analysisResult.analisis_por_seccion} />
          </div>

          <div className="final-word">
            <h3>FINAL WORD // COMENTARIO SOCIO</h3>
            <p>{analysisResult.comentario_socio}</p>
          </div>

          <button className="btn-demo" onClick={clearScanner}>NEW ANALYSIS</button>
        </div>
      )}

      {isJsonModalOpen && analysisResult && (
        <JsonViewer 
          json={analysisResult} 
          onClose={() => setIsJsonModalOpen(false)} 
        />
      )}
    </div>
  );
};
