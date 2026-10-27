import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, defaultUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  changePassword: (newPassword: string) => void;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  removeUser: (id: string) => void;
  resetUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isValidUser(user: any): user is User {
  return user && typeof user.username === 'string' && typeof user.password === 'string' && typeof user.role === 'string';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('steelmetrics_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if saved users are valid (have password field)
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isValidUser)) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    // Reset to defaults if invalid
    localStorage.setItem('steelmetrics_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  });

  useEffect(() => {
    // Check if current user session is still valid
    try {
      const savedUser = localStorage.getItem('steelmetrics_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (isValidUser(parsed)) {
          // Verify user still exists and is active
          const currentUser = users.find(u => u.username === parsed.username && u.isActive);
          if (currentUser) {
            setUser(currentUser);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('steelmetrics_users', JSON.stringify(newUsers));
  };

  const login = (username: string, password: string): boolean => {
    // Debug log
    console.log('Login attempt:', { username, password });
    console.log('Available users:', users.map(u => ({ username: u.username, isActive: u.isActive })));
    
    const foundUser = users.find(u => 
      u.username === username && 
      u.password === password && 
      u.isActive
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('steelmetrics_current_user', JSON.stringify(foundUser));
      console.log('Login successful:', foundUser.username);
      return true;
    }
    
    console.log('Login failed: user not found or inactive');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('steelmetrics_current_user');
  };

  const changePassword = (newPassword: string) => {
    if (user) {
      const updated = { ...user, password: newPassword };
      setUser(updated);
      localStorage.setItem('steelmetrics_current_user', JSON.stringify(updated));
      const newUsers = users.map(u => u.id === user.id ? { ...u, password: newPassword } : u);
      saveUsers(newUsers);
    }
  };

  const addUser = (newUser: User) => {
    saveUsers([...users, newUser]);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    const newUsers = users.map(u => u.id === id ? { ...u, ...data } : u);
    saveUsers(newUsers);
  };

  const removeUser = (id: string) => {
    saveUsers(users.filter(u => u.id !== id));
  };

  const resetUsers = () => {
    saveUsers(defaultUsers);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, changePassword, users, addUser, updateUser, removeUser, resetUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
