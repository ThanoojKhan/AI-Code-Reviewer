import mongoose from 'mongoose';
import { env } from '../config/env.js';

const parseDurationToSeconds = (value) => {
  const match = String(value || '')
    .trim()
    .match(/^(\d+)\s*(ms|s|m|h|d)?$/i);

  if (!match) {
    throw new Error(`Invalid REVIEW_RETENTION value: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = (match[2] || 'ms').toLowerCase();
  const multiplierMap = {
    ms: 1 / 1000,
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return Math.floor(amount * multiplierMap[unit]);
};

const analysisSchema = new mongoose.Schema(
  {
    summary: { type: String, default: '' },
    bugs: [
      {
        line: { type: Number, default: null },
        description: { type: String, required: true },
      },
    ],
    performance: [
      {
        suggestion: { type: String, required: true },
      },
    ],
    security: [
      {
        issue: { type: String, required: true },
      },
    ],
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    language: { type: String, required: true, trim: true, maxlength: 50 },
    code: { type: String, required: true },
    codeHash: { type: String, required: true },
    analysis: { type: analysisSchema, required: true },
    model: { type: String, required: true },
    promptTokens: { type: Number, required: true, min: 0 },
    completionTokens: { type: Number, required: true, min: 0 },
    totalTokens: { type: Number, required: true, min: 0 },
    estimatedCostUsd: { type: Number, required: true, min: 0, default: 0 },
    cacheHitCount: { type: Number, required: true, min: 0, default: 0 },
    lastAccessedAt: { type: Date, default: Date.now },
    isCachedResult: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

reviewSchema.index({ codeHash: 1 });

if (env.reviewRetention) {
  reviewSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: parseDurationToSeconds(env.reviewRetention) }
  );
}

export const Review = mongoose.model('Review', reviewSchema);
