// front/src/pages/signup.tsx
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export default function SignUp() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); // limpa erro anterior
    try {
      // 1) cria usuário
      await api.post('/auth/register', { name, email, password });
      // 2) faz login automático (se quiser)
      const res = await api.post('/auth/login', { email, password });
      login(res.data.accessToken);     // ou .token, conforme sua API retorna
      router.push('/documents');
    } catch (err: any) {
      // captura tanto 400/409 do servidor quanto falhas de rede
      setError(err.response?.data?.message || 'Erro ao criar conta');
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-4">Criar Conta</h1>

      {/* só aparece se der erro */}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label className="block mb-1">Nome</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">E-mail</label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Senha</label>
          {/* remova minLength se não quiser limite */}
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit">Cadastrar</Button>
      </form>
    </Layout>
  );
}
