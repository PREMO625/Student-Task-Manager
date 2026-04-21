import { Router } from 'express';
import {
  getAnalyticsSummary,
  getAnalyticsCharts,
} from '../controllers/analyticsController';
import protect from '../middleware/auth';

const router = Router();

router.use(protect as any);

router.get('/summary', getAnalyticsSummary as any);
router.get('/charts', getAnalyticsCharts as any);

export default router;
