import express from 'express';
import cors from 'cors';
import env from './config/env';
import apiRoutes from './routes/api';

const app = express();
const PORT = env.PORT;

// Middlewares
app.use(cors({
  origin: '*', // Allow Vercel frontend or local Vite dev server
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health & Info endpoint
app.get('/', (_req, res) => {
  res.json({
    platform: 'SentinelAI — Industrial Compound Risk Intelligence Platform',
    phase: 'Phase 2 — Industrial Data Integration Pipeline',
    status: 'ONLINE',
    endpoints: [
      'GET /api/pipeline?scenario={normal|warning|critical}',
      'GET /api/dashboard?scenario={normal|warning|critical}',
      'GET /api/sensors?scenario={normal|warning|critical}',
      'GET /api/plant-status?scenario={normal|warning|critical}',
      'GET /api/scenarios',
      'GET /api/payload?scenario={normal|warning|critical}'
    ],
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[SentinelAI Telemetry Gateway] Server online at http://localhost:${PORT}`);
  console.log(`[SentinelAI Telemetry Gateway] Serving mock industrial datasets (Phase 1)`);
});

export default app;
