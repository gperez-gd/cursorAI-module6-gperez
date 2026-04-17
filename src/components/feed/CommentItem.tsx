import type { Comment } from './types';
import UserAvatar from './UserAvatar';

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
}

export default function CommentItem({ comment, onLike }: CommentItemProps) {
  return (
    <div className="flex gap-2.5">
      <UserAvatar author={comment.author} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2">
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{comment.author.name}</p>
          <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">{comment.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 pl-3">
          <span className="text-xs text-gray-400">{relativeTime(comment.createdAt)}</span>
          <button
            onClick={() => onLike(comment.id)}
            aria-pressed={comment.likedByCurrentUser}
            className={`flex items-center gap-1 text-xs font-medium transition-colors
              ${comment.likedByCurrentUser ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
          >
            <svg className="w-3.5 h-3.5" fill={comment.likedByCurrentUser ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {comment.likeCount > 0 && comment.likeCount}
          </button>
        </div>
      </div>
    </div>
  );
}
