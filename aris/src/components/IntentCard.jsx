import React, { useEffect, useState } from 'react';
import { useArisSystem } from '../context/ArisContext';

const IntentCard = React.memo(function IntentCard() {
  const { currentContext, confidence, dwellCount, systemStatus } = useArisSystem();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Intent triggers logic
    const isHighConf = confidence > 75;
    const isWarning = ['Warning', 'Alert', 'Advisory'].includes(currentContext.type);
    const hasDwell = dwellCount > 1; // 1.5s stability heuristic per prompt requirement

    if ((isHighConf && currentContext.id !== 'UNKNOWN') || isWarning || hasDwell) {
      setVisible(true);
      // Auto-dismiss if no fresh intent keeps it alive
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [currentContext, confidence, dwellCount, systemStatus]);

  if (!visible || !currentContext || currentContext.id === 'UNKNOWN') return null;

  // Render Logic: Critical paths
  if (currentContext.type === 'Warning' || currentContext.type === 'Alert') {
    return (
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 text-center z-50 pointer-events-none transition-opacity duration-400 ease-in-out opacity-100">
        <div className="text-aris-red tracking-[0.2em] font-light text-sm drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
          {currentContext.centerMessage || "CRITICAL ALERT"}
        </div>
        {currentContext.type === 'Alert' && (
          <div className="text-white/70 text-[10px] tracking-widest mt-2 max-w-xs drop-shadow-md">
            {currentContext.leftText}
          </div>
        )}
      </div>
    );
  }

  // Soft advisory remains completely minimal visual glow on ring without text unless sure
  if (currentContext.type === 'Advisory' && confidence <= 85) return null;

  // Gaze Dwell Progressive surfacing logic
  return (
    <div className="absolute top-1/2 left-[55%] -translate-y-1/2 ml-8 z-50 pointer-events-none transition-opacity duration-400 ease-in-out opacity-100">
      <div className="px-4 py-2 bg-black/10 backdrop-blur-md rounded-sm border-l-[1px] border-white/20 shadow-xl">
        {/* Dwell 1: Label only */}
        <div className="text-white/90 text-sm tracking-widest font-light drop-shadow-sm">
          {currentContext.rightCategory || currentContext.leftTitle} 
        </div>
        
        {/* Dwell 2: Key stat */}
        {dwellCount >= 2 && (
          <div className="text-aris-cyan/80 text-[10px] tracking-[0.2em] mt-1.5 uppercase drop-shadow-sm">
            {currentContext.rightImpact || currentContext.leftTitle} 
          </div>
        )}
        
        {/* Dwell 3: Full Context */}
        {dwellCount >= 3 && (
          <div className="text-white/50 text-[10px] tracking-wide mt-2 max-w-[200px] leading-relaxed">
            {currentContext.leftText}
          </div>
        )}
      </div>
    </div>
  );
});

export default IntentCard;
