import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' })); // Support base64 image strings

app.post('/api/scan', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is strictly required.' });
    }

    const apiKey = process.env.ANTHROPIC_KEY;
    if (!apiKey || apiKey === 'PASTE_YOUR_KEY_HERE') {
      return res.status(500).json({ error: 'Server ANTHROPIC_KEY is missing or unconfigured in .env.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
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
                  data: imageBase64
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
    
    // Scrape cleanly in case haiku added markdown blocks
    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonStr);
    
    res.json(parsed);
  } catch (error) {
    console.error('[Base Station] API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`[ARIS Base Station] Vision Security Proxy listening on port ${port}`);
});
