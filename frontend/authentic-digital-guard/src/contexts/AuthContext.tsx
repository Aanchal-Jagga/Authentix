import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { signupUser, loginUser, googleLogin } from '@/services/auth';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: (googleToken: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('authentix_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authentix_token');
  });

  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user && !!token;

  const persistAuth = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('authentix_user', JSON.stringify(userData));
    localStorage.setItem('authentix_token', jwtToken);
  };

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      const userData = data.user || { name: email.split('@')[0], email };
      const jwtToken = data.token || data.access_token || '';
      persistAuth(userData, jwtToken);
      return { ok: true };
    } catch (err: any) {
      let message = err.response?.data?.detail || err.message || 'Login failed';
      if (typeof message === 'object') {
        message = message.error?.message || JSON.stringify(message);
      }
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await signupUser(name, email, password);
      const userData = data.user || { name, email };
      const jwtToken = data.token || data.access_token || '';
      persistAuth(userData, jwtToken);
      return { ok: true };
    } catch (err: any) {
      let message = err.response?.data?.detail || err.message || 'Signup failed';
      if (typeof message === 'object') {
        message = message.error?.message || JSON.stringify(message);
      }
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (googleToken: string) => {
    setLoading(true);
    try {
      const data = await googleLogin(googleToken);
      const userData = data.user || { name: 'Google User', email: '' };
      const jwtToken = data.token || data.access_token || '';
      persistAuth(userData, jwtToken);
      return { ok: true };
    } catch (err: any) {
      let message = err.response?.data?.detail || err.message || 'Google login failed';
      if (typeof message === 'object') {
        message = message.error?.message || JSON.stringify(message);
      }
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authentix_user');
    localStorage.removeItem('authentix_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
