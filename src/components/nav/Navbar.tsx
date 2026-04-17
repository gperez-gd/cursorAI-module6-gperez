import { useState, useEffect, useRef, useCallback } from 'react';
import type { NavbarProps, NavItem } from '../../types/nav';
import MobileMenu from './MobileMenu';
import UserDropdown from './UserDropdown';
import { getActiveLinkClasses } from '../../utils/activeLink';

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Products', href: '#/products' },
  { label: 'Dashboard', href: '#/dashboard' },
  { label: 'Analytics', href: '#/analytics' },
  { label: 'Kanban', href: '#/kanban' },
  { label: 'Feed', href: '#/feed' },
];

export default function Navbar({ items = DEFAULT_NAV_ITEMS, onSearch }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [, forceUpdate] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Re-render on hash change so active link highlights update
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // Keep a ref so the debounce timeout always calls the latest onSearch,
  // regardless of when the closure was captured.
  const onSearchRef = useRef(onSearch);
  useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchRef.current?.(val);
    }, 300);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-shadow duration-300
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b
          ${scrolled
            ? 'shadow-md border-gray-200 dark:border-gray-700'
            : 'border-transparent'
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <a
              href="#/"
              className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white shrink-0 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label="Home"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span>Module 6</span>
            </a>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-1" role="list">
              {items.map(item => {
                const href = item.href.replace('#', '');
                const active = window.location.hash === item.href ||
                  (item.href === '#/' && !window.location.hash);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                        ${getActiveLinkClasses(href)}`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Search bar */}
            <div className="hidden sm:flex flex-1 max-w-xs">
              <label htmlFor="nav-search" className="sr-only">Search</label>
              <div className="relative w-full">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="nav-search"
                  type="search"
                  placeholder="Search…"
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 border border-transparent
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                    transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UserDropdown name="Alex Johnson" />

              {/* Hamburger button */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu
        items={items}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
