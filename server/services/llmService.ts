/**
 * LLM Integration Service
 * 
 * Demonstrates:
 * - Calling Google Gemini LLM using @google/genai SDK
 * - Structured JSON output enforcement via responseSchema
 * - Safe server-side API key handling (never exposing keys to client)
 */

import { GoogleGenAI, Type } from '@google/genai';
import { buildStudyPrompt } from './promptBuilder';

// Initialize the Gemini client on the server side
const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface GeneratedStudyAnswer {
  explanation: string;
  example: string;
  summary: string;
}

/**
 * Sends a structured prompt to Gemini 3.8 Flash and returns
 * the structured explanation, example, and summary.
 */
export async function generateStudyResponse(
  subject: string,
  question: string
): Promise<GeneratedStudyAnswer> {
  // Step 1: Build the prompt using our dedicated backend prompt builder
  const prompt = buildStudyPrompt({ subject, question });

  // Step 2: Call the Gemini LLM with structured output schema
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction:
        'You are an encouraging and knowledgeable computer science tutor. Always output structured, accurate, beginner-friendly explanations with clear code or scenarios.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: {
            type: Type.STRING,
            description: 'Simple, beginner-friendly explanation without unnecessary jargon.',
          },
          example: {
            type: Type.STRING,
            description: 'Practical code snippet or concrete real-world scenario.',
          },
          summary: {
            type: Type.STRING,
            description: 'Short 2-3 sentence recap for quick revision.',
          },
        },
        required: ['explanation', 'example', 'summary'],
      },
    },
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('LLM returned an empty response. Please try again.');
  }

  try {
    const parsedData: GeneratedStudyAnswer = JSON.parse(responseText);
    return parsedData;
  } catch (parseError) {
    // Fallback: extract JSON substring if there were extraneous characters
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as GeneratedStudyAnswer;
    }
    throw new Error(`Failed to parse LLM response as JSON: ${parseError}`);
  }
}
