
import React from 'react';

interface GameMasterAvatarProps {
  reaction: string;
  isThinking: boolean;
}

const GameMasterAvatar: React.FC<GameMasterAvatarProps> = ({ reaction, isThinking }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 transition-all duration-500">
      <div className={`relative w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 animate-float shadow-[0_0_20px_rgba(139,92,246,0.5)] ${isThinking ? 'animate-pulse' : ''}`}>
        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
          {/* Futuristic Face representation */}
          <div className="flex flex-col items-center">
            <div className="flex space-x-3 mb-2">
              <div className={`w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] ${isThinking ? 'animate-bounce' : ''}`}></div>
              <div className={`w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] ${isThinking ? 'animate-bounce delay-100' : ''}`}></div>
            </div>
            <div className={`w-8 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee] ${isThinking ? 'w-4' : ''} transition-all`}></div>
          </div>
        </div>
        
        {/* Decorative Orbitals */}
        <div className="absolute inset-0 border border-white/10 rounded-full -m-2 animate-spin duration-[10s]"></div>
        <div className="absolute inset-0 border border-white/5 rounded-full -m-4 animate-reverse-spin duration-[15s]"></div>
      </div>
      
      {reaction && (
        <div className="max-w-xs bg-slate-800/80 border border-indigo-500/30 px-4 py-2 rounded-2xl text-center text-sm italic text-indigo-200 shadow-xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2">
          "{reaction}"
        </div>
      )}
    </div>
  );
};

export default GameMasterAvatar;
