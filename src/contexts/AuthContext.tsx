import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  mustChangePassword: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  setMustChangePassword: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  // بررسی session در ابتدا
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('steelmetrics_token');
        const savedUser = localStorage.getItem('steelmetrics_user');
        
        if (savedToken && savedUser) {
          // بررسی معتبر بودن token
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${savedToken}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(savedToken);
            
            // بررسی نیاز به تغییر رمز
            const mustChange = localStorage.getItem('steelmetrics_must_change_password');
            setMustChangePassword(mustChange === 'true');
          } else {
            // Token نامعتبر
            localStorage.removeItem('steelmetrics_token');
            localStorage.removeItem('steelmetrics_user');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('خطا در اتصال به سرور. لطفاً Backend را راه‌اندازی کنید.');
        localStorage.removeItem('steelmetrics_token');
        localStorage.removeItem('steelmetrics_user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'نام کاربری یا رمز عبور اشتباه است');
      }

      const data = await response.json();
      
      // ذخیره token و user
      setToken(data.token);
      setUser(data.user);
      setMustChangePassword(data.mustChangePassword || false);
      localStorage.setItem('steelmetrics_token', data.token);
      localStorage.setItem('steelmetrics_user', JSON.stringify(data.user));
      localStorage.setItem('steelmetrics_must_change_password', String(data.mustChangePassword || false));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در ورود به سیستم';
      setError(errorMessage);
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setMustChangePassword(false);
    localStorage.removeItem('steelmetrics_token');
    localStorage.removeItem('steelmetrics_user');
    localStorage.removeItem('steelmetrics_must_change_password');
  }, []);

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!token) {
        throw new Error('لطفاً ابتدا وارد شوید');
      }

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'خطا در تغییر رمز عبور');
      }

      // تغییر mustChangePassword به false
      setMustChangePassword(false);
      localStorage.setItem('steelmetrics_must_change_password', 'false');
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در تغییر رمز عبور';
      setError(errorMessage);
      console.error('Change password error:', err);
      return false;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      mustChangePassword,
      login,
      logout,
      isAuthenticated: !!user && !!token,
      changePassword,
      setMustChangePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
