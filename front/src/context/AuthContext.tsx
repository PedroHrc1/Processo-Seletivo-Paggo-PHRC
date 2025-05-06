// front/src/context/AuthContext.tsx

import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import Router from 'next/router';

type AuthContextData = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextData>({
  token: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // Carrega token do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      setToken(saved);
      api.defaults.headers.common['Authorization'] = `Bearer ${saved}`;
    }
  }, []);

  function login(newToken: string) {
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    Router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
