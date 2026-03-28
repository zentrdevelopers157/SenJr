import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CONTEXTS } from './DynamicContextEngine';
import useArisVision from '../useArisVision';

const ArisStateContext = createContext(null);

export function ArisProvider({ children }) {
  const videoRef = useRef(null);
  
  const [systemStatus, setSystemStatus] = useState('INITIALIZING'); 
  const [currentContext, setCurrentContext] = useState(CONTEXTS.UNKNOWN);
  const [confidence, setConfidence] = useState(0);
  const [cameraStatus, setCameraStatus] = useState('INITIALIZING'); 
  
  // High-level intent tracking engine (Gaze Dwell System)
  const [dwellCount, setDwellCount] = useState(0);
  const [lastContextId, setLastContextId] = useState(null);
  const [totalScans, setTotalScans] = useState(0);

  const { visionResult, isScanning: isVisionScanning, error } = useArisVision(videoRef);

  useEffect(() => {
    let isMounted = true;
    
    const bootSequence = async () => {
      setSystemStatus('INITIALIZING');
      console.log("[ARIS Core] Boot sequence initiated...");
      await new Promise(r => setTimeout(r, 1200));
      
      if (!isMounted) return;
      setSystemStatus('SCANNING');
      await new Promise(r => setTimeout(r, 1500));
      
      if (!isMounted) return;
      setSystemStatus('STABLE');
      setConfidence(85);
      setCurrentContext(CONTEXTS.UNKNOWN);
      setLastContextId('UNKNOWN');
      setDwellCount(1);
      console.log("[ARIS Core] OS booted. Intent engine active.");
    };

    bootSequence();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (systemStatus === 'INITIALIZING') return; 

    if (isVisionScanning) {
      setSystemStatus('SCANNING');
    } else if (visionResult) {
      setTotalScans(visionResult.totalScans || totalScans);
      const newId = visionResult.category || 'UNKNOWN';
      const parsedContext = {
        id: newId,
        type: visionResult.type || 'Neutral',
        leftTitle: visionResult.leftTitle || 'Environmental Context',
        leftText: visionResult.leftText || 'Analyzing...',
        rightTitle: visionResult.rightTitle || 'Object Analysis',
        rightConfidence: `${visionResult.confidence || 0}%`,
        rightCategory: visionResult.rightCategory || 'Unknown',
        rightImpact: visionResult.rightImpact || 'Low',
        centerMessage: visionResult.centerMessage || '',
        centerColor: visionResult.centerColor || 'text-white',
        icon: visionResult.icon || 'Scan'
      };

      // Gaze Dwell calculation (Tracks 3 consecutive stable inputs as attention locking)
      if (newId === lastContextId && newId !== 'UNKNOWN') {
        setDwellCount(prev => prev + 1);
      } else {
        setDwellCount(1);
        setLastContextId(newId);
      }

      if (visionResult.confidence < 40) {
        setSystemStatus('LOW_CONFIDENCE');
        setConfidence(visionResult.confidence || 0);
        setCurrentContext({
          ...CONTEXTS.LOW_CONF,
          rightConfidence: `< 40%`,
        });
      } else {
        setSystemStatus('STABLE');
        setConfidence(visionResult.confidence);
        setCurrentContext(parsedContext);
      }
    }
  }, [visionResult, isVisionScanning]); 

  const triggerMockContext = useCallback((contextId) => {
    if (systemStatus === 'INITIALIZING') return;
    
    console.log(`[Intent Engine] Force override to test Gaze Dwell tracking: ${contextId}`);
    setSystemStatus('SCANNING');
    setConfidence(Math.floor(Math.random() * 20) + 10);
    
    setTimeout(() => {
      const mockResult = CONTEXTS[contextId] || CONTEXTS.UNKNOWN;
      
      if (contextId === lastContextId && contextId !== 'UNKNOWN') {
        setDwellCount(prev => prev + 1);
      } else {
        setDwellCount(1);
        setLastContextId(contextId);
      }

      setCurrentContext(mockResult);
      if (contextId === 'LOW_CONF') {
        setSystemStatus('LOW_CONFIDENCE');
        setConfidence(Math.floor(Math.random() * 15) + 10);
      } else {
        setSystemStatus('STABLE');
        setConfidence(Math.floor(Math.random() * 10) + 90);
      }
    }, 900);
  }, [systemStatus, lastContextId]);

  const value = {
    systemStatus,
    currentContext,
    confidence,
    cameraStatus,
    setCameraStatus,
    videoRef, 
    triggerMockContext,
    dwellCount,
    totalScans
  };

  return (
    <ArisStateContext.Provider value={value}>
      {children}
    </ArisStateContext.Provider>
  );
}

export const useArisSystem = () => {
    const context = useContext(ArisStateContext);
    if (!context) throw new Error("useArisSystem must be used within ArisProvider");
    return context;
};
