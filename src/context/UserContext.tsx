'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

type UserContextType = {
  token: string | null;
  isLoggedIn: boolean;
  userId: string | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
};

type JwtPayload = {
  sub: string; 
  userId: string;
  role: string;
};

const UserContext = createContext<UserContextType>({
  token: null,
  isLoggedIn: false,
  userId: null,
  role: null,

  login: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  
      
  
  // Cargar token de localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  // Guardar token en localStorage cuando cambia
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);
  useEffect(() => {
    if (token) {
      try {
        const payload = jwtDecode<{ userId: string }>(token);
        console.log('Payload JWT:', payload);
      } catch {
        console.log('Error decodificando JWT:');
      }
    }
  }, [token]);

  function login(newToken: string) {
    setToken(newToken);
  }

  function logout() {
    setToken(null);
  }

  // Decodifica el token para obtener el userId y role
  const decoded = token ? jwtDecode<JwtPayload>(token) : null;
  const userId = decoded ? decoded.userId : null;
  const role = decoded ? decoded.role : null;

  return (
    <UserContext.Provider value={{ token, isLoggedIn: !!token, userId, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para usar el contexto fácilmente
export function useUser() {
  return useContext(UserContext);
}