import React, { useState, useEffect } from 'react';
import { useArisSystem } from '../context/ArisContext';

const WEATHER_EMOJI_MAP = {
  0: '☀️',
  1: '⛅', 2: '⛅', 3: '⛅',
  45: '🌫️', 48: '🌫️',
  51: '🌧️', 53: '🌧️', 55: '🌧️', 56: '🌧️', 57: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️',
  71: '❄️', 73: '❄️', 75: '❄️', 77: '❄️',
  80: '🌦️', 81: '🌦️', 82: '🌦️',
  95: '⛈️'
};

const AmbientOverlay = React.memo(function AmbientOverlay() {
  const { systemStatus, cameraStatus } = useArisSystem();

  const [time, setTime] = useState('');
  const [weather, setWeather] = useState('☁️ --°C  Howrah');
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [micStatus, setMicStatus] = useState('prompt');
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    updateTime();
    const timer = setInterval(updateTime, 10000); 
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=22.58&longitude=88.34&current=temperature_2m,weathercode')
      .then(res => res.json())
      .then(data => {
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weathercode;
        const emoji = WEATHER_EMOJI_MAP[code] || '☁️';
        setWeather(`${emoji} ${temp}°C  Howrah`);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' }).then(result => {
        setMicStatus(result.state);
        result.onchange = () => setMicStatus(result.state);
      }).catch(() => setMicStatus('denied'));
    }

    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        setBatteryLevel(Math.round(bat.level * 100));
        setIsCharging(bat.charging);
        
        bat.onlevelchange = () => {
          setBatteryLevel(Math.round(bat.level * 100));
          setIsCharging(bat.charging);
        };
        bat.onchargingchange = () => {
          setIsCharging(bat.charging);
        };
      });
    }
  }, []);

  const isScanning = systemStatus === 'SCANNING';
  
  // "entire bar fades to 8% opacity. When scan completes -> bar fades back to 35% over 600ms"
  const barWrapperOpacity = isScanning ? 'opacity-[0.08]' : 'opacity-[0.35]';

  return (
    <div 
      className={`absolute top-0 w-full z-50 pointer-events-none select-none transition-opacity ease-in-out ${barWrapperOpacity}`}
      style={{ transitionDuration: '600ms' }}
    >
      {/* Premium OS Status Bar constraints: No backgrounds, flex justify-between */}
      <div className="w-full flex justify-between items-center px-6 py-4">
        
        {/* Top Left: Weather | Font: 11px, opacity 35% (derived implicitly from wrapper), letter-spacing: 0.08em */}
        <div className="text-[11px] text-white tracking-[0.08em] whitespace-nowrap font-sans">
          {weather}
        </div>

        {/* Top Center: Time | Font: 12px, opacity 30%. (0.30 target / 0.35 wrapper = ~0.85 rel opacity) */}
        <div className="absolute left-1/2 -translate-x-1/2 text-[12px] text-white opacity-[0.85] whitespace-nowrap font-sans">
          {time}
        </div>

        {/* Top Right: Status Matrix | All icons 10px, opacity 35% (wrapper derived), spacing 10px */}
        <div className="flex gap-[10px] items-center text-[10px] whitespace-nowrap font-sans">
          <span className={micStatus === 'denied' ? 'text-red-400 drop-shadow-[0_0_2px_rgba(255,0,0,0.8)]' : 'text-white'}>
            🎙️
          </span>
          <span className={isOnline ? 'text-green-400 drop-shadow-[0_0_2px_rgba(34,197,94,0.8)]' : 'text-red-500'}>
            📶
          </span>
          <span className="text-white">
            {isCharging ? `⚡${batteryLevel || 0}%` : `${batteryLevel || 0}% 🔋`}
          </span>
          <span className={isScanning ? 'text-aris-cyan drop-shadow-[0_0_3px_rgba(0,255,255,1)]' : 'text-white'}>
            {cameraStatus === 'ACTIVE' && isScanning ? '◉' : '○'}
          </span>
        </div>
      </div>

      {/* Polish: Add a single hairline — 1px, 8% opacity white — running horizontally below the status bar */}
      <div className="w-full h-[1px] bg-white opacity-[0.23]"></div>
      {/* Nothing else. */}
    </div>
  );
});

export default AmbientOverlay;
