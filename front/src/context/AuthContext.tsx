// front/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';

interface AuthContextData {
  token: string | null;
  login(email: string, password: string): Promise<void>;
  logout(): void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });
  const isAuthenticated = !!token;

  // 1) Persistir token e navegar após login
  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    router.push('/documents');
  }

  // 2) Limpar token e redirecionar
  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    router.push('/login');
  }

  // 3) Request interceptor: injecta o token
  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use(config => {
      if (token) {
        config.headers!['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(reqInterceptor);
  }, [token]);

  // 4) Response interceptor: if 401, force logout
  useEffect(() => {
    const resInterceptor = api.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(resInterceptor);
  }, [token]);

  // 5) Sempre que token mudar pra null, manda pro login
  useEffect(() => {
    if (!token && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
