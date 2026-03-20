export interface ReglasConsola {
    puntosClave: string[];
    fotosRequeridas: number;
}

export const DATABASE_CONSOLAS: Record<string, ReglasConsola> = {
    "N64": {
        puntosClave: [
            "Punto de la 'i' cuadrado en el logo trasero de Nintendo.",
            "Tornillos de seguridad Gamebit de 3.8mm.",
            "Código de modelo NUS-006."
        ],
        fotosRequeridas: 3
    },
    "GameBoy": {
        puntosClave: [
            "Número de 2 dígitos troquelado (estampado) en la etiqueta derecha.",
            "Logo de Nintendo en la placa (PCB) visible desde la ranura inferior.",
            "Tornillo tipo Tri-Wing en la parte trasera."
        ],
        fotosRequeridas: 3
    },
    "NES": {
        puntosClave: [
            "Cinco tornillos en versiones tempranas o tres en tardías (no de estrella).",
            "Sello de calidad 'Round' (temprano) o 'Oval' (tardío) según el año.",
            "Textura del plástico rugosa, no lisa."
        ],
        fotosRequeridas: 2
    }
};