import { Router } from 'express';
import { analyzeOperationalContext, clearAICache } from './aiController';

const router = Router();

// PART 4: POST /api/ai/analyze & direct /api/ai
router.post('/analyze', analyzeOperationalContext);
router.post('/', analyzeOperationalContext);

// Optional helper route for cache management
router.post('/clear-cache', clearAICache);
router.delete('/cache', clearAICache);

export default router;
