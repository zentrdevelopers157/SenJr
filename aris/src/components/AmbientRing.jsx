import React from 'react';
import { useArisSystem } from '../context/ArisContext';

const AmbientRing = React.memo(function AmbientRing() {
  const { currentContext } = useArisSystem();

  let borderClass = "border-white/15";
  let shadowClass = "";

  if (currentContext.type === 'Warning' || currentContext.type === 'Alert') {
    borderClass = "border-aris-red/60";
    shadowClass = "shadow-[0_0_20px_rgba(255,51,51,0.5)]";
  } else if (currentContext.type === 'Advisory') {
    borderClass = "border-amber-400/50";
    shadowClass = "shadow-[0_0_15px_rgba(251,191,36,0.2)]";
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
      <div 
        className={`w-[40px] h-[40px] rounded-full border-[1.5px] ${borderClass} ${shadowClass} transition-colors duration-1000 ease-in-out`}
        style={{
          animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          transform: 'translateZ(0)'
        }}
      ></div>
    </div>
  );
});

export default AmbientRing;
