import React, { useState, useEffect } from 'react';
import { Experience } from './components/Experience';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.CHAOS);
  const [audioStarted, setAudioStarted] = useState(false);

  // Toggle Logic
  const toggleState = () => {
    setTreeState((prev) => (prev === TreeState.CHAOS ? TreeState.FORMED : TreeState.CHAOS));
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Experience treeState={treeState} onToggle={toggleState} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between py-12 px-6">
        
        {/* Header */}
        <header className="text-center space-y-2 pointer-events-auto mt-16">
          <h2 className="font-display italic text-4xl md:text-6xl text-emerald-100 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-white to-yellow-100">
            Merry Christmas, Nora!
          </h2>
        </header>

        {/* Interaction Prompt */}
        <div className="text-center pointer-events-auto transition-all duration-700 ease-in-out">
           <button 
             onClick={toggleState}
             className={`
               group relative px-8 py-3 overflow-hidden rounded-full 
               border border-yellow-500/50 backdrop-blur-sm
               transition-all duration-300 hover:bg-yellow-900/30 hover:scale-105 active:scale-95
             `}
           >
             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
             <span className="relative font-display text-xl text-yellow-100 group-hover:text-white transition-colors">
               {treeState === TreeState.CHAOS ? "Summon the Tree" : "Release the Magic"}
             </span>
           </button>
           
           <p className="mt-4 font-body text-xs text-emerald-200/50 tracking-widest">
             CLICK TO TRANSFORM
           </p>
        </div>

        {/* Footer */}
        <div className="text-center pointer-events-auto">
            <div className="flex items-center gap-2 justify-center text-white/40 text-xs">
                <span>React 18</span> • <span>R3F</span> • <span>Disney Style</span>
            </div>
        </div>
      </div>

      {/* Tailwind Custom Animation Config for Shimmer */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
