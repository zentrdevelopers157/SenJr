import React from 'react';
import CameraRealityLayer from './CameraRealityLayer';
import AmbientOverlay from './AmbientOverlay';
import AmbientRing from './AmbientRing';
import IntentCard from './IntentCard';
import { useArisSystem } from '../context/ArisContext';
import DebugPanel from './DebugPanel';

export default function ArisLiveView() {
  const { systemStatus } = useArisSystem();
  
  const isInitializing = systemStatus === 'INITIALIZING';

  return (
    <div className="relative w-full h-full overflow-hidden select-none font-sans bg-black">
      <CameraRealityLayer />
      
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isInitializing ? 'opacity-0' : 'opacity-100'}`}>
        {!isInitializing && (
          <>
            <AmbientOverlay />
            <AmbientRing />
            <IntentCard />
            
            {/* Extremely dark cinematic bezel wrapper */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] z-[45] mix-blend-overlay"></div>
          </>
        )}
      </div>

      {isInitializing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/90 backdrop-blur-xl transition-opacity duration-1000">
          <div className="w-[40px] h-[40px] border-[1px] border-white/10 border-t-white/30 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]"></div>
          <div className="text-[9px] tracking-[0.4em] text-white/30 font-light uppercase animate-pulse">
            Booting OS Array
          </div>
        </div>
      )}

      {import.meta.env.DEV && <DebugPanel />}
    </div>
  );
}
