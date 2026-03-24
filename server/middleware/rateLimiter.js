import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const reviewRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.reviewRequestsPerMinute,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many review requests. Please wait a minute and try again.',
  },
});

export const reviewDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: env.reviewRequestsPerDay,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: `Daily review limit reached. You can submit up to ${env.reviewRequestsPerDay} reviews in 24 hours.`,
  },
});
