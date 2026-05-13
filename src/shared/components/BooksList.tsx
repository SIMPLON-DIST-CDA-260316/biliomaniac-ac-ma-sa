import { BookCard } from './BookCard';
import type { BooksListProps } from '../../types/Book';
import { useFavoris } from '../../features/favorite/useFavoris';

function BookSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div
        className="rounded-[15px] w-[112px] lg:w-[150px] h-[165px] lg:h-[220px]"
        style={{ background: 'var(--border)' }}
      />
      <div
        className="h-3 rounded w-20"
        style={{ background: 'var(--border)' }}
      />
      <div
        className="h-2 rounded w-14"
        style={{ background: 'var(--border)' }}
      />
    </div>
  );
}

export function BooksList({ books, loading = false }: BooksListProps) {
  const { isFavorite, toggleFavorite } = useFavoris();

  return (
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
                    thumbnail:
                      book.coverUrls?.[0] ??
                      book.volumeInfo.imageLinks?.thumbnail ??
                      '',
                  },
                },
              }}
              isFavorite={isFavorite(book.id)}
              onToggleFavorite={() => toggleFavorite(book.id)}
            />
          ))}
    </div>
  );
}
