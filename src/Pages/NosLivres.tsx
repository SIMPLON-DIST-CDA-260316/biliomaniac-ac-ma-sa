import { useEffect, useRef, useState } from 'react';
import { BooksList } from '../shared/components/BooksList';
import { SearchBar } from '../shared/components/SearchBar';
import { fetchNosLivres } from '../shared/data/BookFetch';
import type { Book } from '../types/Book';

export default function NosLivres() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const catalogue = useRef<Book[]>([]);

  useEffect(() => {
    fetchNosLivres()
      .then((data) => {
        catalogue.current = data;
        setBooks(data);
      })
      .catch(() => setError('Impossible de charger les livres.'))
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(query: string) {
    if (query === '') {
      setBooks(catalogue.current);
      return;
    }
    const q = query.toLowerCase();
    setBooks(
      catalogue.current.filter((book) => {
        const title = book.volumeInfo.title.toLowerCase();
        const authors = (book.volumeInfo.authors ?? []).join(' ').toLowerCase();
        return title.includes(q) || authors.includes(q);
      })
    );
  }

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-(--text-h)">
          Nos livres
        </h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      {error && (
        <p className="italic text-(--text)">{error}</p>
      )}

      <BooksList books={books} loading={loading} />
    </section>
  );
}
