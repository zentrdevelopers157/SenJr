import React, { useEffect } from 'react';
import { useArisSystem } from '../context/ArisContext';

const DebugPanel = React.memo(function DebugPanel() {
  const { systemStatus, currentContext, confidence, cameraStatus, triggerMockContext } = useArisSystem();
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        '1': 'UNKNOWN',
        '2': 'FOOD',
        '3': 'BEVERAGE',
        '4': 'ROAD',
        '5': 'WORKSTATION',
        '6': 'MEDICINE',
        '7': 'LOW_CONF'
      };
      if (keyMap[e.key]) {
        console.log(`[Diagnostic Menu] Injecting state: ${keyMap[e.key]}`);
        triggerMockContext(keyMap[e.key]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerMockContext]);

  return (
    <div className="absolute top-4 left-4 z-[999] bg-black/80 border border-aris-cyan/30 p-4 rounded text-[10px] font-mono text-aris-cyan/80 pointer-events-auto backdrop-blur-md opacity-0 hover:opacity-100 transition-opacity focus-within:opacity-100">
      <div className="font-bold border-b border-aris-cyan/30 pb-2 mb-2 tracking-widest">ARIS DEV DIAGNOSTICS</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <span className="text-white/50">SYS_STATE:</span> 
        <span className={systemStatus === 'SCANNING' ? 'animate-pulse text-white' : ''}>{systemStatus}</span>
        
        <span className="text-white/50">CAM_STATE:</span> 
        <span className={cameraStatus === 'ERROR' ? 'text-aris-red/80' : 'text-aris-cyan'}>{cameraStatus}</span>
        
        <span className="text-white/50">CUR_CTX:</span> 
        <span>{currentContext.id}</span>
        
        <span className="text-white/50">CONFIDENCE:</span> 
        <span>{confidence}%</span>
      </div>
      <div className="mt-4 pt-4 border-t border-aris-cyan/20">
        <div className="text-[9px] text-white/50 mb-2 uppercase tracking-widest">Inject Context Override (1-7)</div>
        <div className="flex flex-wrap gap-1.5 max-w-[150px]">
          {[1,2,3,4,5,6,7].map(k => (
            <button 
              key={k}
              onClick={() => {
                const map = {1:'UNKNOWN',2:'FOOD',3:'BEVERAGE',4:'ROAD',5:'WORKSTATION',6:'MEDICINE', 7:'LOW_CONF'};
                triggerMockContext(map[k]);
              }}
              className="w-6 h-6 flex items-center justify-center bg-aris-cyan/10 hover:bg-aris-cyan/40 hover:text-white rounded border border-aris-cyan/20 transition-colors cursor-pointer"
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default DebugPanel;
