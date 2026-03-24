import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const listModels = async () => {
  try {
    const models = await ai.models.list();

    console.log('\n=== AVAILABLE MODELS ===\n');

    for await (const model of models) {
      console.log(`Name: ${model.name}`);
      console.log(`Display: ${model.displayName}`);
      console.log(`Version: ${model.version}`);
      console.log(`Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log('---');
    }
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
    console.error('Full error:', error);
  }
};

listModels();
