import { useRef, useState } from 'react';
import type { Author } from './types';
import UserAvatar from './UserAvatar';

interface CommentInputProps {
  currentUser: Author;
  onSubmit: (content: string) => void;
}

export default function CommentInput({ currentUser, onSubmit }: CommentInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3" aria-label="Add a comment">
      <UserAvatar author={currentUser} size="sm" />
      <label htmlFor="comment-input" className="sr-only">Write a comment</label>
      <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
        <input
          id="comment-input"
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Write a comment…"
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send comment"
          aria-disabled={!value.trim()}
          className="shrink-0 text-primary disabled:text-gray-300 dark:disabled:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  );
}
