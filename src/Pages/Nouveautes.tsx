import {useEffect, useState} from 'react';
import { fetchNouveautes } from '../shared/data/BookFetch.ts';
import { BooksList } from '../shared/components/BooksList.tsx';
import type { Book } from '../types/Book.ts';

export default function Nouveautes() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNouveautes()
      .then(setBooks)
      .catch(() => setError('Impossible de charger les nouveautés.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="flex flex-col items-center gap-10">
      <h1 className="text-4xl md:text-5xl font-semibold text-(--text-h)">
        Nouveautés
      </h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      <BooksList books={books} loading={loading} />
    </section>
  );
}
