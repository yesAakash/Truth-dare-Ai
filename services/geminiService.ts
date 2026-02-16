
import { GoogleGenAI, Type } from "@google/genai";
import { Challenge, ChallengeType, Mood, Difficulty, GameState } from "../types";
import { SYSTEM_INSTRUCTION, FALLBACK_CHALLENGES } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fix: Use process.env.API_KEY directly as required by the SDK guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateChallenge(
    type: ChallengeType,
    mood: Mood,
    difficulty: Difficulty,
    streak: number,
    skippedCount: number
  ): Promise<Challenge> {
    try {
      // Dynamic difficulty adjustment based on user performance
      let adjustedDifficulty = difficulty;
      if (streak >= 3) {
        // Automatically bump up if on a winning streak
        adjustedDifficulty = difficulty === Difficulty.EASY ? Difficulty.MEDIUM : Difficulty.HARD;
      } else if (skippedCount >= 2) {
        // Ease off if they are skipping too much
        adjustedDifficulty = difficulty === Difficulty.HARD ? Difficulty.MEDIUM : Difficulty.EASY;
      }

      const prompt = `
        Generate a ${type.toUpperCase()} challenge for a player in a ${mood} mood.
        The initial difficulty is ${difficulty}, but adjusted for performance it is ${adjustedDifficulty}.
        Current player streak: ${streak}.
        Current skipped count: ${skippedCount}.
        Make the ${type} ${adjustedDifficulty === Difficulty.HARD ? 'bolder but still safe' : 'lighthearted'}.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['truth', 'dare'] },
              challenge: { type: Type.STRING },
              timer_seconds: { type: Type.NUMBER },
              reward_points: { type: Type.NUMBER },
              safety_tag: { type: Type.STRING, enum: ['safe', 'mild'] },
              game_master_reaction: { type: Type.STRING }
            },
            required: ["type", "challenge", "timer_seconds", "reward_points", "safety_tag", "game_master_reaction"]
          }
        },
      });

      const jsonStr = response.text.trim();
      const parsed = JSON.parse(jsonStr) as Challenge;
      
      // Basic sanity validation
      if (!parsed.challenge || typeof parsed.reward_points !== 'number') {
        throw new Error("Invalid schema from AI");
      }

      return parsed;
    } catch (error) {
      console.error("Gemini Error, using fallback:", error);
      // Fallback logic
      const filteredFallbacks = FALLBACK_CHALLENGES.filter(c => c.type === type);
      return filteredFallbacks[Math.floor(Math.random() * filteredFallbacks.length)];
    }
  }

  async generateReaction(action: 'completed' | 'skipped', gameState: GameState): Promise<string> {
    try {
      const prompt = `
        The player just ${action} a ${gameState.currentChallenge?.type} challenge.
        Their total points are ${gameState.totalPoints}.
        Their current streak is ${gameState.streak}.
        Provide a one-line witty reaction (max 80 chars) as the AI Game Master.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a witty AI Game Master from 2026. Keep reactions under 80 characters.",
        },
      });

      return response.text.trim();
    } catch {
      return action === 'completed' ? "Impressive. Keep it up!" : "A tactical retreat. I'll remember this.";
    }
  }
}
