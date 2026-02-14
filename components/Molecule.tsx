
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import { MOLECULE_DATA } from '../constants';

// Fixed Bond component by using React.FC to support standard attributes like 'key'
interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
  scale: number;
}

const Bond: React.FC<BondProps> = ({ start, end, scale }) => {
  const sV = new THREE.Vector3(...start).multiplyScalar(scale);
  const eV = new THREE.Vector3(...end).multiplyScalar(scale);
  const dir = new THREE.Vector3().subVectors(eV, sV);
  const len = dir.length();
  const center = sV.clone().add(dir.clone().multiplyScalar(0.5));
  
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );

  return (
    <mesh position={center} quaternion={quaternion}>
      <cylinderGeometry args={[0.04, 0.04, len, 12]} />
      <meshStandardMaterial 
        color="#00f3ff" 
        transparent 
        opacity={0.3} 
        emissive="#00f3ff" 
        emissiveIntensity={0.5} 
      />
    </mesh>
  );
}

export const Molecule: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const { currentMolecule, bondScale, rotation, handActive } = useStore();
  const activeData = useMemo(() => MOLECULE_DATA[currentMolecule], [currentMolecule]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Smooth interpolation for the hand-driven rotation
      const targetY = rotation[0] * Math.PI * 2;
      const targetX = rotation[1] * Math.PI * 2;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.1);
      
      if (!handActive) {
        // Subtle idle animations
        groupRef.current.rotation.y += delta * 0.2;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    }
  });

  const getAtomColor = (type: string) => {
    switch(type) {
      case 'C': return '#00f3ff';
      case 'O': return '#ff0055';
      default: return '#ffffff';
    }
  };

  return (
    <group ref={groupRef}>
      {activeData.atoms.map((a, i) => (
        <mesh key={`atom-${i}`} position={a.p.map(v => v * bondScale) as any}>
          <sphereGeometry args={[a.t === 'C' ? 0.35 : a.t === 'O' ? 0.4 : 0.2, 32, 32]} />
          <meshStandardMaterial 
            color={getAtomColor(a.t)} 
            emissive={getAtomColor(a.t)}
            emissiveIntensity={1.5}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      ))}
      
      {activeData.bonds.map(([s, e], i) => (
        <Bond 
          key={`bond-${i}`} 
          start={activeData.atoms[s].p} 
          end={activeData.atoms[e].p} 
          scale={bondScale} 
        />
      ))}

      {/* Holographic floor grid */}
      <gridHelper 
        args={[10, 20, 0x00ffff, 0x004444]} 
        position={[0, -3, 0]} 
        rotation={[0, 0, 0]} 
        transparent 
        opacity={0.2}
      />
    </group>
  );
};
