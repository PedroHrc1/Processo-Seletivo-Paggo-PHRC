// front/src/components/Layout.tsx

import Link from 'next/link';
import { useContext, ReactNode } from 'react';
import { AuthContext } from '../context/AuthContext';

export function Layout({ children }: { children: ReactNode }) {
  const { token, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <header className="bg-[var(--color-surface)] shadow-md">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            Paggo OCR
          </Link>
          <nav className="space-x-4">
            {token ? (
              <>
                <Link href="/documents">
                  Meus Documentos
                </Link>
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-dark)] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  Login
                </Link>
                <Link href="/signup">
                  Cadastrar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container py-6">{children}</main>

      <footer className="bg-[var(--color-surface)] text-center py-4 text-sm text-[var(--color-secondary)]">
        © {new Date().getFullYear()} Paggo OCR. Todos os direitos reservados.
      </footer>
    </div>
  );
}
