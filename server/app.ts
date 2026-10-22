import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Built-in environment defaults ensuring zero-config 24/7 continuous operation
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasteofheaven';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'taste_of_heaven_jwt_secret_token_key_2026';
process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_tasteofheaven_ncr';
process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_sec_tasteofheaven_ncr_2026';

export async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount API router
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  if (!isProd) {
    // In dev mode, attach Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built static assets from dist
    app.use(express.static(path.resolve(rootDir, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(rootDir, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Taste of Heaven server running at http://0.0.0.0:${PORT}`);
  });
}
