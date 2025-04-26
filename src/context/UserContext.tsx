'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  name?: string;
  email?: string;
  role?: string;
  userId?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Hidrata el contexto desde localStorage al montar
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        const decoded = jwtDecode<{ name?: string; email?: string; role?: string; userId?: string }>(token);
        setUser({
          name: decoded.name || '',
          email: decoded.email,
          role: decoded.role,
          userId: decoded.userId,
        });
      } catch {
        // Token inválido, limpiar
        setUser(null);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook para usar el contexto de usuario
export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used within a UserProvider');
  return context;
}