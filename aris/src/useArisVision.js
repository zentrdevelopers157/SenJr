import { useState, useEffect, useCallback, useRef } from 'react';

const POLLING_RATE = 5000;

export default function useArisVision(videoRef) {
  const [visionResult, setVisionResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scanCountRef = useRef(0);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    
    // Draw the video frame to the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get jpeg out of it
    return canvas.toDataURL('image/jpeg', 0.6);
  }, [videoRef]);

  const analyzeScene = useCallback(async () => {
    const apiKey = import.meta.env.VITE_ANTHROPIC_KEY;
    if (!apiKey || apiKey === 'PASTE_YOUR_KEY_HERE') {
      console.warn("No Anthropic API key. Skipping vision call.");
      return;
    }

    const base64Image = captureFrame();
    if (!base64Image) return;

    const base64Data = base64Image.split(',')[1];
    setIsScanning(true);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 400,
          system: "You are the vision engine of ARIS, a smart-glasses OS. Analyze the user's view. Return ONLY a pure JSON object, no markdown. The JSON must match this structure exactly: {\"category\": \"FOOD\"|\"ROAD\"|\"WORKSTATION\"|\"MEDICINE\"|\"BEVERAGE\"|\"UNKNOWN\", \"confidence\": number_between_0_100, \"leftTitle\": \"String\", \"leftText\": \"String\", \"rightTitle\": \"String\", \"rightCategory\": \"String\", \"rightImpact\": \"String\", \"centerMessage\": \"String\", \"centerColor\": \"text-white\"|\"text-aris-cyan\"|\"text-aris-red\", \"icon\": \"Scan\"|\"Activity\"|\"Coffee\"|\"Map\"|\"Eye\"|\"AlertTriangle\", \"type\": \"Neutral\"|\"Warning\"|\"Advisory\"|\"Guidance\"|\"Focus\"}",
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: base64Data
                  }
                },
                {
                  type: 'text',
                  text: 'Analyze the current environment and populate the ARIS HUD JSON.'
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;
      
      const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      const parsed = JSON.parse(jsonStr);
      
      scanCountRef.current += 1;
      setVisionResult({ ...parsed, totalScans: scanCountRef.current });
      setError(null);
    } catch (err) {
      console.error("[Vision Engine] Proxy Connection Error:", err);
      setError(err);
    } finally {
      setIsScanning(false);
    }
  }, [captureFrame]);

  useEffect(() => {
    const interval = setInterval(() => {
      // only trigger if we have an active video that is playing
      if (videoRef.current && !videoRef.current.paused && videoRef.current.readyState === 4) {
        analyzeScene();
      }
    }, POLLING_RATE);
    
    // initial analysis
    setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused && videoRef.current.readyState === 4) {
        analyzeScene();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [analyzeScene, videoRef]);

  return { visionResult, isScanning, error };
}
