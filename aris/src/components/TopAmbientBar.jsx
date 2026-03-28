import React, { useState, useEffect } from 'react';

const TopAmbientBar = React.memo(function TopAmbientBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-4 right-6 text-[10px] text-white/40 font-light tracking-[0.2em] pointer-events-none z-50 mix-blend-screen transition-opacity duration-1000">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
});

export default TopAmbientBar;
