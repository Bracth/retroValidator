import { ConsolaId } from "../shared/consoles";

export interface ReglasConsola {
    reglasCriticas: string[];      // Si falla UNA de estas, es REPRO 100%. No hay debate.
    puntosVerificacion: string[];  // Detalles a sumar para calcular la confianza.
    fotosRequeridas: number;
    ordenImagenes: string;
}

export const DATABASE_CONSOLAS: Record<ConsolaId, ReglasConsola> = {
    "N64": {
        ordenImagenes: "1 (Frontal), 2 (Trasera), 3 (Pines/PCB)",
        reglasCriticas: [
            "[FOTO 2 - TRASERA]: Examina el logo 'Nintendo' grabado en el plástico. En los originales, el punto sobre la letra 'i' es CUADRADO. En las repros, es REDONDO. ATENCIÓN: Si la foto no tiene calidad macro y los píxeles del punto están borrosos o ambiguos, NO ADIVINES LA FORMA. Si no estás 100% seguro de que es redondo, NO lo marques como falsificación; decláralo 'NO VERIFICABLE' en el log.",
            "[FOTO 2 - TRASERA]: Los tornillos deben ser de seguridad tipo Gamebit de 3.8mm. Si son claramente de estrella (Philips), es una falsificación 100%. Si la resolución no permite distinguir las muescas del tornillo, NO adivines, decláralo 'NO VERIFICABLE'."
        ],
        puntosVerificacion: [
            "[FOTO 1 - FRONTAL]: El sello 'Official Nintendo Seal of Quality' debe tener un tono dorado metálico, no un amarillo plano o mate.",
            "[FOTO 3 - PINES]: La placa de circuitos (PCB) debe tener un color verde oliva oscuro o marrón/ocre. Las soldaduras de la época (1996-2001) tienen un aspecto ligeramente mate, no brillantes.",
            "[FOTO 1 - FRONTAL]: El código de producto debe seguir el formato NUS-XXX-USA/EUR/JPN.",
            "[REGLA DE FORMATO]: IMPORTANTE: Cada frase que generes en el array 'terminal_logs' DEBE ser extremadamente concisa, tipo log de consola de sistema (Máximo 10-15 palabras por log)."
        ],
        fotosRequeridas: 3
    },
    "GameBoy": {
        ordenImagenes: "1 (Frontal), 2 (Trasera), 3 (Pines/PCB)",
        reglasCriticas: [
            "[FOTO 2 - TRASERA]: Localiza el logo de 'Nintendo' grabado en el plástico. El punto sobre la letra 'i' DEBE ser estrictamente CUADRADO. Si el punto es REDONDO o circular, es una falsificación 100%. Declara REPRODUCCIÓN inmediatamente.",
            "[FOTO 2 - TRASERA]: Los tornillos deben ser de seguridad tipo Gamebit de 3.8mm. Si son tornillos de estrella (Philips) estándar, es una falsificación."
        ],
        puntosVerificacion: [
            "[FOTO 1 - FRONTAL]: El sello 'Official Nintendo Seal of Quality' debe tener un tono dorado metálico, no un amarillo plano o mate.",
            "[FOTO 3 - PINES]: La placa de circuitos (PCB) debe tener un color verde oliva oscuro o marrón/ocre. Las soldaduras de la época (1996-2001) tienen un aspecto ligeramente mate, no brillantes ni perfectas como en manufactura moderna.",
            "[FOTO 1 - FRONTAL]: El código de producto debe seguir el formato NUS-XXX-USA/EUR/JPN."
        ],
        fotosRequeridas: 3
    },
    "NES": {
        fotosRequeridas: 2,
        ordenImagenes: "1 (Frontal), 2 (Trasera)",
        reglasCriticas: [
            "[FOTO 2 - TRASERA]: Revisa la tornillería en las ESQUINAS de la carcasa. ATENCIÓN CRÍTICA: El pequeño círculo hundido en el centro exacto de la parte trasera NO ES UN TORNILLO, es una marca del molde de plástico. IGNÓRALO por completo. Busca los tornillos reales en las esquinas inferiores. Si esos tornillos reales son de estrella (Philips), declara REPRODUCCIÓN.",
            "[FOTO 2 - TRASERA]: Examina la etiqueta de precaución. Las falsificaciones tienen colores deslavados o texto ilegible."
        ],
        puntosVerificacion: [
            "[FOTO 1 - FRONTAL]: El sello 'Official Nintendo Seal of Quality' debe ser ovalado o redondo con un tono dorado.",
            "[FOTO 1 - FRONTAL]: El código de producto debe seguir el formato NES-XX-XXX (ej. NES-R3-ESP).",
            "[FOTO 2 - TRASERA]: ATENCIÓN: Los textos de copyright con códigos europeos (ej. '© M Nintendo 1985 DAS', FAH, ESP, NOE) son PERFECTAMENTE ORIGINALES y válidos para la región PAL. NO los marques como anomalía.",
            "[REGLA DE FORMATO]: Cada log en 'terminal_logs' debe ser muy conciso (Máximo 15 palabras)."
        ]
    }
};