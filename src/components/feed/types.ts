export type ReactionType = '👍' | '❤️' | '😂' | '😮' | '😢' | '😡';

export interface Author {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  createdAt: string;
  likeCount: number;
  likedByCurrentUser: boolean;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  commentCount: number;
  shareCount: number;
  comments: Comment[];
  isCommentsOpen: boolean;
}

export interface FeedState {
  posts: Post[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
}

export interface NewPostDraft {
  content: string;
  mediaPreviewUrl?: string;
}

export const FEED_STORAGE_KEY = 'social_feed_state';
export const FEED_VERSION_KEY = 'social_feed_version';
export const FEED_VERSION = '1';

export const CURRENT_USER: Author = {
  id: 'current-user',
  name: 'Alex Johnson',
  username: '@alex_johnson',
};
