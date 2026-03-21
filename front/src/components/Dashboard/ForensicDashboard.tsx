import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dashboard } from './Dashboard';
import { usePeritaje } from '../../hooks/usePeritaje';
import { demoCases } from '../../utils/demoData';
import type { DemoCase } from '../../utils/demoData';
import { JsonViewer } from './JsonViewer';

export const ForensicDashboard: React.FC = () => {
  const {
    isAnalyzing,
    analysisStatus,
    currentMessage,
    results,
    logs,
    startAnalysis,
    reset,
  } = usePeritaje();

  const [images, setImages] = useState<{
    front?: string;
    back?: string;
    pins?: string;
  }>({});
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<'front' | 'back' | 'pins' | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const hasAllImages = useMemo(() => !!(images.front && images.back && images.pins), [images]);

  const handleUploadClick = (type: 'front' | 'back' | 'pins') => {
    setCurrentUploadType(type);
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUploadType) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => ({ ...prev, [currentUploadType]: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value so the same file can be selected again
    if (e.target) e.target.value = '';
  };

  const handleStartAnalysis = useCallback(() => {
    const imageList = [images.front, images.back, images.pins].filter((img): img is string => !!img);
    if (imageList.length > 0) {
      startAnalysis(imageList);
    }
  }, [images, startAnalysis]);

  useEffect(() => {
    if (!isAnalyzing && !results && hasAllImages) {
      const timer = setTimeout(() => {
        handleStartAnalysis();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, results, hasAllImages, handleStartAnalysis]);

  const loadDemo = (demoCase: DemoCase) => {
    setImages({
      front: demoCase.front,
      back: demoCase.back,
      pins: demoCase.pins,
    });
  };

  const clearScanner = () => {
    setImages({});
    reset();
  };

  const transformedLogs = useMemo(() => {
    return logs.map((log) => ({
      timestamp: log.timestamp,
      message: log.message,
      type: ((): 'success' | 'info' | 'error' | 'primary' => {
        switch (log.status) {
          case 'initializing': return 'info';
          case 'scanning': return 'primary';
          case 'analyzing': return 'primary';
          case 'completed': return 'success';
          case 'error': return 'error';
          default: return 'info';
        }
      })(),
    }));
  }, [logs]);

  const verdictMetadata = [
    { label: 'Region', value: 'NTSC-U' },
    { label: 'ID', value: 'NUS-NSME-USA' },
    { label: 'Release', value: '1996' },
    { label: 'Consola', value: 'Nintendo 64' },
  ];

  return (
    <Dashboard>
      <Dashboard.Header
        title="Forensic Unit"
        subtitle="Advanced Cartridge Verification System"
        statusLabel={isAnalyzing ? `SYSTEM_BUSY: ${analysisStatus.toUpperCase()}` : 'SYSTEM_READY'}
        statusActive={isAnalyzing}
      />

      <Dashboard.Actions>
        <Dashboard.ActionButton
          label="Start Analysis"
          onClick={handleStartAnalysis}
          active={hasAllImages && !isAnalyzing}
        />
        <Dashboard.ActionButton
          label="Demo: N64 Original"
          onClick={() => loadDemo(demoCases.MK64_ORIGINAL)}
        />
        <Dashboard.ActionButton
          label="Demo: N64 Repro"
          onClick={() => loadDemo(demoCases.MK64_REPRO)}
        />
        <Dashboard.ActionButton
          label="Limpiar"
          onClick={clearScanner}
        />
      </Dashboard.Actions>

      <Dashboard.Section>
        <Dashboard.Grid>
          <Dashboard.Slot
            label="Front Cover"
            image={images.front}
            isScanning={analysisStatus === 'scanning'}
            onClick={() => handleUploadClick('front')}
          />
          <Dashboard.Slot
            label="Back Cover"
            image={images.back}
            isScanning={analysisStatus === 'scanning'}
            onClick={() => handleUploadClick('back')}
          />
          <Dashboard.Slot
            label="PCB Pins"
            image={images.pins}
            isScanning={analysisStatus === 'scanning'}
            onClick={() => handleUploadClick('pins')}
          />
        </Dashboard.Grid>

        <Dashboard.StatusBar
          status={isAnalyzing ? currentMessage : (results ? 'Analysis Complete' : 'Waiting for input...')}
          metadata={isAnalyzing ? 'SEGMENTATION_PASS: 04/12' : (results ? 'REPORT_GENERATED' : 'IDLE')}
          isScanning={isAnalyzing}
        />
      </Dashboard.Section>

      {results && (
        <Dashboard.Section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Dashboard.Verdict
            verdict={results.veredicto_final}
            description={results.veredicto_final === 'ORIGINAL' 
              ? 'The cartridge exhibits all characteristics of an authentic production unit. All security markers and manufacturing patterns match the reference database.'
              : 'Significant discrepancies found in manufacturing patterns and security markers. The unit does not match authentic production standards.'
            }
            confidence={results.confianza_analisis}
            metadata={verdictMetadata}
            analystComment={results.comentario_socio}
            isAuthentic={results.veredicto_final === 'ORIGINAL'}
          />
          <Dashboard.Log
            entries={transformedLogs}
            onViewJson={() => setIsJsonModalOpen(true)}
          />
        </Dashboard.Section>
      )}

      {isJsonModalOpen && results && (
        <JsonViewer
          json={results}
          onClose={() => setIsJsonModalOpen(false)}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </Dashboard>
  );
};
