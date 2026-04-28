import {
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { jwtSubject } from '../utils/jwtPayload';
import { normalizeUser, type AuthUser } from '../types/auth';
import { api } from '../api/client';
import { AuthContext } from './authContext';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from './authStorageKeys';

const CSRF_KEY = 'auth_csrf';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken]  = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser]    = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post<{
      access_token?: string;
      token?: string;
      user?: Record<string, unknown>;
      csrfToken?: string;
    }>('/auth/login', { email, password });

    const accessToken = data.access_token ?? data.token;
    if (!accessToken) {
      throw new Error('No access token in login response');
    }
    setToken(accessToken);

    if (data.user && typeof data.user === 'object') {
      setUser(normalizeUser(data.user));
    } else {
      const sub = jwtSubject(accessToken);
      setUser({ id: sub ?? 'unknown', email });
    }

    if (data.csrfToken) {
      localStorage.setItem(CSRF_KEY, data.csrfToken);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(CSRF_KEY);
    window.location.hash = '#/login';
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
