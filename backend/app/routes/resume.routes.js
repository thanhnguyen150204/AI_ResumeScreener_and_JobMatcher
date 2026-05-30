import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  analyzeResume,
  getHistory,
  getAnalysisDetail,
  bulkRank,
} from '../controllers/resume.controller.js';

const router = Router();

router.post('/analyze', protect, analyzeResume);
router.get('/history', protect, getHistory);
router.get('/history/:id', protect, getAnalysisDetail);
router.post('/bulk-rank', protect, bulkRank);

export default router;
