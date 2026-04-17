import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/nav/Navbar';
import Footer from './components/layout/Footer';
import { ToastProvider } from './components/ui/ToastProvider';
import { initSmoothScroll } from './utils/smoothScroll';
import ProductDemo from './pages/ProductDemo';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Kanban from './pages/Kanban';
import SocialFeed from './pages/SocialFeed';

// Initialize dark mode from stored preference
function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
}
initTheme();

type Route = '/' | '/products' | '/dashboard' | '/settings' | '/analytics' | '/kanban' | '/feed';

const VALID_ROUTES: Route[] = ['/', '/products', '/dashboard', '/settings', '/analytics', '/kanban', '/feed'];

// Pages that use DashboardLayout (have their own header + sidebar)
const DASHBOARD_PAGES: Route[] = ['/dashboard', '/settings', '/analytics', '/kanban'];

function getRoute(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/products';
  return VALID_ROUTES.includes(path as Route) ? (path as Route) : '/products';
}

function usePage(): Route {
  const [route, setRoute] = useState<Route>(() => getRoute(window.location.hash));

  useEffect(() => {
    const handler = () => setRoute(getRoute(window.location.hash));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}

function PageContent({ route, navSearch }: { route: Route; navSearch: string }) {
  switch (route) {
    case '/products': return <ProductDemo navSearchQuery={navSearch} />;
    case '/dashboard': return <Dashboard />;
    case '/settings': return <Settings />;
    case '/analytics': return <Analytics />;
    case '/kanban': return <Kanban />;
    case '/feed': return <SocialFeed />;
    default: return <ProductDemo navSearchQuery={navSearch} />;
  }
}

export default function App() {
  const route = usePage();
  const isDashboardPage = DASHBOARD_PAGES.includes(route);
  const [navSearch, setNavSearch] = useState('');

  useEffect(() => {
    return initSmoothScroll({ offset: 80 });
  }, []);

  const handleNavSearch = useCallback((query: string) => {
    setNavSearch(query);
    if (query && window.location.hash !== '#/products') {
      window.location.hash = '#/products';
    }
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar onSearch={handleNavSearch} />
        <main
          className={`flex-1 ${isDashboardPage ? 'overflow-hidden' : ''}`}
          style={isDashboardPage ? { height: 'calc(100vh - 4rem)' } : undefined}
        >
          <PageContent route={route} navSearch={navSearch} />
        </main>
        {!isDashboardPage && <Footer />}
      </div>
    </ToastProvider>
  );
}
