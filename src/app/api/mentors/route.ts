import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    
    // Fetch users with mentor role
    // In a real app, join with topics table if topic filter is provided
    let query;
    if (topic) {
      query = await sql`
        SELECT u.* FROM users u
        JOIN topics t ON u.id = t.user_id
        WHERE u.role = 'mentor' AND t.topic_name ILIKE ${'%' + topic + '%'};
      `;
    } else {
      query = await sql`
        SELECT * FROM users WHERE role = 'mentor';
      `;
    }

    return NextResponse.json(query.rows);
  } catch (error: any) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
