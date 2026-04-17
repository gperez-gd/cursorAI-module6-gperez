import { useState, useCallback } from 'react';
import type { FeedState, Post, Comment } from './types';
import { FEED_STORAGE_KEY, FEED_VERSION_KEY, FEED_VERSION, CURRENT_USER } from './types';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import InfiniteScrollTrigger from './InfiniteScrollTrigger';
import { useToast } from '../ui/ToastProvider';

const MOCK_AUTHORS = [
  { id: 'u1', name: 'Sarah Chen', username: '@sarah_chen' },
  { id: 'u2', name: 'Mike Rodriguez', username: '@mike_dev' },
  { id: 'u3', name: 'Jane Williams', username: '@jane_w' },
  { id: 'u4', name: 'David Kim', username: '@dkim' },
];

function makeMockPost(index: number): Post {
  const author = MOCK_AUTHORS[index % MOCK_AUTHORS.length];
  const createdAt = new Date(Date.now() - index * 3600000 * 3).toISOString();
  return {
    id: `post-${Date.now()}-${index}`,
    author,
    content: [
      'Just shipped a major feature update! 🚀 The new dashboard is live and looking amazing. Check it out!',
      'Working on some exciting new animations for the UI. TypeScript + Framer Motion is such a joy to work with.',
      'Hot take: the best part of React 19 is the improved hydration error messages. Finally!',
      'Just finished a deep dive into Tailwind CSS v4. The new CSS-first configuration is a game changer.',
      'Building in public: Week 3 update. We hit 500 users this week! 🎉 Thank you all for the support.',
    ][index % 5],
    mediaUrl: index % 3 === 0 ? `https://images.unsplash.com/photo-${['1551650975-87deedd944c3', '1498050108023-c5249f4df085', '1555066931-bf19f8fd1085'][index % 3]}?w=600&h=400&fit=crop` : undefined,
    createdAt,
    likeCount: Math.floor(Math.random() * 100),
    likedByCurrentUser: false,
    commentCount: 0,
    shareCount: Math.floor(Math.random() * 20),
    comments: [],
    isCommentsOpen: false,
  };
}

const SEED_POSTS: Post[] = Array.from({ length: 6 }, (_, i) => makeMockPost(i));

function loadFeed(): FeedState {
  try {
    const version = localStorage.getItem(FEED_VERSION_KEY);
    if (version !== FEED_VERSION) throw new Error('version mismatch');
    const raw = localStorage.getItem(FEED_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FeedState;
  } catch {
    console.warn('[Feed] Failed to load state, using seed data.');
  }
  return { posts: SEED_POSTS, page: 1, hasMore: true, isLoading: false };
}

function saveFeed(state: FeedState) {
  try {
    localStorage.setItem(FEED_VERSION_KEY, FEED_VERSION);
    localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function Feed() {
  const { addToast } = useToast();
  const [feed, setFeedRaw] = useState<FeedState>(loadFeed);

  function setFeed(next: FeedState | ((prev: FeedState) => FeedState)) {
    setFeedRaw(prev => {
      const updated = typeof next === 'function' ? next(prev) : next;
      saveFeed(updated);
      return updated;
    });
  }

  function handleCreatePost(content: string, mediaUrl?: string) {
    const newPost: Post = {
      id: crypto.randomUUID(),
      author: CURRENT_USER,
      content,
      mediaUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByCurrentUser: false,
      commentCount: 0,
      shareCount: 0,
      comments: [],
      isCommentsOpen: false,
    };
    setFeed(prev => ({ ...prev, posts: [newPost, ...prev.posts] }));
    addToast('success', 'Post published!');
  }

  function handleLike(postId: string) {
    setFeed(prev => ({
      ...prev,
      posts: prev.posts.map(p =>
        p.id === postId
          ? {
              ...p,
              likedByCurrentUser: !p.likedByCurrentUser,
              likeCount: p.likedByCurrentUser ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      ),
    }));
  }

  function handleDelete(postId: string) {
    setFeed(prev => ({ ...prev, posts: prev.posts.filter(p => p.id !== postId) }));
    addToast('info', 'Post deleted');
  }

  async function handleShare(postId: string) {
    const url = `https://app.local/posts/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback — clipboard not available
    }
    setFeed(prev => ({
      ...prev,
      posts: prev.posts.map(p => p.id === postId ? { ...p, shareCount: p.shareCount + 1 } : p),
    }));
    addToast('success', 'Link copied!');
  }

  function handleAddComment(postId: string, content: string) {
    const comment: Comment = {
      id: crypto.randomUUID(),
      postId,
      author: CURRENT_USER,
      content,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      likedByCurrentUser: false,
    };
    setFeed(prev => ({
      ...prev,
      posts: prev.posts.map(p =>
        p.id === postId
          ? { ...p, comments: [...p.comments, comment], commentCount: p.commentCount + 1 }
          : p
      ),
    }));
  }

  function handleLikeComment(postId: string, commentId: string) {
    setFeed(prev => ({
      ...prev,
      posts: prev.posts.map(p =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map(c =>
                c.id === commentId
                  ? {
                      ...c,
                      likedByCurrentUser: !c.likedByCurrentUser,
                      likeCount: c.likedByCurrentUser ? c.likeCount - 1 : c.likeCount + 1,
                    }
                  : c
              ),
            }
          : p
      ),
    }));
  }

  function handleToggleComments(postId: string) {
    setFeed(prev => ({
      ...prev,
      posts: prev.posts.map(p =>
        p.id === postId ? { ...p, isCommentsOpen: !p.isCommentsOpen } : p
      ),
    }));
  }

  const handleLoadMore = useCallback(async () => {
    if (feed.isLoading || !feed.hasMore) return;
    setFeed(prev => ({ ...prev, isLoading: true }));
    await new Promise(res => setTimeout(res, 1200));
    const nextPage = feed.page + 1;
    const newPosts = Array.from({ length: 4 }, (_, i) => makeMockPost(feed.posts.length + i));
    setFeed(prev => ({
      ...prev,
      posts: [...prev.posts, ...newPosts],
      page: nextPage,
      hasMore: nextPage < 5,
      isLoading: false,
    }));
  }, [feed.isLoading, feed.hasMore, feed.page, feed.posts.length]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <CreatePost currentUser={CURRENT_USER} onSubmit={handleCreatePost} />

      <section aria-label="Social feed">
        <div className="space-y-4">
          {feed.posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={CURRENT_USER}
              onLike={handleLike}
              onDelete={handleDelete}
              onShare={handleShare}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onToggleComments={handleToggleComments}
            />
          ))}
        </div>

        <div className="mt-4">
          <InfiniteScrollTrigger
            hasMore={feed.hasMore}
            isLoading={feed.isLoading}
            onLoadMore={handleLoadMore}
          />
        </div>
      </section>
    </div>
  );
}
