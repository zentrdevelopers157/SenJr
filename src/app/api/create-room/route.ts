import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (!DAILY_API_KEY) {
      console.error('DAILY_API_KEY is missing');
      return NextResponse.json({ error: 'Video provider configuration missing' }, { status: 500 });
    }

    const { sessionName } = await req.json();

    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: sessionName || `senjr-${Math.random().toString(36).substring(7)}`,
        privacy: 'public', // Can use 'private' and generate tokens later for more security
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          start_video_off: false,
          start_audio_off: false,
          exp: Math.floor(Date.now() / 1000) + 3600 * 2, // Expire in 2 hours
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to create room' }, { status: response.status });
    }

    return NextResponse.json({ 
      room_url: data.url,
      room_name: data.name 
    });
  } catch (error: any) {
    console.error('Daily.co error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
