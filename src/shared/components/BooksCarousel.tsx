import { useRef } from 'react';
import { BookCard } from './BookCard';
import { useFavoris } from '../../features/favorite/useFavoris';
import type { BooksListProps } from '../../types/Book';

function BookSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse shrink-0">
      <div
        className="rounded-[15px] w-[112px] lg:w-[150px] h-[165px] lg:h-[220px]"
        style={{ background: 'var(--border)' }}
      />
      <div className="h-3 rounded w-20" style={{ background: 'var(--border)' }} />
      <div className="h-2 rounded w-14" style={{ background: 'var(--border)' }} />
    </div>
  );
}

export function BooksCarousel({ books, loading = false }: BooksListProps) {
  const { isFavorite, toggleFavorite } = useFavoris();
  const ref = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right') {
    if (!ref.current) return;
    ref.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scroll('left')}
        aria-label="Précédent"
        className="absolute left-0 top-[82px] lg:top-[110px] -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        ‹
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <BookSkeleton key={i} />)
          : books.map((book) => (
              <div key={book.id} className="shrink-0">
                <BookCard
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
              </div>
            ))}
      </div>

      <button
        onClick={() => scroll('right')}
        aria-label="Suivant"
        className="absolute right-0 top-[82px] lg:top-[110px] -translate-y-1/2 translate-x-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        ›
      </button>
    </div>
  );
}
