'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const SEED_POSTS = [
  {
    id: 'seed-1',
    authorName: 'Arjun Sharma',
    authorRole: 'Mentor',
    content: 'POV: You\'re studying at 2am and suddenly everything clicks 🤯 This is what 6 months of consistent practice looks like. Keep grinding!',
    likes: 847,
    comments: 134,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'seed-2',
    authorName: 'Priya Nair',
    authorRole: 'Mentor',
    content: 'When your senior explains in 10 mins what coaching couldn\'t in 10 months 😭 Drop your toughest Bio question below 👇',
    likes: 1200,
    comments: 289,
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: 'seed-3',
    authorName: 'Rohan Mehta',
    authorRole: 'Mentor',
    content: 'CAT prep tip: Master DILR pacing first. Don\'t solve everything. Solve the right sets. 📈',
    likes: 540,
    comments: 45,
    createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
  }
];

export async function getPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('feed_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    if (error && error.code !== '42P01') {
      console.error('Error fetching posts:', error);
    }
    // Return seed posts if table missing or empty
    return SEED_POSTS;
  }

  return data.map(p => ({
    id: p.id,
    authorName: p.author_name,
    authorRole: p.author_role,
    content: p.content,
    likes: p.likes || 0,
    comments: p.comments || 0,
    createdAt: p.created_at
  }));
}

export async function createPost(content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Must be logged in to post.' };
  }

  const payload = {
    author_id: user.id,
    author_name: user.user_metadata?.full_name || 'Anonymous',
    author_role: user.user_metadata?.role === 'mentor' ? 'Mentor' : 'Student',
    content,
    likes: 0,
    comments: 0,
    created_at: new Date().toISOString()
  };

  const { error } = await supabase.from('feed_posts').insert(payload);

  if (error) {
    if (error.code === '42P01') {
      console.warn('feed_posts table missing! Graceful fail.');
      return { success: false, error: 'Database schema update pending. Cannot save live post yet.' };
    }
    return { success: false, error: error.message };
  }

  revalidatePath('/feed');
  return { success: true };
}
