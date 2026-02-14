
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Molecule } from './components/Molecule';
import { HUD } from './components/HUD';
import { HandTracker } from './components/HandTracker';
import { Loader2 } from 'lucide-react';

export default function App() {
  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden select-none">
      {/* UI Layers */}
      <HUD />
      <HandTracker />

      {/* 3D Scene */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        </div>
      }>
        <Canvas gl={{ antialias: false, stencil: false, depth: true }} dpr={[1, 2]}>
          <color attach="background" args={['#020617']} />
          
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
          
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
          <spotLight 
            position={[0, 10, 0]} 
            angle={0.3} 
            penumbra={1} 
            intensity={2} 
            color="#00f3ff" 
            castShadow 
          />
          
          <Molecule />
          
          {/* Post Processing for the "Hologram" feel */}
          <EffectComposer disableNormalPass>
            <Bloom 
              luminanceThreshold={0.5} 
              mipmapBlur 
              intensity={2.5} 
              radius={0.4} 
            />
            <ChromaticAberration offset={[0.002, 0.002]} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={3} 
            maxDistance={12} 
            rotateSpeed={0.5}
            makeDefault
          />
          
          <Environment preset="night" />
        </Canvas>
      </Suspense>

      {/* Decorative Overlays */}
      <div className="fixed inset-0 pointer-events-none border-[20px] border-cyan-500/5 opacity-50 z-20"></div>
      <div className="fixed top-0 left-0 w-full h-1 bg-cyan-500/20 z-30"></div>
      <div className="fixed bottom-0 left-0 w-full h-1 bg-cyan-500/20 z-30"></div>
    </div>
  );
}
