import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors'; // ¡Añade esto con: npm install cors y npm i -D @types/cors!
import { IAValidatorService } from './valdiatorService';

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Middlewares
app.use(cors()); // FUNDAMENTAL para que React pueda llamar a esta API
// Aumentamos el límite porque los strings en Base64 de las imágenes pesan mucho
app.use(express.json({ limit: '50mb' }));

// Instanciamos el servicio UNA SOLA VEZ al arrancar el servidor
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('🚨 ERROR CRÍTICO: GEMINI_API_KEY no encontrada en el .env');
  process.exit(1); // Detenemos el servidor si no hay key, mejor fallar rápido
}
const validator = new IAValidatorService(apiKey);

app.post('/validate', async (req: Request, res: Response): Promise<void> => {
  try {
    // Ahora esperamos un array de strings en formato Base64
    const { consolaId, imagenesBase64 } = req.body;

    if (!consolaId || !Array.isArray(imagenesBase64) || imagenesBase64.length === 0) {
      res.status(400).json({
        error: 'Petición inválida',
        message: 'consolaId (string) y imagenesBase64 (array de strings base64) son requeridos.'
      });
      return;
    }

    // Llamamos al servicio (OJO: Tendremos que adaptar el servicio para que acepte Base64 directamente)
    const resultado = await validator.validarProducto(consolaId, imagenesBase64);

    if (resultado) {
      res.json(resultado);
    } else {
      res.status(500).json({ error: 'La validación de IA falló o retornó nulo.' });
    }
  } catch (error: any) {
    console.error('❌ Error en ruta /validate:', error.message);
    res.status(500).json({ error: 'Error interno del servidor en el peritaje.' });
  }
});

app.get('/', (req: Request, res: Response): void => {
  res.send('API RetroGuard is running and secured! 🛡️🕹️');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});