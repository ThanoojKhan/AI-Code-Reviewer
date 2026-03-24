import mongoose from 'mongoose';
import { env } from './env.js';
import { Review } from '../models/Review.js';

mongoose.set('bufferCommands', false);

let connectionPromise;

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongoUri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then(async (connection) => {
        await Review.init();
        console.log('MongoDB database connected successfully');
        return connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error('MongoDB database connection failed:', error);
        throw error;
      });
  }

  return connectionPromise;
};
