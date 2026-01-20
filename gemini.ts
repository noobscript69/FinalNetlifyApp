
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are a world-class creative writer and editor.",
          temperature: 0.7,
        },
      });
      return response.text || "No content generated.";
    } catch (error) {
      console.error("Gemini Text Error:", error);
      throw new Error("Failed to generate text content.");
    }
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data found in response.");
    } catch (error) {
      console.error("Gemini Image Error:", error);
      throw new Error("Failed to generate image.");
    }
  }

  async analyzeImage(base64Image: string, prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image.split(',')[1] || base64Image
              }
            },
            { text: prompt }
          ]
        }
      });
      return response.text || "No analysis provided.";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw new Error("Failed to analyze image.");
    }
  }
}

export const gemini = new GeminiService();
