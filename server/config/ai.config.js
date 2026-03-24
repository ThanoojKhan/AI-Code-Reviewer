import { env } from './env.js';

export const aiConfig = {
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.1,
    topP: 0.9,
    maxOutputTokens: env.maxOutputTokens,
    responseMimeType: 'application/json',
  },
  safetySettings: [],
};
