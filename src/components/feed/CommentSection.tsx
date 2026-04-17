import { useState } from 'react';
import type { Comment, Author } from './types';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUser: Author;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
}

const INITIAL_SHOW = 3;

export default function CommentSection({ postId, comments, currentUser, onAddComment, onLikeComment }: CommentSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? comments : comments.slice(0, INITIAL_SHOW);
  const remaining = comments.length - INITIAL_SHOW;

  return (
    <div
      className="mt-3 space-y-3"
      aria-live="polite"
      aria-label="Comments section"
    >
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">Be the first to comment.</p>
      ) : (
        <>
          {visible.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={id => onLikeComment(postId, id)}
            />
          ))}
          {!showAll && remaining > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all {comments.length} comments
            </button>
          )}
        </>
      )}
      <CommentInput currentUser={currentUser} onSubmit={content => onAddComment(postId, content)} />
    </div>
  );
}
