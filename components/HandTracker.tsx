
import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { Activity, Camera as CameraIcon, CameraOff } from 'lucide-react';

export const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [cameraActive, setCameraActive] = useState(false);
  const setHandData = useStore(s => s.setHandData);

  useEffect(() => {
    let hands: any;
    let camera: any;

    const initializeMediaPipe = async () => {
      // Use dynamic imports/script loading for MediaPipe since it's heavy
      const { Hands } = (window as any).Hands ? (window as any) : await import('@mediapipe/hands');
      const { Camera } = (window as any).Camera ? (window as any) : await import('@mediapipe/camera_utils');

      hands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5
      });

      hands.onResults((results: any) => {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          
          // 1. Calculate Rotation from wrist (0) to index base (5)
          const rotX = (landmarks[0].y - 0.7) * 2;
          const rotY = (landmarks[0].x - 0.5) * 2;
          
          // 2. Calculate Scale from thumb tip (4) to pinky tip (20)
          const dx = landmarks[4].x - landmarks[20].x;
          const dy = landmarks[4].y - landmarks[20].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const scale = Math.max(1, Math.min(3, 1 + dist * 5));

          setHandData(true, scale, [rotY, rotX]);
        } else {
          setHandData(false, 1.5, [0, 0]);
        }
      });

      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await hands.send({ image: videoRef.current });
        },
        width: 320,
        height: 240
      });

      camera.start().then(() => setCameraActive(true));
    };

    // Note: We're assuming the scripts are available via CDN or standard module imports.
    // In a real production build, these would be in the package.json.
    initializeMediaPipe().catch(err => console.error("MediaPipe failed:", err));

    return () => {
      if (camera) camera.stop();
      if (hands) hands.close();
    };
  }, [setHandData]);

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <div className="relative overflow-hidden rounded-lg border-2 border-cyan-500/50 bg-black/80 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
        <video 
          ref={videoRef} 
          className="w-48 h-36 object-cover scale-x-[-1] opacity-60 mix-blend-screen"
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
        
        <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-[10px] border border-cyan-500/20">
          <Activity className={`w-3 h-3 ${cameraActive ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
          <span className="uppercase tracking-widest">{cameraActive ? 'FEED_LIVE' : 'FEED_OFFLINE'}</span>
        </div>
        
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cyan-950/20 backdrop-blur-sm">
            <CameraOff className="w-8 h-8 text-cyan-500/50 mb-2" />
            <span className="text-[10px] text-cyan-400/50">INITIALIZING SENSORS...</span>
          </div>
        )}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
    </div>
  );
};
