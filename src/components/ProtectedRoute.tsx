import { type ReactNode, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = '#/login';
    }
  }, [isAuthenticated]);

  // Gate rendering directly from source of truth
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}