import * as reviewService from '../services/review.service.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviews(req.query);
    res.status(200).json({ success: true, data: reviews.items, pagination: reviews.pagination });
  } catch (error) {
    next(error);
  }
};

export const getReviewMetrics = async (req, res, next) => {
  try {
    const metrics = await reviewService.getReviewMetrics();
    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteReviewById = async (req, res, next) => {
  try {
    await reviewService.deleteReviewById(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
