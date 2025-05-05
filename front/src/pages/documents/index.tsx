import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../../services/api';

type Doc = {
  id: string;
  originalName: string;
  uploadedAt: string;
  _count: { interactions: number };
};

export default function DocumentsList() {
    const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    api.get('/documents')
      .then(res => setDocs(res.data))
      .catch(err => {
        console.error('Erro ao buscar documentos', err);
        if (err.response?.status === 401) {
          // token inválido ou ausente
          router.push('/login');
        }
      });
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Meus Documentos</h1>

      <Link
        href="/upload"
        className="mb-4 inline-block px-4 py-2 bg-green-600 text-white rounded"
      >
        + Enviar nova fatura
      </Link>

      {docs.length === 0 ? (
        <p>Nenhum documento encontrado.</p>
      ) : (
        <ul>
          {docs.map((d) => (
            <li key={d.id} className="py-2 border-b flex items-center justify-between">
              <Link href={`/documents/${d.id}`} className="text-blue-600 hover:underline">
                {d.originalName}
              </Link>
              <div className="text-sm text-gray-500">
                {new Date(d.uploadedAt).toLocaleString()}
                {' • '}
                {d._count.interactions} interação{d._count.interactions !== 1 ? 'ões' : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
