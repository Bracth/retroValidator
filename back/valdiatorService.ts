import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import * as fs from "fs";
import { DATABASE_CONSOLAS } from "./consolas";

interface PeritajeResponse {
    veredicto_final: "ORIGINAL" | "REPRODUCCION" | "DUDOSO";
    confianza_analisis: number;
    analisis_por_seccion: Record<string, { hallazgos: string; estado: string }>;
    tasacion_estimada_estado: number;
    comentario_socio: string;
}

import { ConsolaId } from "../shared/consoles";

export class IAValidatorService {
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async validarProducto(consolaId: ConsolaId, imagenesBase64: string[]): Promise<PeritajeResponse | null> {
        const config = DATABASE_CONSOLAS[consolaId];
        if (!config) throw new Error("Consola no soportada actualmente.");

        const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
Eres el núcleo de inteligencia artificial de 'RetroGuard', un perito forense implacable especializado en hardware de ${consolaId}.
Analiza las ${config.fotosRequeridas} imágenes adjuntas en este orden estricto: ${config.ordenImagenes}.

⚖️ REGLA DE ESCEPTICISMO NEUTRAL (ANTI-ALUCINACIONES):
Tu postura es estrictamente neutral. NO asumas que es original, pero TAMPOCO asumas que es falso. Basa tu veredicto ÚNICAMENTE en evidencia visual irrefutable. Si un detalle se ve borroso, TIENES ESTRICTAMENTE PROHIBIDO adivinar. Decláralo "NO VERIFICABLE" y emite un veredicto "INCONCLUSO". Solo evalúa lo que se te pide en las reglas para esta consola específica. NO inventes fotos faltantes.

🛑 REGLA DE RESOLUCIÓN CRÍTICA (ANTI-FALSOS POSITIVOS):
Asume por defecto que el cartucho es una REPRODUCCIÓN de altísima calidad. Para declarar "ORIGINAL CONFIRMADO", debes ver los detalles con nitidez. Si no, devuelve "INCONCLUSO". ¡NO ADIVINES PÍXELES!

⚠️ REGLAS CRÍTICAS (DEALBREAKERS):
- ${config.reglasCriticas.join('\n- ')}

🔍 PUNTOS DE VERIFICACIÓN SECUNDARIOS:
- ${config.puntosVerificacion.join('\n- ')}

Responde EXCLUSIVAMENTE en formato JSON puro con esta estructura exacta:
{
  "verdict_final": "ORIGINAL CONFIRMADO | ALERTA: REPRODUCCIÓN | INCONCLUSO",
  "confidence_index": 99.4,
  "artifact_meta": {
      "region": "Ej: PAL-ESP",
      "prod_id": "Ej: NES-R3-ESP",
      "mfr_date": "UNKNOWN"
  },
  "terminal_logs": [
      "✅ [FRONT_SHELL] Sello de calidad original detectado.",
      "❌ [BACK_SHELL] Tornillería inconsistente con el fabricante.",
      "⚠️ [RESOLUTION] Etiqueta trasera ilegible por compresión."
  ],
  "forensic_summary": "Breve nota técnica sobre el veredicto."
}
`;

        const imageParts: Part[] = imagenesBase64.map(base64String => ({
            inlineData: {
                data: base64String.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ""),
                mimeType: "image/jpeg"
            }
        }));


        try {
            const result = await model.generateContent([prompt, ...imageParts]);
            const text = result.response.text().replace(/```json|```/g, "");
            return JSON.parse(text) as PeritajeResponse;
        } catch (error) {
            console.error("Error en la validación de IA:", error);
            return null;
        }
    }
}