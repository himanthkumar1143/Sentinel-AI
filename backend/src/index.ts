import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

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
    phase: 'Phase 1 — Mock Industrial Telemetry Server',
    status: 'ONLINE',
    endpoints: [
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
