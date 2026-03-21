import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { urlToBase64, fileToBase64 } from '../utils/imageUtils';
import { ConsolaId } from '../../../shared/consoles';

export interface PeritajeResponse {
  veredicto_final: 'ORIGINAL' | 'REPRODUCCION' | 'DUDOSO';
  confianza_analisis: number;
  analisis_por_seccion: Record<string, { hallazgos: string; estado: string }>;
  tasacion_estimada_estado: number;
  comentario_socio: string;
}

export interface PeritajePayload {
  consolaId: ConsolaId;
  imagenesBase64: string[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  status: 'initializing' | 'scanning' | 'analyzing' | 'completed' | 'error';
}

export type AnalysisStatus = 'initializing' | 'scanning' | 'analyzing' | 'idle';

export const SCANNING_MESSAGES = [
  'Analizando tipografía ESRB...',
  "Buscando punto de la 'i' en Nintendo...",
  'Verificando color de PCB (Pines)...',
  'Escaneando sellos de calidad...',
  'Sincronizando con base de datos N64...',
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const validateForensics = async (
  consolaId: ConsolaId,
  imagenesBase64: string[]
): Promise<PeritajeResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      consolaId,
      imagenesBase64,
    }),
  });

  if (!response.ok) {
    throw new Error('El motor de peritaje falló en la verificación.');
  }

  return response.json();
};

export const usePeritaje = () => {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [currentMessage, setCurrentMessage] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, status: LogEntry['status']) => {
    setLogs((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        message,
        status,
      },
    ]);
  }, []);

  const mutation = useMutation({
    mutationFn: async ({ consolaId, files }: { consolaId: ConsolaId, files: (File | string)[] }) => {
      setAnalysisStatus('initializing');
      setLogs([]);
      
      const startTime = Date.now();
      const delayMs = 4000;

      addLog('Preparando imágenes para análisis...', 'initializing');
      setCurrentMessage('Preparando imágenes...');

      const base64Promises = files.map(async (input) => {
        try {
          if (typeof input === 'string') {
            return await urlToBase64(input);
          }
          return await fileToBase64(input);
        } catch (error) {
          console.error('Error converting image:', error);
          return null;
        }
      });

      const base64Images = (await Promise.all(base64Promises)).filter(
        (img): img is string => img !== null
      );

      setAnalysisStatus('scanning');
      addLog(SCANNING_MESSAGES[0], 'scanning');
      setCurrentMessage(SCANNING_MESSAGES[0]);

      const apiPromise = validateForensics(consolaId, base64Images);

      let isScanning = true;
      let messageIndex = 0;

      const rotationInterval = setInterval(() => {
        if (isScanning) {
          messageIndex = (messageIndex + 1) % SCANNING_MESSAGES.length;
          const msg = SCANNING_MESSAGES[messageIndex];
          setCurrentMessage(msg);
          addLog(msg, 'scanning');
        }
      }, 1500);

      try {
        const result = await apiPromise;

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, delayMs - elapsedTime);
        if (remainingTime > 0) {
          await sleep(remainingTime);
        }

        isScanning = false;
        clearInterval(rotationInterval);

        setAnalysisStatus('analyzing');
        const finalMsg = 'Generando reporte técnico final...';
        setCurrentMessage(finalMsg);
        addLog(finalMsg, 'analyzing');

        await sleep(800);

        addLog('Análisis completado con éxito.', 'completed');
        setAnalysisStatus('idle');
        return result;
      } catch (error) {
        isScanning = false;
        clearInterval(rotationInterval);
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
        addLog(errorMsg, 'error');
        setAnalysisStatus('idle');
        throw error;
      }
    },
  });

  const reset = useCallback(() => {
    setAnalysisStatus('idle');
    setCurrentMessage('');
    setLogs([]);
    mutation.reset();
  }, [mutation]);

  return {
    isAnalyzing: mutation.isPending,
    analysisStatus,
    currentMessage,
    results: mutation.data || null,
    logs,
    startAnalysis: mutation.mutate,
    reset,
  };
};
