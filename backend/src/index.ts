import express from 'express';
import cors from 'cors';
import env from './config/env';
import apiRoutes from './routes/api';
import aiRoutes from './ai/aiRoutes';
import pipelineRoutes from './routes/pipeline';

const app = express();
const PORT = env.PORT;

// Middlewares in strict order (PART 4)
app.use(cors({
  origin: '*', // Allow Vercel frontend or local Vite dev server
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use((req, _res, next) => {
  if (req.originalUrl.includes('/ai/analyze')) {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  }
  next();
});

// PART 7: Health verification endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    ai: 'registered',
    pipeline: 'registered',
    context: 'registered',
    timestamp: new Date().toISOString()
  });
});
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    ai: 'registered',
    pipeline: 'registered',
    context: 'registered',
    timestamp: new Date().toISOString()
  });
});

// PART 2 & PART 4: Explicit Route Registration (guarantee exact matches across all environments & prefixes)
app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);
app.use('/api/pipeline', pipelineRoutes);
app.use('/pipeline', pipelineRoutes);
app.use('/api', apiRoutes);

// Health & Info endpoint
app.get('/', (_req, res) => {
  res.json({
    platform: 'SentinelAI — Industrial Compound Risk Intelligence Platform',
    phase: 'Phase 4 — Explainable AI Compound Risk Intelligence Engine',
    status: 'ONLINE',
    endpoints: [
      'GET /api/health',
      'POST /api/ai/analyze',
      'POST /ai/analyze',
      'GET /api/pipeline?scenario={normal|warning|critical}',
      'GET /api/dashboard?scenario={normal|warning|critical}',
      'GET /api/sensors?scenario={normal|warning|critical}',
      'GET /api/plant-status?scenario={normal|warning|critical}',
      'GET /api/scenarios',
      'GET /api/payload?scenario={normal|warning|critical}',
      'GET /api/context'
    ],
    timestamp: new Date().toISOString()
  });
});

// PART 8 — Improve Error Logging (Structured 404 Interceptor for missing routes)
app.use((req, res) => {
  console.error(`\n[SentinelAI Gateway] 404 Route Not Found — Incoming Request: ${req.method} ${req.originalUrl} | Matched Route: NO | Server Port: ${PORT}\n`);
  res.status(404).json({
    status: 'error',
    error: 'Route Not Found',
    message: `Endpoint ${req.method} ${req.originalUrl} not found on server (Port ${PORT}). Verify API_BASE_URL and route registration.`,
    diagnostics: {
      serverPort: PORT,
      incomingRequest: `${req.method} ${req.originalUrl}`,
      matchedRoute: 'NO',
      availableRoutes: [
        'GET /api/health',
        'POST /api/ai/analyze',
        'POST /ai/analyze',
        'GET /api/pipeline',
        'GET /api/context'
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n====================================================================`);
  console.log(`[SentinelAI Telemetry Gateway] Server online at http://localhost:${PORT}`);
  console.log(`[SentinelAI Telemetry Gateway] Environment: ${env.NODE_ENV}`);
  console.log(`====================================================================`);
  console.log(`[Route Diagnostics] Registered Enterprise Endpoints (PART 5):`);
  console.log(`✓ GET  /api/health`);
  console.log(`✓ GET  /api/pipeline`);
  console.log(`✓ GET  /api/dashboard`);
  console.log(`✓ GET  /api/sensors`);
  console.log(`✓ GET  /api/plant-status`);
  console.log(`✓ GET  /api/scenarios`);
  console.log(`✓ GET  /api/payload`);
  console.log(`✓ GET  /api/context`);
  console.log(`✓ POST /api/ai/analyze (Phase 4 Explainable AI Compound Risk Engine)`);
  console.log(`✓ POST /ai/analyze     (Direct Alias)`);
  console.log(`====================================================================\n`);
});

export default app;
