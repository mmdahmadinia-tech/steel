import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, defaultUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// بررسی در دسترس بودن Backend
async function checkBackendAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 ثانیه timeout
    });
    return response.ok;
  } catch (error) {
    console.log('Backend not available, using demo mode');
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  // بررسی Backend در ابتدا
  useEffect(() => {
    const init = async () => {
      const available = await checkBackendAvailability();
      setBackendAvailable(available);

      if (available) {
        // Backend موجود - بررسی session
        try {
          const savedToken = localStorage.getItem('steelmetrics_token');
          const savedUser = localStorage.getItem('steelmetrics_user');
          
          if (savedToken && savedUser) {
            const response = await fetch(`${API_URL}/auth/me`, {
              headers: { 'Authorization': `Bearer ${savedToken}` },
            });
            
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              setToken(savedToken);
            } else {
              localStorage.removeItem('steelmetrics_token');
              localStorage.removeItem('steelmetrics_user');
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
        }
      } else {
        // Backend موجود نیست - Demo mode
        try {
          const savedUser = localStorage.getItem('steelmetrics_current_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed && parsed.username && parsed.role) {
              setUser(parsed);
              setToken('demo-token');
            }
          }
        } catch (error) {
          console.error('Demo mode initialization error:', error);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  // Login function
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      if (backendAvailable) {
        // Backend موجود - API login
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('steelmetrics_token', data.token);
        localStorage.setItem('steelmetrics_user', JSON.stringify(data.user));
        
        return true;
      } else {
        // Backend موجود نیست - Demo mode
        const foundUser = defaultUsers.find(
          u => u.username === username && u.password === password && u.isActive
        );

        if (foundUser) {
          setUser(foundUser);
          setToken('demo-token');
          localStorage.setItem('steelmetrics_current_user', JSON.stringify(foundUser));
          return true;
        }

        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [backendAvailable]);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('steelmetrics_token');
    localStorage.removeItem('steelmetrics_user');
    localStorage.removeItem('steelmetrics_current_user');
  }, []);

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!user) return false;

      if (backendAvailable && token && token !== 'demo-token') {
        // Backend موجود - API change password
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
          throw new Error(errorData.error || 'Password change failed');
        }

        return true;
      } else {
        // Demo mode - تغییر رمز در localStorage
        if (currentPassword !== user.password) {
          return false;
        }

        const updatedUser = { ...user, password: newPassword };
        setUser(updatedUser);
        
        // به‌روزرسانی در defaultUsers
        const userIndex = defaultUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          defaultUsers[userIndex] = updatedUser;
        }
        
        localStorage.setItem('steelmetrics_current_user', JSON.stringify(updatedUser));
        return true;
      }
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }, [user, token, backendAvailable]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: !!user && !!token,
      changePassword,
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
