
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Mood, Difficulty, ChallengeType, Challenge } from './types';
import { GeminiService } from './services/geminiService';
import GameMasterAvatar from './components/GameMasterAvatar';
import Scoreboard from './components/Scoreboard';

const gemini = new GeminiService();

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerName: '',
    mood: Mood.FUN,
    difficulty: Difficulty.EASY,
    totalPoints: 0,
    streak: 0,
    completedCount: 0,
    skippedCount: 0,
    currentChallenge: null,
    history: [],
    status: 'idle',
    lastReaction: 'Greetings. I am your AI Dare Master for 2026.'
  });

  const [timer, setTimer] = useState<number>(0);
  const [isThinking, setIsThinking] = useState(false);
  // Fix: Use number type for timer reference instead of NodeJS.Timeout to resolve namespace error in browser environment
  const timerRef = useRef<number | null>(null);

  // Handle game setup
  const startGame = (name: string, mood: Mood, difficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      playerName: name,
      mood,
      difficulty,
      status: 'active'
    }));
  };

  // Fetch new challenge
  const fetchChallenge = async (type: ChallengeType) => {
    setIsThinking(true);
    setGameState(prev => ({ ...prev, status: 'loading' }));
    
    try {
      const challenge = await gemini.generateChallenge(
        type, 
        gameState.mood, 
        gameState.difficulty, 
        gameState.streak, 
        gameState.skippedCount
      );

      setGameState(prev => ({
        ...prev,
        currentChallenge: challenge,
        status: 'active',
        lastReaction: challenge.game_master_reaction
      }));

      setTimer(challenge.timer_seconds);
    } catch (error) {
      console.error(error);
      setGameState(prev => ({ ...prev, status: 'active' }));
    } finally {
      setIsThinking(false);
    }
  };

  // Action handlers
  const handleComplete = async () => {
    if (!gameState.currentChallenge) return;
    
    const points = gameState.currentChallenge.reward_points;
    const newStreak = gameState.streak + 1;
    
    setIsThinking(true);
    const reaction = await gemini.generateReaction('completed', { ...gameState, streak: newStreak });
    
    setGameState(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
      streak: newStreak,
      completedCount: prev.completedCount + 1,
      currentChallenge: null,
      lastReaction: reaction
    }));
    
    setIsThinking(false);
    setTimer(0);
  };

  const handleSkip = async () => {
    setIsThinking(true);
    const reaction = await gemini.generateReaction('skipped', gameState);

    setGameState(prev => ({
      ...prev,
      streak: 0,
      skippedCount: prev.skippedCount + 1,
      currentChallenge: null,
      lastReaction: reaction
    }));
    
    setIsThinking(false);
    setTimer(0);
  };

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      // Fix: Use window.setInterval to ensure number return type and browser compatibility
      timerRef.current = window.setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timer]);

  // Render Screens
  if (gameState.status === 'idle') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-2">
            TRUTH OR DARE 2026
          </h1>
          <p className="text-slate-400 font-medium">Evolutionary AI Social Experience</p>
        </div>

        <div className="glass-panel w-full max-w-md p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Player Identity (Optional)</label>
            <input 
              type="text" 
              placeholder="Enter name..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={gameState.playerName}
              onChange={(e) => setGameState(prev => ({ ...prev, playerName: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Mood</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none"
                value={gameState.mood}
                onChange={(e) => setGameState(prev => ({ ...prev, mood: e.target.value as Mood }))}
              >
                {Object.values(Mood).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Difficulty</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none"
                value={gameState.difficulty}
                onChange={(e) => setGameState(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
              >
                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={() => startGame(gameState.playerName, gameState.mood, gameState.difficulty)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transform transition active:scale-95"
          >
            INITIALIZE GAME MASTER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6 space-y-6">
      <header className="w-full max-w-2xl flex justify-between items-center py-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">AI Master Session</span>
          <span className="text-xl font-black text-white">{gameState.playerName || 'Ghost Player'}</span>
        </div>
        <div className="flex space-x-2">
           <div className="bg-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-400 border border-indigo-500/30">
            MOOD: {gameState.mood.toUpperCase()}
           </div>
           <div className="bg-pink-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-pink-400 border border-pink-500/30">
            LEVEL: {gameState.difficulty.toUpperCase()}
           </div>
        </div>
      </header>

      <Scoreboard state={gameState} />

      <GameMasterAvatar reaction={gameState.lastReaction} isThinking={isThinking} />

      <main className="w-full max-w-md flex-grow flex flex-col items-center justify-center space-y-8">
        {!gameState.currentChallenge ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <button 
              disabled={isThinking}
              onClick={() => fetchChallenge(ChallengeType.TRUTH)}
              className="group relative h-48 bg-slate-900 border-2 border-cyan-500/50 hover:border-cyan-400 rounded-3xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center justify-center h-full">
                <span className="text-4xl mb-2">👁️</span>
                <span className="text-2xl font-black text-white tracking-widest">TRUTH</span>
              </div>
            </button>

            <button 
              disabled={isThinking}
              onClick={() => fetchChallenge(ChallengeType.DARE)}
              className="group relative h-48 bg-slate-900 border-2 border-rose-500/50 hover:border-rose-400 rounded-3xl overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center justify-center h-full">
                <span className="text-4xl mb-2">⚡</span>
                <span className="text-2xl font-black text-white tracking-widest">DARE</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="w-full animate-in zoom-in duration-300">
            <div className={`glass-panel p-8 rounded-[2.5rem] relative overflow-hidden border-2 ${gameState.currentChallenge.type === 'truth' ? 'border-cyan-500/30' : 'border-rose-500/30'}`}>
              <div className="absolute top-0 right-0 m-6 flex flex-col items-end">
                <span className="text-3xl font-black text-white/20">#{gameState.completedCount + gameState.skippedCount + 1}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${gameState.currentChallenge.safety_tag === 'safe' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {gameState.currentChallenge.safety_tag.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-6 pt-4">
                <div className={`text-xs font-bold tracking-[0.3em] uppercase ${gameState.currentChallenge.type === 'truth' ? 'text-cyan-400' : 'text-rose-400'}`}>
                  {gameState.currentChallenge.type} Challenge
                </div>
                
                <h2 className="text-2xl font-bold leading-tight text-white min-h-[5rem] flex items-center">
                  {gameState.currentChallenge.challenge}
                </h2>

                <div className="flex w-full justify-between items-center bg-white/5 rounded-2xl p-4">
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rewards</span>
                    <span className="text-xl font-black text-indigo-400">+{gameState.currentChallenge.reward_points} PTS</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Timer</span>
                    <span className={`text-xl font-black ${timer < 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                      {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col w-full space-y-3 pt-4">
                  <button 
                    onClick={handleComplete}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
                  >
                    CHALLENGE COMPLETED
                  </button>
                  <button 
                    onClick={handleSkip}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-2xl transition-all"
                  >
                    SKIP (LOSE STREAK)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-6">
        <button 
          onClick={() => setGameState(prev => ({ ...prev, status: 'idle', currentChallenge: null }))}
          className="text-xs text-slate-600 hover:text-slate-400 transition-colors uppercase font-bold tracking-widest"
        >
          Reset AI Protocol
        </button>
      </footer>
    </div>
  );
};

export default App;
