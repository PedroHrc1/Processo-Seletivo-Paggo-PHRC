import { useState } from 'react';
import api from '../services/api';
import { useRouter } from 'next/router';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpload() {
    if (!file) {
      setError('Selecione um arquivo');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/documents');
    } catch (err: any) {
      console.error('Erro no upload:', err);
      setError(err.response?.data?.message || 'Falha no upload');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Enviar Fatura</h1>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) => {
          setError(null);
          setFile(e.target.files?.[0] || null);
        }}
      />
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="ml-2 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </div>
  );
}
