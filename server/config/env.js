import dotenv from 'dotenv';

dotenv.config();

const requiredVars = ['MONGO_URI', 'GEMINI_API_KEY'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  port: Number(process.env.SERVER_PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  geminiApiKey: process.env.GEMINI_API_KEY,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  maxCodeCharacters: Number(process.env.MAX_CODE_CHARACTERS) || 20000,
  maxCodeTokens: Number(process.env.MAX_CODE_TOKENS) || 6000,
  maxOutputTokens: Number(process.env.MAX_OUTPUT_TOKENS) || 1200,
  reviewRequestsPerMinute: Number(process.env.REVIEW_REQUESTS_PER_MINUTE) || 5,
  reviewRequestsPerDay: Number(process.env.REVIEW_REQUESTS_PER_DAY) || 25,
  reviewRetention: process.env.REVIEW_RETENTION || '',
};
