import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email, password);
    router.push('/documents');
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
        <h1 className="text-xl mb-4">Login</h1>
        <input
          className="block mb-2 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="block mb-4 p-2 border rounded"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Entrar</button>
      </form>
    </div>
  );
}
