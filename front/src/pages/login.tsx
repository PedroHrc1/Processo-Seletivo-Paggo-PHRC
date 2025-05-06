// front/src/pages/login.tsx
import { useState, useContext, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      // supondo que a API retorne { token: '...' }
      const token = res.data.accessToken ?? res.data.token ?? res.data.access_token;
      if (!token) {
        throw new Error('Token não encontrado na resposta');
      }
      login(token);
      router.push('/documents');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.response?.data?.message || 'Falha no login');
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md space-y-6"
        >
          <h1 className="text-2xl font-semibold text-center">Entrar</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="seu@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>

          <p className="text-center text-sm">
            Ainda não tem conta?{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
}
