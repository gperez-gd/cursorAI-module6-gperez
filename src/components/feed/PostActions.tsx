import { useState } from 'react';

interface PostActionsProps {
  likeCount: number;
  likedByCurrentUser: boolean;
  commentCount: number;
  shareCount: number;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export default function PostActions({
  likeCount, likedByCurrentUser, commentCount, shareCount,
  onLike, onComment, onShare,
}: PostActionsProps) {
  const [likeAnim, setLikeAnim] = useState(false);

  function handleLike() {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 200);
    onLike();
  }

  return (
    <div className="flex items-center gap-1 pt-2 border-t border-gray-100 dark:border-gray-700">
      {/* Like */}
      <button
        onClick={handleLike}
        aria-label={likedByCurrentUser ? 'Unlike post' : 'Like post'}
        aria-pressed={likedByCurrentUser}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
          ${likeAnim ? 'scale-125' : 'scale-100'}
          ${likedByCurrentUser
            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
      >
        <svg className="w-5 h-5" fill={likedByCurrentUser ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>{likeCount > 0 ? likeCount : ''}</span>
      </button>

      {/* Comment */}
      <button
        onClick={onComment}
        aria-label="Toggle comments"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400
          hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>{commentCount > 0 ? commentCount : ''}</span>
      </button>

      {/* Share */}
      <button
        onClick={onShare}
        aria-label="Share post"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400
          hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>{shareCount > 0 ? shareCount : ''}</span>
      </button>
    </div>
  );
}
