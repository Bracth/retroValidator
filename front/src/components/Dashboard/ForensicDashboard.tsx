import React, { useState, useCallback, useMemo } from 'react';
import { Dashboard } from './Dashboard';
import { usePeritaje } from '../../hooks/usePeritaje';
import { demoCases } from '../../utils/demoData';
import type { DemoCase } from '../../utils/demoData';
import { JsonViewer } from './JsonViewer';
import { ConsolaId } from '../../../../shared/consoles';

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

  const [selectedConsole, setSelectedConsole] = useState<ConsolaId>(ConsolaId.N64);
  const [images, setImages] = useState<{
    front?: string;
    back?: string;
    pins?: string;
  }>({});
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<'front' | 'back' | 'pins' | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const hasAllImages = useMemo(() => {
    if (selectedConsole === ConsolaId.NES) {
      return !!(images.front && images.back);
    }
    return !!(images.front && images.back && images.pins);
  }, [images, selectedConsole]);

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
    const imageList = selectedConsole === ConsolaId.NES
      ? [images.front, images.back].filter((img): img is string => !!img)
      : [images.front, images.back, images.pins].filter((img): img is string => !!img);
    
    if (imageList.length > 0) {
      startAnalysis({ consolaId: selectedConsole, files: imageList });
    }
  }, [images, selectedConsole, startAnalysis]);

  const loadDemo = (demoCase: DemoCase) => {
    setSelectedConsole(demoCase.consolaId);
    setImages({
      front: demoCase.front,
      back: demoCase.back,
      pins: demoCase.pins,
    });

    const imageList = demoCase.consolaId === ConsolaId.NES
      ? [demoCase.front, demoCase.back]
      : [demoCase.front, demoCase.back, demoCase.pins as string];

    startAnalysis({ consolaId: demoCase.consolaId, files: imageList });
  };

  const clearScanner = () => {
    setImages({});
    reset();
  };

  const transformedLogs = useMemo(() => {
    return logs.map((log) => ({
      timestamp: log.timestamp,
      message: log.message,
      type: ((): 'success' | 'info' | 'error' | 'primary' | 'warning' => {
        switch (log.status) {
          case 'initializing': return 'info';
          case 'scanning': return 'primary';
          case 'analyzing': return 'primary';
          case 'completed': return 'success';
          case 'success': return 'success';
          case 'warning': return 'warning';
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
    { label: 'Consola', value: selectedConsole === ConsolaId.N64 ? 'Nintendo 64' : selectedConsole === ConsolaId.NES ? 'NES' : 'GameBoy' },
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
        <div className="flex items-center gap-4 mr-6 px-4 border-r border-outline-variant/20">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Console:</span>
          <div className="flex gap-2">
            {[ConsolaId.N64, ConsolaId.GAMEBOY, ConsolaId.NES].map((id) => (
              <button
                key={id}
                onClick={() => setSelectedConsole(id)}
                className={`px-3 py-1 text-[10px] font-mono border transition-all ${
                  selectedConsole === id
                    ? 'bg-primary text-black border-primary'
                    : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        <Dashboard.ActionButton
          label="Start Analysis"
          onClick={handleStartAnalysis}
          active={hasAllImages && !isAnalyzing}
        />
        <Dashboard.ActionButton
          label="N64 Orig"
          onClick={() => loadDemo(demoCases.MK64_ORIGINAL)}
        />
        <Dashboard.ActionButton
          label="N64 Repro"
          onClick={() => loadDemo(demoCases.MK64_REPRO)}
        />
        <Dashboard.ActionButton
          label="NES Orig"
          onClick={() => loadDemo(demoCases.NES_ORIGINAL)}
        />
        <Dashboard.ActionButton
          label="NES Repro"
          onClick={() => loadDemo(demoCases.NES_REPRO)}
        />
        <Dashboard.ActionButton
          label="Limpiar"
          onClick={clearScanner}
        />
      </Dashboard.Actions>

      <Dashboard.Section>
        <Dashboard.Grid className={selectedConsole === ConsolaId.NES ? 'md:grid-cols-2 max-w-4xl mx-auto' : ''}>
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
          {selectedConsole !== ConsolaId.NES && (
            <Dashboard.Slot
              label="PCB Pins"
              image={images.pins}
              isScanning={analysisStatus === 'scanning'}
              onClick={() => handleUploadClick('pins')}
            />
          )}
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
