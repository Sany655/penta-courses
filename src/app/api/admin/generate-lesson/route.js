import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth-options';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const { prompt } = await request.json();
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'A lesson prompt is required.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Schema definition for the expected JSON array of blocks
    const responseSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { 
            type: "string",
            enum: ["MARKDOWN", "TERMINAL_ANIMATION", "CODE_STEPPER", "NETWORK_DIAGRAM", "QUIZ"]
          },
          content: {
            type: "object",
            properties: {
              markdown: { type: "string" },
              commands: { type: "array", items: { type: "string" } },
              files: { 
                type: "array", 
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    language: { type: "string" },
                    code: { type: "string" },
                    steps: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          line: { type: "integer" },
                          explanation: { type: "string" }
                        }
                      }
                    }
                  }
                }
              },
              nodes: { type: "array" },
              edges: { type: "array" },
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correctIndex: { type: "integer" },
              explanation: { type: "string" }
            }
          }
        },
        required: ["id", "type", "content"]
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5',
      contents: `Generate a technical e-learning lesson as a JSON array of pedagogical blocks based on this prompt: "${prompt}". Only return valid JSON matching the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2
      }
    });

    const textResult = response.text;
    const generatedBlocks = JSON.parse(textResult);

    return NextResponse.json({ blocks: generatedBlocks });

  } catch (error) {
    console.error('Error generating lesson with Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson content.' },
      { status: 500 }
    );
  }
}
