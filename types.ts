
export type MoleculeType = 'Methane' | 'Ethane' | 'Benzene' | 'Water';

export interface AtomData {
  p: [number, number, number];
  t: 'C' | 'H' | 'O';
}

export interface MoleculeData {
  atoms: AtomData[];
  bonds: [number, number][];
}

export interface HoloState {
  handActive: boolean;
  bondScale: number;
  rotation: [number, number];
  currentMolecule: MoleculeType;
  setHandData: (active: boolean, scale: number, rot: [number, number]) => void;
  setMolecule: (m: MoleculeType) => void;
}
