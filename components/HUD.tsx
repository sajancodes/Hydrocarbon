
import React from 'react';
import { useStore } from '../store';
import { MoleculeType } from '../types';
import { Atom, Maximize2, RotateCcw, Box, Info } from 'lucide-react';

export const HUD: React.FC = () => {
  const { currentMolecule, setMolecule, handActive, bondScale } = useStore();

  const molecules: MoleculeType[] = ['Methane', 'Ethane', 'Benzene', 'Water'];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 p-10 flex flex-col justify-between">
      {/* Top Left: Title & Status */}
      <div className="pointer-events-auto max-w-xs">
        <div className="flex items-center gap-3 mb-2">
          <Atom className="w-8 h-8 text-cyan-400" />
          <h1 className="text-4xl font-black tracking-tighter text-white">
            HOLO<span className="text-cyan-400">HYDRO</span>
          </h1>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500 to-transparent mb-4"></div>
        <div className="space-y-1">
          <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.2em]">System Status: Ready</p>
          <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.2em]">
            Input Source: <span className={handActive ? 'text-cyan-300' : 'text-red-400'}>
              {handActive ? 'HAND_GESTURE_TRACKING' : 'IDLE_ORBIT'}
            </span>
          </p>
          <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.2em]">Scale Factor: {bondScale.toFixed(2)}x</p>
        </div>
      </div>

      {/* Middle Right: Molecule Selector */}
      <div className="absolute top-1/2 -right-2 -translate-y-1/2 pointer-events-auto flex flex-col gap-4 items-end">
        {molecules.map((m) => (
          <button
            key={m}
            onClick={() => setMolecule(m)}
            className={`group relative flex items-center gap-4 transition-all duration-300 pr-8 pl-4 py-2 border-r-4 ${
              currentMolecule === m 
                ? 'bg-cyan-500/20 border-cyan-400 text-white translate-x-[-10px]' 
                : 'border-cyan-900 text-cyan-500 hover:bg-cyan-950/40 hover:text-cyan-300'
            }`}
          >
            <span className="text-sm font-bold uppercase tracking-widest">{m}</span>
            <Box className={`w-5 h-5 ${currentMolecule === m ? 'animate-pulse' : ''}`} />
            
            {/* Active indicator line */}
            {currentMolecule === m && (
              <div className="absolute left-[-20px] top-1/2 w-4 h-[1px] bg-cyan-400"></div>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Left: Instructions */}
      <div className="pointer-events-auto max-w-sm bg-cyan-950/20 backdrop-blur-md p-4 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Interface Manual</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <RotateCcw className="w-4 h-4 text-cyan-500/50 mt-1" />
            <div>
              <p className="text-[10px] text-white/80 font-bold uppercase">Rotation</p>
              <p className="text-[9px] text-cyan-400/60">Move wrist across frame</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Maximize2 className="w-4 h-4 text-cyan-500/50 mt-1" />
            <div>
              <p className="text-[10px] text-white/80 font-bold uppercase">Scaling</p>
              <p className="text-[9px] text-cyan-400/60">Open/close thumb-pinky distance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Reticle Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
         <div className="w-[500px] h-[500px] border border-cyan-500 rounded-full flex items-center justify-center">
           <div className="w-[480px] h-[480px] border border-cyan-500/50 rounded-full border-dashed"></div>
         </div>
      </div>
    </div>
  );
};
