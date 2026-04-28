import { useEffect } from 'react';
import type { MobileMenuProps } from '../../types/nav';
import { getActiveLinkClasses } from '../../utils/activeLink';
import { useCart } from '../../context/useCart';

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
  const { itemCount } = useCart();
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 md:hidden
          shadow-lg animate-in slide-in-from-top duration-200"
        aria-label="Mobile navigation"
      >
        <ul className="flex flex-col py-2" role="list">
          <li>
            <a
              href="#/cart"
              onClick={onClose}
              data-testid="mobile-cart-link"
              aria-current={window.location.hash === '#/cart' ? 'page' : undefined}
              className={`block px-5 py-3 text-base font-medium transition-colors
                ${getActiveLinkClasses('/cart')}`}
            >
              Cart{itemCount > 0 ? ` (${itemCount})` : ''}
            </a>
          </li>
          {items.map(item => {
            const active = window.location.hash === item.href || (item.href === '#/' && !window.location.hash);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? 'page' : undefined}
                  className={`block px-5 py-3 text-base font-medium transition-colors
                    ${getActiveLinkClasses(item.href.replace('#', ''))}`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
