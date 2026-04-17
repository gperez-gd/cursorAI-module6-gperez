import { useRef, useState } from 'react';
import type { Author } from './types';
import UserAvatar from './UserAvatar';

interface CreatePostProps {
  currentUser: Author;
  onSubmit: (content: string, mediaPreviewUrl?: string) => void;
}

const MAX_CHARS = 280;
const WARN_AT = 260;

export default function CreatePost({ currentUser, onSubmit }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit = content.trim().length > 0 || !!mediaPreviewUrl;
  const charCount = content.length;
  const charWarn = charCount >= WARN_AT;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaPreviewUrl(url);
  }

  function removeMedia() {
    setMediaPreviewUrl(undefined);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    await new Promise(res => setTimeout(res, 500));
    onSubmit(content.trim(), mediaPreviewUrl);
    setContent('');
    setMediaPreviewUrl(undefined);
    if (fileRef.current) fileRef.current.value = '';
    setSubmitting(false);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-4 sticky top-0 z-10">
      <form onSubmit={handleSubmit} aria-label="Create new post">
        <div className="flex gap-3">
          <UserAvatar author={currentUser} size="md" />
          <div className="flex-1 min-w-0">
            <label htmlFor="new-post-content" className="sr-only">What's on your mind?</label>
            <textarea
              id="new-post-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={MAX_CHARS}
              rows={content ? 3 : 1}
              placeholder="What's on your mind?"
              className="w-full resize-none bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-2.5 text-sm
                text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none
                focus:ring-2 focus:ring-primary transition-all duration-150"
            />

            {content.length > 0 && (
              <p className={`text-right text-xs mt-1 ${charWarn ? 'text-red-500' : 'text-gray-400'}`}>
                {charCount}/{MAX_CHARS}
              </p>
            )}

            {mediaPreviewUrl && (
              <div className="relative mt-2">
                <img
                  src={mediaPreviewUrl}
                  alt="Post image preview"
                  className="w-full max-h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeMedia}
                  aria-label="Remove image"
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  id="post-image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                  aria-label="Attach image"
                />
                <label
                  htmlFor="post-image"
                  className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 text-xs font-medium
                    text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Photo
                </label>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                aria-disabled={!canSubmit || submitting}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary rounded-xl
                  hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {submitting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
