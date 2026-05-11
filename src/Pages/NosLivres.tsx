import { useEffect, useState } from 'react';
import { BooksList } from '../shared/components/BooksList';
import { fetchNosLivres } from '../shared/data/BookFetch';
import type { Book } from '../types/Book';

export default function NosLivres() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNosLivres()
      .then(setBooks)
      .catch(() => setError('Impossible de charger les livres.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Nos livres
        </h1>
        {/* TODO: search bar */}
        <div className="w-full max-w-xl h-11" />
      </header>

      {error && (
        <p className="italic" style={{ color: 'var(--text)' }}>{error}</p>
      )}

      <BooksList books={books} loading={loading} />
    </section>
  );
}
