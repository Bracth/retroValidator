import { useMutation } from '@tanstack/react-query';
import { fileToBase64 } from '../utils/imageUtils';

interface PeritajePayload {
    consolaId: string;
    archivos: File[];
}

export const usePeritaje = () => {
    return useMutation({
        mutationFn: async ({ consolaId, archivos }: PeritajePayload) => {
            const base64Images = await Promise.all(archivos.map(fileToBase64));

            const response = await fetch(`${import.meta.env.VITE_API_URL}/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    consolaId,
                    imagenesBase64: base64Images,
                }),
            });

            if (!response.ok) {
                throw new Error('El motor de peritaje falló en la verificación.');
            }

            return response.json();
        },
    });
};