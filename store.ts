
import { create } from 'zustand';
import { HoloState, MoleculeType } from './types';

export const useStore = create<HoloState>((set) => ({
  handActive: false,
  bondScale: 1.5,
  rotation: [0, 0],
  currentMolecule: 'Methane',
  setHandData: (active, scale, rot) => set({ 
    handActive: active, 
    bondScale: scale, 
    rotation: rot 
  }),
  setMolecule: (m: MoleculeType) => set({ currentMolecule: m }),
}));
