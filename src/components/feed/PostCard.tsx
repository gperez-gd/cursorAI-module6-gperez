import { useState } from 'react';
import type { Post, Author } from './types';
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  currentUser: Author;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onShare: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onToggleComments: (postId: string) => void;
}

export default function PostCard({
  post, currentUser, onLike, onDelete, onShare, onAddComment, onLikeComment, onToggleComments,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.content.length > 200;

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700
        hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      aria-label={`Post by ${post.author.name}`}
    >
      <div className="p-4">
        <PostHeader
          author={post.author}
          createdAt={post.createdAt}
          isOwnPost={post.author.id === currentUser.id}
          onDelete={() => onDelete(post.id)}
        />

        {/* Content */}
        <div className="mt-3">
          <p className={`text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed
            ${!expanded && isLong ? 'line-clamp-3' : ''}`}
          >
            {post.content}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-xs text-primary font-medium mt-1 hover:underline"
            >
              {expanded ? 'See less' : 'See more'}
            </button>
          )}
        </div>

        {/* Media */}
        {post.mediaUrl && (
          <div className="mt-3">
            <PostMedia mediaUrl={post.mediaUrl} altText={`Image shared by ${post.author.name}`} />
          </div>
        )}

        <PostActions
          likeCount={post.likeCount}
          likedByCurrentUser={post.likedByCurrentUser}
          commentCount={post.commentCount}
          shareCount={post.shareCount}
          onLike={() => onLike(post.id)}
          onComment={() => onToggleComments(post.id)}
          onShare={() => onShare(post.id)}
        />

        {post.isCommentsOpen && (
          <CommentSection
            postId={post.id}
            comments={post.comments}
            currentUser={currentUser}
            onAddComment={onAddComment}
            onLikeComment={onLikeComment}
          />
        )}
      </div>
    </article>
  );
}
