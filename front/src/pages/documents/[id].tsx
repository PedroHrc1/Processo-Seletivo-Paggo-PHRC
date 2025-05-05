import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

type Interaction = { role: string; message: string; timestamp: string };
type DocDetail = {
  id: string;
  originalName: string;
  extractedText: { content: string } | null;
  interactions: Interaction[];
};

export default function DocumentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [doc, setDoc] = useState<DocDetail | null>(null);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (id) api.get(`/documents/${id}`).then(r => setDoc(r.data));
  }, [id]);

  async function sendQuestion() {
    // futuramente POST /documents/:id/interactions
    const res = await api.post(`/documents/${id}/interactions`, { message: question });
    setDoc(prev => prev && { ...prev, interactions: [...prev.interactions, res.data] });
    setQuestion('');
  }

  if (!doc) return <p>Carregando…</p>;
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">{doc.originalName}</h1>
      <section className="mb-6">
        <h2 className="font-bold">Texto extraído</h2>
        <pre className="p-4 bg-gray-100 rounded">{doc.extractedText?.content || '—'}</pre>
      </section>
      <section>
        <h2 className="font-bold mb-2">Chat</h2>
        <div className="mb-4 max-h-64 overflow-y-auto border p-4">
          {doc.interactions.map((i, idx) => (
            <div key={idx} className={i.role === 'assistant' ? 'text-blue-600' : ''}>
              <strong>{i.role}:</strong> {i.message}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button onClick={sendQuestion} className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded">
            Perguntar
          </button>
        </div>
      </section>
    </div>
  );
}
