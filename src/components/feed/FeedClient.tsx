'use client';

import { useState } from 'react';
import { createPost } from '@/app/actions/feed';

type Post = {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  likes: number;
  comments: number;
  tags?: string[];
  createdAt: string;
};

export function FeedClient({ initialPosts, userRole }: { initialPosts: Post[], userRole: string }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submitPost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setErrorMsg('');

    const res = await createPost(content);
    if (res.success) {
      // Optimistic update
      setPosts([{
        id: Math.random().toString(),
        authorName: 'You',
        authorRole: userRole === 'mentor' ? 'Mentor' : 'Student',
        content,
        likes: 0,
        comments: 0,
        tags: [],
        createdAt: new Date().toISOString()
      }, ...posts]);
      setContent('');
    } else {
      setErrorMsg(res.error || 'Failed to post');
    }
    setLoading(false);
  };

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="space-y-6">
      {/* Create Post Bar */}
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 shadow-lg">
        {errorMsg && <p className="text-red-400 text-sm mb-3 bg-red-400/10 p-2 rounded">{errorMsg}</p>}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Share something with the community..."
          className="w-full bg-transparent border-none outline-none resize-none text-text-primary placeholder:text-text-muted min-h-[80px]"
        />
        <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-2">
          <div className="flex gap-2 text-text-muted">
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors" title="Attach Image">📎</button>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors" title="Add Tag">🏷️</button>
          </div>
          <button 
            onClick={submitPost}
            disabled={loading || !content.trim()}
            className="px-6 py-2 bg-brand-blue hover:bg-blue-500 text-white font-bold rounded-full disabled:opacity-50 transition-colors"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="text-center py-16 bg-bg-card border border-border-subtle rounded-2xl">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-bold text-text-primary">Be the first to share something!</h3>
            <p className="text-text-muted text-sm mt-1">Start a discussion or share a study tip.</p>
          </div>
        )}

        {posts.map(post => {
          const isMentor = post.authorRole === 'Mentor';
          
          return (
            <div key={post.id} className="bg-bg-card border border-border-subtle rounded-2xl p-5 hover:border-border-subtle/80 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${isMentor ? 'bg-gradient-to-br from-orange-500 to-orange-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'}`}>
                  {getInitials(post.authorName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">{post.authorName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${isMentor ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' : 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'}`}>
                      {post.authorRole}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">
                    {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              
              <p className="text-text-primary/90 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                {post.content}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-6 pt-3 border-t border-border-subtle/50 text-text-muted text-sm font-semibold">
                <button className="flex items-center gap-1.5 hover:text-brand-orange transition-colors">
                  🔥 {post.likes}
                </button>
                <button className="flex items-center gap-1.5 hover:text-brand-blue transition-colors">
                  💬 {post.comments}
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto">
                  📌 Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
