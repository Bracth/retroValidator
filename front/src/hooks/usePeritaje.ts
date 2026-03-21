import { useMutation } from '@tanstack/react-query';

export interface PeritajeResponse {
  veredicto_final: 'ORIGINAL' | 'REPRODUCCION' | 'DUDOSO';
  confianza_analisis: number;
  analisis_por_seccion: Record<string, { hallazgos: string; estado: string }>;
  tasacion_estimada_estado: number;
  comentario_socio: string;
}

export interface PeritajePayload {
    consolaId: string;
    imagenesBase64: string[];
}

export const validateForensics = async (consolaId: string, imagenesBase64: string[]): Promise<PeritajeResponse> => {
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
    return useMutation({
        mutationFn: ({ consolaId, imagenesBase64 }: PeritajePayload) => 
            validateForensics(consolaId, imagenesBase64),
    });
};
