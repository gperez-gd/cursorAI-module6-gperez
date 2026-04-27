import { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

/**
 * Wraps any page that requires authentication.
 * Redirects to /#/login if no valid token is present.
 */
export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = '#/login';
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
