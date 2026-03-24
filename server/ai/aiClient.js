import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { aiConfig } from '../config/ai.config.js';

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey,
});

const mapUsageMetadata = (usageMetadata = {}) => ({
  promptTokens: usageMetadata.promptTokenCount || 0,
  completionTokens: usageMetadata.candidatesTokenCount || usageMetadata.responseTokenCount || 0,
  totalTokens: usageMetadata.totalTokenCount || 0,
});

export const generateReview = async ({ prompt, generationConfig = {} }) => {
  try {
    const response = await ai.models.generateContent({
      model: aiConfig.model,
      contents: prompt,
      config: {
        ...aiConfig.generationConfig,
        ...generationConfig,
      },
    });

    return {
      text: response.text || '',
      usageMetadata: mapUsageMetadata(response.usageMetadata),
    };
  } catch (error) {
    console.error('AI model error:', error);
    throw new Error(`AI generation failed: ${error.message || 'unknown'}`);
  }
};
