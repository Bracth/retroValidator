import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import * as fs from "fs";
import { DATABASE_CONSOLAS } from "./consolas";

// Definimos la interfaz de la respuesta para tener Autocompletado (IntelliSense)
interface PeritajeResponse {
    veredicto_final: "ORIGINAL" | "REPRODUCCION" | "DUDOSO";
    confianza_analisis: number;
    analisis_por_seccion: Record<string, { hallazgos: string; estado: string }>;
    tasacion_estimada_estado: number;
    comentario_socio: string;
}

export class IAValidatorService {
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async validarProducto(consolaId: string, imagenesBase64: string[]): Promise<PeritajeResponse | null> {
        const config = DATABASE_CONSOLAS[consolaId];
        if (!config) throw new Error("Consola no soportada actualmente.");

        const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Inyectamos las reglas dinámicamente en el Prompt
        const prompt = `Actúa como perito experto en ${consolaId}. 
    Analiza las fotos adjuntas siguiendo estas reglas críticas: ${config.puntosClave.join(" ")}.
    Responde estrictamente en formato JSON con la siguiente estructura:
    { "veredicto_final": "...", "confianza_analisis": 0-100, "analisis_por_seccion": {}, "tasacion_estimada_estado": 1-10, "comentario_socio": "" }`;

        const imageParts: Part[] = imagenesBase64.map(base64String => ({
            inlineData: {
                data: base64String.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, ""),
                mimeType: "image/jpeg" // Gemini se lleva bien con jpeg/png/webp
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