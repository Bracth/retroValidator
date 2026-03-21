import { validateForensics, SCANNING_MESSAGES } from '../hooks/usePeritaje';
import type { PeritajeResponse } from '../hooks/usePeritaje';
import { urlToBase64, fileToBase64 } from '../utils/imageUtils';
import { ConsolaId } from '../../../shared/consoles';

export const getColorByConfidence = (val: number): string => {
  if (val <= 40) return '#ff4d4d'; // Red
  if (val <= 70) return '#ffcc00'; // Yellow
  return '#00ff00'; // Green
};

export interface JsonLineHighlight {
  indent?: string;
  key?: string;
  rest?: string;
  line?: string;
  isMatch: boolean;
}

export const formatJsonHighlight = (json: unknown): JsonLineHighlight[] => {
  return JSON.stringify(json, null, 2).split('\n').map((line) => {
    const keyMatch = line.match(/^(\s*)"([^"]+)":/);
    if (keyMatch) {
      const indent = keyMatch[1];
      const key = keyMatch[2];
      const rest = line.slice(keyMatch[0].length);
      return { indent, key, rest, isMatch: true };
    }
    return { line, isMatch: false };
  });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const runForensicAnalysis = async (
  inputs: (File | string)[],
  onProgress: (msg: string, status: "initializing" | "scanning" | "analyzing") => void,
  delayMs: number = 4000
): Promise<PeritajeResponse> => {
  const startTime = Date.now();

  // a. Status: "initializing"
  onProgress("Preparando imágenes para análisis...", "initializing");

  // b. Convert all inputs to base64
  const base64Promises = inputs.map(async (input) => {
    try {
      if (typeof input === 'string') {
        return await urlToBase64(input);
      }
      return await fileToBase64(input);
    } catch (error) {
      console.error("Error converting image:", error);
      return null;
    }
  });

  const base64Images = (await Promise.all(base64Promises)).filter((img): img is string => img !== null);

  // c. Status: "scanning"
  onProgress(SCANNING_MESSAGES[0], "scanning");

  // d. Start the 'validateForensics' API call in the background
  const apiPromise = validateForensics(ConsolaId.N64, base64Images);

  // e. Rotate through 'SCANNING_MESSAGES' every 1500ms while waiting for the API call and the 'delayMs' timer.
  let isScanning = true;
  let messageIndex = 0;

  const rotationPromise = (async () => {
    while (isScanning) {
      await sleep(1500);
      if (!isScanning) break;
      messageIndex = (messageIndex + 1) % SCANNING_MESSAGES.length;
      onProgress(SCANNING_MESSAGES[messageIndex], "scanning");
    }
  })();

  try {
    const result = await apiPromise;

    // g. Ensure at least 'delayMs' has elapsed since the start.
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, delayMs - elapsedTime);
    if (remainingTime > 0) {
      await sleep(remainingTime);
    }

    isScanning = false;
    await rotationPromise;

    // f. Status: "analyzing" (just before completion).
    onProgress("Generando reporte técnico final...", "analyzing");
    await sleep(800); // Brief pause to show the final state

    return result;
  } catch (error) {
    isScanning = false;
    throw error;
  }
};
