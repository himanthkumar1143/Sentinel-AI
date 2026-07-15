"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
// Middlewares
app.use((0, cors_1.default)({
    origin: '*', // Allow Vercel frontend or local Vite dev server
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// API Routes
app.use('/api', api_1.default);
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
exports.default = app;
