import { Review } from '../models/Review.js';
import { generateReview } from '../ai/aiClient.js';
import { buildReviewPrompt } from '../ai/promptBuilder.js';
import { parseReviewResponse } from '../ai/responseParser.js';
import { estimateTokens } from '../utils/tokenEstimator.js';
import { hashCode } from '../utils/hashCode.js';
import { estimateReviewCost } from '../utils/costEstimator.js';
import { env } from '../config/env.js';
import { aiConfig } from '../config/ai.config.js';

const sanitizeCode = (code) => code.replace(/\u0000/g, '').replace(/\r\n/g, '\n').trim();

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createReview = async ({ language, code }) => {
  const sanitizedCode = sanitizeCode(code);
  const codeHash = hashCode(sanitizedCode);

  if (sanitizedCode.length > env.maxCodeCharacters) {
    throw createError(`Code exceeds maximum size of ${env.maxCodeCharacters} characters.`, 413);
  }

  const estimatedPromptTokens = estimateTokens(sanitizedCode);

  if (estimatedPromptTokens > env.maxCodeTokens) {
    throw createError(`Code exceeds maximum estimated size of ${env.maxCodeTokens} tokens.`, 413);
  }

  const cachedReview = await Review.findOne({ codeHash, language }).sort({ createdAt: -1 });

  if (cachedReview) {
    cachedReview.cacheHitCount += 1;
    cachedReview.lastAccessedAt = new Date();
    cachedReview.isCachedResult = true;
    await cachedReview.save();
    return cachedReview;
  }

  let usageMetadata = {
    promptTokens: estimatedPromptTokens,
    completionTokens: 0,
    totalTokens: estimatedPromptTokens,
  };

  let analysis;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const prompt = buildReviewPrompt({
      language,
      code: sanitizedCode,
      retry: attempt === 1,
    });

    const aiResponse = await generateReview({
      prompt,
      generationConfig: {
        maxOutputTokens:
          attempt === 1
            ? Math.max(aiConfig.generationConfig.maxOutputTokens * 2, 1200)
            : aiConfig.generationConfig.maxOutputTokens,
      },
    });
    usageMetadata = aiResponse.usageMetadata.totalTokens ? aiResponse.usageMetadata : usageMetadata;

    try {
      analysis = parseReviewResponse(aiResponse.text);
      break;
    } catch (error) {
      console.warn('AI response parse failed on attempt %d:', attempt + 1, aiResponse.text);

      if (attempt === 1) {
        throw createError('AI response was truncated or could not be parsed into the expected JSON format.', 502);
      }
    }
  }

  const cost = estimateReviewCost({
    promptTokens: usageMetadata.promptTokens || estimatedPromptTokens,
    completionTokens: usageMetadata.completionTokens || 0,
  });

  const review = await Review.create({
    language,
    code: sanitizedCode,
    codeHash,
    analysis,
    model: aiConfig.model,
    promptTokens: usageMetadata.promptTokens || estimatedPromptTokens,
    completionTokens: usageMetadata.completionTokens || 0,
    totalTokens: usageMetadata.totalTokens || estimatedPromptTokens,
    estimatedCostUsd: cost.totalCostUsd,
    cacheHitCount: 0,
    lastAccessedAt: new Date(),
    isCachedResult: false,
  });

  return review;
};

export const getReviews = async ({ page = 1, limit = 10 }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Review.find({}, { code: 0 }).sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    Review.countDocuments(),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

export const getReviewById = async (id) => {
  const review = await Review.findById(id).lean();

  if (!review) {
    throw createError('Review not found.', 404);
  }

  return review;
};

export const getReviewMetrics = async () => {
  const [summary] = await Review.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        totalPromptTokens: { $sum: '$promptTokens' },
        totalCompletionTokens: { $sum: '$completionTokens' },
        totalTokens: { $sum: '$totalTokens' },
        totalEstimatedCostUsd: { $sum: '$estimatedCostUsd' },
        totalCacheHits: { $sum: '$cacheHitCount' },
        cachedResponsesServed: {
          $sum: {
            $cond: [{ $gt: ['$cacheHitCount', 0] }, 1, 0],
          },
        },
      },
    },
  ]);

  const metrics = summary || {
    totalReviews: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
    totalEstimatedCostUsd: 0,
    totalCacheHits: 0,
    cachedResponsesServed: 0,
  };

  return {
    ...metrics,
    totalEstimatedCostUsd: Number((metrics.totalEstimatedCostUsd || 0).toFixed(6)),
  };
};

export const deleteReviewById = async (id) => {
  const review = await Review.findByIdAndDelete(id).lean();

  if (!review) {
    throw createError('Review not found.', 404);
  }

  return review;
};
