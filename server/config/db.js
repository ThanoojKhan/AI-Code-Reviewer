import mongoose from 'mongoose';
import { env } from './env.js';
import { Review } from '../models/Review.js';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    await Review.init();

    console.log('MongoDB database connected successfully');
  } catch (error) {
    console.error('MongoDB database connection failed:', error);
    throw error;
  }
};