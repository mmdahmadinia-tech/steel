import React, { createContext, useContext, useState, ReactNode } from 'react';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('steelmetrics_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('steelmetrics_users', JSON.stringify(newUsers));
  };

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(u => u.username === username && u.password === password && u.isActive);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('steelmetrics_current_user', JSON.stringify(foundUser));
      return true;
    }
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, changePassword, users, addUser, updateUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
