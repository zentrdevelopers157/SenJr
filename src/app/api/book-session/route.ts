import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId: studentClerkId } = await auth();
    if (!studentClerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { mentor_id, scheduled_at } = await req.json();

    // 1. Get internal user IDs from Clerk IDs
    const studentRes = await sql`SELECT id FROM users WHERE clerk_id = ${studentClerkId}`;
    const studentId = studentRes.rows[0]?.id;
    
    // 2. Create Daily.co room
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const roomRes = await fetch(`${siteUrl}/api/create-room`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionName: `senjr-${studentId}-${mentor_id}-${Date.now()}` }),
    });
    
    const roomData = await roomRes.json();
    if (!roomRes.ok) throw new Error(roomData.error || 'Failed to create video room');

    // 3. Create session in Postgres
    const { rows } = await sql`
      INSERT INTO sessions (mentor_id, student_id, scheduled_at, status, room_id)
      VALUES (${mentor_id}, ${studentId}, ${scheduled_at}, 'confirmed', ${roomData.room_name})
      RETURNING *;
    `;

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Error booking session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
