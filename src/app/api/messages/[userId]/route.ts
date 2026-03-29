import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId: otherUserId } = await params;

    // Fetch messages between current user and the other user
    // We order by created_at ascending for chat flow
    const { rows } = await sql`
      SELECT * FROM messages 
      WHERE (sender_id = ${currentUserId} AND receiver_id = ${otherUserId})
         OR (sender_id = ${otherUserId} AND receiver_id = ${currentUserId})
      ORDER BY created_at ASC;
    `;

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { receiver_id, content } = await req.json();

    const { rows } = await sql`
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES (${currentUserId}, ${receiver_id}, ${content})
      RETURNING *;
    `;

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
