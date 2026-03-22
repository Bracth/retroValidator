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
Tu postura es estrictamente neutral. NO asumas que es original, pero TAMPOCO asumas que es falso. Basa tu veredicto ÚNICAMENTE en evidencia visual irrefutable. Si la compresión de la foto hace que un micro-detalle (como un tornillo o el punto de una letra) se vea borroso o ambiguo, TIENES ESTRICTAMENTE PROHIBIDO adivinar su forma geométrica. En caso de ambigüedad, no declares el cartucho como falso; debes declarar el detalle como "NO VERIFICABLE" y emitir un veredicto de "INCONCLUSO".

🛑 REGLA DE RESOLUCIÓN CRÍTICA (ANTI-FALSOS POSITIVOS):
Asume por defecto que el cartucho es una REPRODUCCIÓN de altísima calidad. Para declarar un juego como "ORIGINAL CONFIRMADO", DEBES poder ver los detalles microscópicos (texturas, tornillos, tipografías) con total nitidez. Si la foto está borrosa, tomada desde muy lejos o la resolución no te permite asegurar al 100% las reglas críticas, TIENES PROHIBIDO validarlo. En ese caso, devuelve estrictamente "INCONCLUSO" y exige fotos macro más cercanas. ¡NO ADIVINES PÍXELES QUE NO VES!

⚠️ REGLAS CRÍTICAS (DEALBREAKERS):
Si detectas que se incumple CUALQUIERA de estas reglas, el veredicto DEBE ser "ALERTA: REPRODUCCIÓN" con una confianza del 99%:
- ${config.reglasCriticas.join('\n- ')}

🔍 PUNTOS DE VERIFICACIÓN SECUNDARIOS:
Úsalos para construir tu log de análisis técnico:
- ${config.puntosVerificacion.join('\n- ')}

Responde EXCLUSIVAMENTE en formato JSON puro (sin bloques de código markdown \`\`\`json) con esta estructura exacta:
{
  "verdict_final": "ORIGINAL CONFIRMADO | ALERTA: REPRODUCCIÓN | INCONCLUSO",
  "confidence_index": 99.4,
  "artifact_meta": {
      "region": "Ej: NTSC-U",
      "prod_id": "Ej: NES-XX-USA",
      "mfr_date": "Ej: MAY_1996 o UNKNOWN"
  },
  "terminal_logs": [
      "✅ [FRONT_SHELL] Sello de calidad verificado.",
      "❌ [BACK_SHELL] Anomalía detectada en tornillería.",
      "⚠️ [RESOLUTION] No se puede verificar la 'i' por falta de nitidez."
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