import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

export interface AuthUser {
  id: number;
  email: string;
  name?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Axios instance shared across the app — attach it to window for other modules
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Inject the JWT on every request when present
api.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401 responses
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.hash !== '#/login') {
        window.location.hash = '#/login';
      }
    }
    return Promise.reject(err);
  },
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken]  = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser]    = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post<{ access_token: string; user: AuthUser }>(
      '/auth/login',
      { email, password },
    );
    setToken(data.access_token);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
    window.location.hash = '#/login';
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
