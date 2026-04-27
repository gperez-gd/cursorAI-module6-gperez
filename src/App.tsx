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
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Initialize dark mode from stored preference
function initTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
}
initTheme();

type Route = '/' | '/products' | '/dashboard' | '/settings' | '/analytics' | '/kanban' | '/feed' | '/login' | '/register';

const VALID_ROUTES: Route[] = ['/', '/products', '/dashboard', '/settings', '/analytics', '/kanban', '/feed', '/login', '/register'];

// Pages that use DashboardLayout (have their own header + sidebar)
const DASHBOARD_PAGES: Route[] = ['/dashboard', '/settings', '/analytics', '/kanban'];

// Pages that require auth
const PROTECTED_PAGES: Route[] = ['/dashboard', '/settings', '/analytics', '/kanban', '/feed'];

// Pages that hide the top Navbar/Footer entirely
const BARE_PAGES: Route[] = ['/login', '/register'];

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
  const protect = (el: JSX.Element) => <ProtectedRoute>{el}</ProtectedRoute>;
  switch (route) {
    case '/login':    return <Login />;
    case '/register': return <Register />;
    case '/products': return <ProductDemo navSearchQuery={navSearch} />;
    case '/dashboard': return protect(<Dashboard />);
    case '/settings':  return protect(<Settings />);
    case '/analytics': return protect(<Analytics />);
    case '/kanban':    return protect(<Kanban />);
    case '/feed':      return protect(<SocialFeed />);
    default: return <ProductDemo navSearchQuery={navSearch} />;
  }
}

export default function App() {
  const route = usePage();
  const isDashboardPage = DASHBOARD_PAGES.includes(route);
  const isBarePage = BARE_PAGES.includes(route);
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

  if (isBarePage) {
    return (
      <ToastProvider>
        <PageContent route={route} navSearch={navSearch} />
      </ToastProvider>
    );
  }

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
