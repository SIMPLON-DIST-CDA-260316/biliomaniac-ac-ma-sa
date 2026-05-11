import { useEffect, useState } from 'react';
import { BookCard } from '../shared/components/BookCard';
import { fetchNosLivres } from '../shared/data/BookFetch';
import type { Book } from '../types/Book';

function BookSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div
        className="rounded-[15px] w-[112px] lg:w-[150px] h-[165px] lg:h-[220px]"
        style={{ background: 'var(--border)' }}
      />
      <div className="h-3 rounded w-20" style={{ background: 'var(--border)' }} />
      <div className="h-2 rounded w-14" style={{ background: 'var(--border)' }} />
    </div>
  );
}

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

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 justify-items-center gap-x-4 gap-y-8">
        {loading
          ? Array.from({ length: 15 }).map((_, i) => <BookSkeleton key={i} />)
          : books.map((book) => (
              <BookCard
                key={book.id}
                book={{
                  id: book.id,
                  volumeInfo: {
                    title: book.volumeInfo.title,
                    authors: book.volumeInfo.authors ?? [],
                    imageLinks: {
                      thumbnail: book.coverUrls?.[0] ?? book.volumeInfo.imageLinks?.thumbnail ?? '',
                    },
                  },
                }}
              />
            ))}
      </div>
    </section>
  );
}
