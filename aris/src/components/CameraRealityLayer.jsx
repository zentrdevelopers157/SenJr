import React, { useEffect, useRef } from 'react';
import { useArisSystem } from '../context/ArisContext';

const CameraRealityLayer = React.memo(function CameraRealityLayer() {
  const { cameraStatus, setCameraStatus, videoRef } = useArisSystem();
  
  // Ensure we NEVER re-run the mount pipeline to avoid tearing down the active webcam.
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    let activeStream = null;

    async function initCamera() {
      if (isInitialized.current) return;
      isInitialized.current = true;
      
      console.log("[ARIS Camera] Acquiring media devices...");
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not available');
        setCameraStatus('ERROR');
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        });
        
        console.log("[ARIS Camera] Stream acquired natively.");
        activeStream = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // IMPORTANT: Must play the promise directly
          await videoRef.current.play();
          setCameraStatus('ACTIVE');
          console.log("[ARIS Camera] Active and successfully rendering to layer.");
        }
      } catch (err) {
        console.error("[ARIS Camera] Fatal Initialization Error:", err);
        setCameraStatus('ERROR');
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        console.log("[ARIS Camera] Unmounting OS. Releasing stream tracks.");
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array prevents loops on cameraStatus changes

  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-[#0a0f12]">
      {cameraStatus === 'ERROR' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0a0f12] to-[#041a15]">
          <div className="text-white/30 text-xs tracking-[0.5em] uppercase mb-4 opacity-50">
            [ Sensor Array Offline ]
          </div>
          <div className="text-aris-cyan/40 text-[10px] tracking-widest uppercase animate-pulse">
            Simulating Ambient Environment
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-1000 mix-blend-screen ${cameraStatus === 'ACTIVE' ? 'opacity-70' : 'opacity-0'}`}
        style={{ transform: 'translateZ(0)' }}
      />
      
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none opacity-80 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black transition-opacity duration-1000 via-black/40 to-black opacity-60 pointer-events-none"></div>
    </div>
  );
});

export default CameraRealityLayer;
