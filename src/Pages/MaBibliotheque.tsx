import { useEffect, useRef, useState } from 'react';
import { BooksList } from '../shared/components/BooksList';
import { useEmprunts } from '../features/useEmprunts';
import { useFavoris } from '../features/favorite/useFavoris.ts';
import { fetchBooksByIds } from '../shared/data/BookFetch';
import type { Book } from '../types/Book';

type Filtre = 'tous' | 'favoris' | 'en_cours' | 'rendus';

export default function MaBibliotheque() {
  const { emprunts } = useEmprunts();
  const { favoris } = useFavoris();
  const ref = useRef<HTMLDivElement>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<Filtre>('tous');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        setError(null);

        const enCoursIds = emprunts
          .filter((e) => e.statut === 'en_cours')
          .map((e) => e.volumeId);

        const rendusIds = emprunts
          .filter((e) => e.statut === 'rendu')
          .map((e) => e.volumeId);

        const allIds = [...new Set([...favoris, ...enCoursIds, ...rendusIds])];

        if (allIds.length === 0) {
          setBooks([]);
          return;
        }

        const allBooks = await fetchBooksByIds(allIds);
        setBooks(allBooks);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erreur lors du chargement des livres',
        );
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, [emprunts, favoris]);

  const booksAffiches = books.filter((book) => {
    if (filtre === 'tous') return true;
    if (filtre === 'favoris') return favoris.includes(book.id);
    if (filtre === 'en_cours') {
      return emprunts.some(
        (e) => e.volumeId === book.id && e.statut === 'en_cours',
      );
    }
    if (filtre === 'rendus') {
      return emprunts.some(
        (e) => e.volumeId === book.id && e.statut === 'rendu',
      );
    }
    return true;
  });

  const filtreLabel = {
    tous: 'Mes livres',
    favoris: 'Mes favoris',
    en_cours: "En cours d'emprunt",
    rendus: 'Déjà lus',
  };

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-(--text-h)">
          Ma bibliothèque
        </h1>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Filtrer les livres"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm transition-colors ${
              filtre !== 'tous'
                ? 'border-(--text-hover) text-(--text-hover)'
                : 'border-[rgba(41,89,98,0.4)] text-(--text) hover:border-(--text-hover) hover:text-(--text-hover)'
            }`}
          >
            <img
              src="/images/filtre.png"
              alt=""
              aria-hidden="true"
              className="w-4 h-4 opacity-60"
            />
            {filtreLabel[filtre]}
          </button>

          {open && (
            <div
              className="absolute top-full mt-2 right-0 z-50 w-full rounded-xl py-1 shadow-lg"
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
              }}
            >
              {Object.entries(filtreLabel).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setFiltre(value as Filtre);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:text-(--text-hover) ${
                    filtre === value
                      ? 'text-(--text-hover) font-semibold'
                      : 'text-(--text)'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {error && <p className="text-center text-red-500">Erreur : {error}</p>}

      {!loading && booksAffiches.length === 0 && (
        <p className="text-center">Aucun livre dans cette catégorie</p>
      )}
      <BooksList books={booksAffiches} loading={loading} />
    </section>
  );
}
