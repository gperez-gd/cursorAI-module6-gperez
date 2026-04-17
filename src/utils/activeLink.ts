function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

/**
 * Returns true if the given href matches the current route (hash-based).
 * Supports exact match and optional prefix matching for nested routes.
 */
export function isActive(href: string, exact = true): boolean {
  const currentHash = window.location.hash.replace('#', '') || '/';
  const current = normalizePath(currentHash);
  const normalized = normalizePath(href);

  if (exact) {
    return current === normalized;
  }

  return current === normalized || current.startsWith(normalized + '/');
}

export function getActiveLinkClasses(href: string, exact = true): string {
  return isActive(href, exact)
    ? 'text-primary font-semibold border-b-2 border-primary'
    : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary';
}
