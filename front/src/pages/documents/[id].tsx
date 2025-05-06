// front/src/pages/documents/[id].tsx

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

type Interaction = {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
};

type DocDetail = {
  id: string;
  originalName: string;
  extractedText: { content: string } | null;
  interactions: Interaction[];
};

type ChatPayload = {
  userInteraction: Interaction;
  assistantInteraction: Interaction;
};

export default function DocumentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useContext(AuthContext);
  const [doc, setDoc] = useState<DocDetail | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  // Fetch document details
  useEffect(() => {
    if (!id || !token) return;
    api
      .get<DocDetail>(`/documents/${id}`)
      .then((res) => setDoc(res.data))
      .catch((err) => {
        console.error('Erro ao carregar documento', err);
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          alert(err.response?.data?.message || 'Erro ao carregar o documento');
        }
      });
  }, [id, token, router]);

  async function sendQuestion() {
    if (!question.trim() || !id) return;
    setLoading(true);

    // 1) injeta imediatamente a mensagem do usuário no estado
    const now = new Date().toISOString();
    setDoc((prev) =>
      prev
        ? {
            ...prev,
            interactions: [
              ...prev.interactions,
              {
                id: `temp-${now}`,
                role: 'user',
                message: question,
                timestamp: now,
              },
            ],
          }
        : prev
    );

    try {
      // 2) chama a API e espera as duas interações
      const res = await api.post<ChatPayload>(
        `/documents/${id}/interactions`,
        { message: question }
      );
      const { userInteraction, assistantInteraction } = res.data;

      // 3) substitui a interação "temporária" pela real do usuário e adiciona a do assistente
      setDoc((prev) => {
        if (!prev) return prev;
        const cleaned = prev.interactions.filter(
          (i) => !i.id.startsWith('temp-')
        );
        return {
          ...prev,
          interactions: [
            ...cleaned,
            userInteraction,
            assistantInteraction,
          ],
        };
      });

      setQuestion('');
    } catch (err: any) {
      console.error('Erro no chat:', err);
      alert(err.response?.data?.message || 'Erro ao enviar a pergunta');
      // opcional: remover o temp- caso queira
    } finally {
      setLoading(false);
    }
  }

  if (!doc) {
    return <p className="p-6">Carregando…</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">{doc.originalName}</h1>

      <section className="mb-6">
        <h2 className="font-bold mb-2">Texto extraído</h2>
        <pre className="p-4 bg-gray-100 rounded">
          {doc.extractedText?.content || '—'}
        </pre>
      </section>

      <section>
        <h2 className="font-bold mb-2">Chat</h2>
        <div className="mb-4 max-h-64 overflow-y-auto border p-4 rounded">
          {doc.interactions.map((i) => (
            <div key={i.id} className="mb-2">
              <strong
                className={i.role === 'assistant' ? 'text-blue-600' : ''}
              >
                {i.role === 'assistant' ? 'Assistente' : 'Você'}:
              </strong>{' '}
              {i.message}
            </div>
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Digite sua pergunta..."
            disabled={loading}
          />
          <button
            onClick={sendQuestion}
            disabled={loading}
            className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Perguntar'}
          </button>
        </div>
      </section>
    </div>
  );
}
