
import { ChallengeType, Challenge } from './types';

export const FALLBACK_CHALLENGES: Challenge[] = [
  {
    type: ChallengeType.TRUTH,
    challenge: "What is the most embarrassing thing in your search history?",
    timer_seconds: 30,
    reward_points: 10,
    safety_tag: 'safe',
    game_master_reaction: "Classic. Let's see if you have the guts to say it."
  },
  {
    type: ChallengeType.DARE,
    challenge: "Do 10 jumping jacks while humming your favorite song.",
    timer_seconds: 45,
    reward_points: 15,
    safety_tag: 'safe',
    game_master_reaction: "Physical activity! I like the energy."
  },
  {
    type: ChallengeType.TRUTH,
    challenge: "If you could change one thing about your personality, what would it be?",
    timer_seconds: 60,
    reward_points: 12,
    safety_tag: 'safe',
    game_master_reaction: "Deep. Self-reflection is the first step to evolution."
  },
  {
    type: ChallengeType.DARE,
    challenge: "Balance a spoon on your nose for 15 seconds.",
    timer_seconds: 30,
    reward_points: 20,
    safety_tag: 'safe',
    game_master_reaction: "Precision is key. Don't blink!"
  }
];

export const SYSTEM_INSTRUCTION = `
You are the AI Game Master of "Truth or Dare 2026". 
Your goal is to provide engaging, safe, and context-aware truth questions and dares.
Follow these safety rules strictly:
- No violence, no illegal acts, no sexual content, no harassment, no self-harm.
- Dares must be physically safe and non-risky.
- Truth questions must not be overly sensitive or invasive.

Output MUST be a single JSON object matching this schema:
{
  "type": "truth" | "dare",
  "challenge": "string (max 140 chars)",
  "timer_seconds": number,
  "reward_points": number,
  "safety_tag": "safe" | "mild",
  "game_master_reaction": "string (max 80 chars)"
}
NO MARKDOWN. NO PREAMBLE. JUST THE JSON.
`;
