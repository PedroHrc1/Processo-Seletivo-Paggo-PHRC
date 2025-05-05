// front/src/pages/index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona imediatamente para /documents
    router.replace('/documents');
  }, [router]);

  return null;
}
