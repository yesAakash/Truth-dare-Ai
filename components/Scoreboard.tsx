
import React from 'react';
import { GameState } from '../types';

const Scoreboard: React.FC<{ state: GameState }> = ({ state }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-4 py-2">
      <div className="glass-panel rounded-xl p-3 flex flex-col items-center justify-center border-b-2 border-indigo-500">
        <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">Total Points</span>
        <span className="text-2xl font-black text-white">{state.totalPoints}</span>
      </div>
      <div className="glass-panel rounded-xl p-3 flex flex-col items-center justify-center border-b-2 border-pink-500">
        <span className="text-[10px] uppercase tracking-wider text-pink-300 font-bold">Hot Streak</span>
        <span className="text-2xl font-black text-white">{state.streak} 🔥</span>
      </div>
      <div className="glass-panel rounded-xl p-3 flex flex-col items-center justify-center border-b-2 border-emerald-500">
        <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">Completed</span>
        <span className="text-2xl font-black text-white">{state.completedCount}</span>
      </div>
      <div className="glass-panel rounded-xl p-3 flex flex-col items-center justify-center border-b-2 border-slate-500">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Skipped</span>
        <span className="text-2xl font-black text-white">{state.skippedCount}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
