import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const dropdownItems = [
  { label: 'Settings', href: '#/settings' },
  { label: 'Analytics', href: '#/analytics' },
];

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = user?.name ?? user?.email ?? 'Account';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setOpen(false);
  }

  function handleSignOut() {
    setOpen(false);
    logout();
  }

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`User menu for ${displayName}`}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform hover:scale-105"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center">
          {getInitials(displayName)}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700
            py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{displayName}</p>
            {user?.email && user.name && (
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            )}
          </div>
          {dropdownItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              aria-current={window.location.hash === item.href ? 'page' : undefined}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
            <button
              role="menuitem"
              data-testid="sign-out-btn"
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
