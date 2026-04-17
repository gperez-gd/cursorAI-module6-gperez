import { useState, useRef, useEffect } from 'react';
import type { Author } from './types';
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

interface PostHeaderProps {
  author: Author;
  createdAt: string;
  isOwnPost: boolean;
  onDelete: () => void;
}

export default function PostHeader({ author, createdAt, isOwnPost, onDelete }: PostHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-start gap-3">
      <UserAvatar author={author} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{author.name}</p>
        <p className="text-xs text-gray-400">
          <span>{author.username}</span>
          <span className="mx-1">·</span>
          <time dateTime={createdAt}>{relativeTime(createdAt)}</time>
        </p>
      </div>

      <div ref={menuRef} className="relative shrink-0">
        <button
          onClick={() => { setMenuOpen(o => !o); setConfirmDelete(false); }}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Post options"
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20"
          >
            {isOwnPost ? (
              confirmDelete ? (
                <div className="px-3 py-2">
                  <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">Are you sure?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onDelete(); setMenuOpen(false); }}
                      role="menuitem"
                      className="flex-1 text-xs py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      role="menuitem"
                      className="flex-1 text-xs py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  role="menuitem"
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete post
                </button>
              )
            ) : (
              <button
                onClick={() => { console.log('Reported post'); setMenuOpen(false); }}
                role="menuitem"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Report post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
