# 🎨 RetroGuard AI - UI/UX Design System (MVP Hackathon)

## 1. Concepto Visual: "Cyber-Forensic Professional"
Olvídate del "hacker de los 90". La interfaz debe transmitir **rigor pericial, tecnología de vanguardia y limpieza**. Piensa en el software que usaría una casa de subastas moderna para validar una obra de arte, pero aplicado a cartuchos de Nintendo.
- **Tema Base:** Dark Mode estricto (para resaltar los acentos de color de los resultados).
- **Estilo de Componentes:** Bordes limpios, transparencias sutiles (glassmorphism ligero en los modales) y alto contraste.

## 2. Tipografía (Font Pairing)
El secreto de una UI "cara" es combinar bien las fuentes.
* **Fuente UI / Cuerpo (Legibilidad):** `Inter` o `Geist Sans`. Úsala para botones, instrucciones y descripciones largas (el comentario del socio).
* **Fuente Datos / Títulos (Toque Técnico):** `JetBrains Mono` o `Fira Code`. Úsala para el Log técnico, el porcentaje de confianza, IDs de consolas y etiquetas numéricas.

## 3. Paleta de Colores (Tailwind Classes)
Prohibido usar colores semánticos (Rojo/Verde) para decorar. **El color es información.**

* **Fondos (Backgrounds):**
  * Base: `bg-zinc-950` (Casi negro).
  * Tarjetas/Paneles: `bg-zinc-900` con borde `border-zinc-800`.
* **Texto:**
  * Primario: `text-zinc-100`.
  * Secundario (Instrucciones mudas): `text-zinc-400`.
* **Acentos Semánticos (¡La clave del UX!):**
  * ✅ **Éxito/Original:** Verde Esmeralda (`text-emerald-400`, `border-emerald-500/50`).
  * ⚠️ **Alerta/Dudoso:** Ámbar (`text-amber-400`, `border-amber-500/50`).
  * ❌ **Falsificación/Error:** Rojo Carmesí (`text-rose-500`, `border-rose-500/50`).
  * 🔮 **Analizando (Neutral):** Azul Cyan (`text-cyan-400`, animaciones de carga).

## 4. Layout (Jerarquía Visual de Arriba a Abajo)

### A. Header (Sticky)
- Logo Minimalista a la izquierda: `[RETROGUARD // AI]` en monoespaciado.
- Indicador de estado global a la derecha: `STATUS: WAITING_INPUT` o `STATUS: SECURE_LINK`.

### B. Main Stage (Input)
- **Grid de 3 Columnas:** Tres tarjetas (`Card` de shadcn) iguales para las fotos (Frontal, Trasera, Pines).
- **Estado Vacío:** Borde punteado (`border-dashed`), icono de cámara sutil y texto claro: "Arrastra la imagen o haz clic".
- **Estado Relleno:** Imagen que ocupe todo el ancho (`object-cover`) con un pequeño botón flotante de 🗑️ para borrarla.

### C. Control Center (La botonera)
- Una franja oscura debajo de las fotos.
- **Izquierda:** Selector dropdown de consola (N64, NES, GameBoy).
- **Centro:** Botón principal de **ANALIZAR** (Grande, destacado, con fondo que llame a la acción, ej. `bg-zinc-100 text-black`).
- **Derecha:** Botones secundarios pequeños (outline): `Demo: MK64`, `Demo: Fake`, `Limpiar`.

### D. Panel de Resultados (Oculto hasta el submit)
- Aparece con una animación suave de "Slide down" y "Fade In".
- **Banner Superior:** Veredicto gigante. Ej: `VEREDICTO: AUTÉNTICO VERIFICADO`. Fondo sutil (`bg-emerald-950/30`) y texto brillante.
- **Split View (Dos columnas abajo):**
  1. **Izquierda (El Log Técnico):** Un recuadro negro tipo terminal (`bg-black/50`). Lista limpia con iconos: 
     - `✅ [N64] Punto de la 'i' cuadrado detectado.`
     - `❌ [N64] Tornillos no corresponden al estándar Gamebit.`
  2. **Derecha (El Reporte Humano & Confianza):** - El velocímetro circular (o un medidor de barra horizontal de 0 a 100).
     - Una caja de texto con formato de cita (`blockquote`) para el "Comentario del Socio". Letra cursiva, elegante.

## 5. Micro-Interacciones y "Teatro" (US-03)
- Cuando el usuario le da a "Analizar", las 3 imágenes reciben un "overlay" azul translúcido con una línea de escáner CSS subiendo y bajando.
- El panel de resultados NO aparece de golpe. Muestra un "Skeleton Loader" con los textos de estado que creamos (`Buscando logo de Nintendo...`) durante 4-5 segundos.