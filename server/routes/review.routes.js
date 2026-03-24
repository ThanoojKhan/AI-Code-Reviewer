import { Router } from 'express';
import {
  createReview,
  deleteReviewById,
  getReviewById,
  getReviewMetrics,
  getReviews,
} from '../controllers/review.controller.js';
import { reviewDailyLimiter, reviewRateLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { reviewRequestValidator, reviewIdValidator } from '../validators/review.validator.js';

const router = Router();

router.post('/', reviewRateLimiter, reviewDailyLimiter, validateRequest(reviewRequestValidator), createReview);
router.get('/metrics', getReviewMetrics);
router.get('/', getReviews);
router.get('/:id', validateRequest(reviewIdValidator), getReviewById);
router.delete('/:id', validateRequest(reviewIdValidator), deleteReviewById);

export default router;
