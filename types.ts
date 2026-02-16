
export enum Mood {
  FUN = 'Fun',
  COMPETITIVE = 'Competitive',
  CALM = 'Calm'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export enum ChallengeType {
  TRUTH = 'truth',
  DARE = 'dare'
}

export interface Challenge {
  type: ChallengeType;
  challenge: string;
  timer_seconds: number;
  reward_points: number;
  safety_tag: 'safe' | 'mild';
  game_master_reaction: string;
}

export interface GameState {
  playerName: string;
  mood: Mood;
  difficulty: Difficulty;
  totalPoints: number;
  streak: number;
  completedCount: number;
  skippedCount: number;
  currentChallenge: Challenge | null;
  history: Challenge[];
  status: 'idle' | 'loading' | 'active' | 'finished';
  lastReaction: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
