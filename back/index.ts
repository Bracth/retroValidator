import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { IAValidatorService } from './valdiatorService';
import { ConsolaId } from '../shared/consoles';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('🚨 ERROR CRÍTICO: GEMINI_API_KEY no encontrada en el .env');
  process.exit(1);
}
const validator = new IAValidatorService(apiKey);

app.post('/validate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { consolaId, imagenesBase64 } = req.body;

    if (!consolaId || !Object.values(ConsolaId).includes(consolaId) || !Array.isArray(imagenesBase64) || imagenesBase64.length === 0) {
      res.status(400).json({
        error: 'Petición inválida',
        message: `consolaId debe ser uno de: ${Object.values(ConsolaId).join(', ')} y imagenesBase64 (array de strings base64) son requeridos.`
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