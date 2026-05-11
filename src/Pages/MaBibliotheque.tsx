import { useEffect, useState } from 'react';
import { BooksList } from '../shared/components/BooksList';
import { useEmprunts } from '../features/useEmprunts';
import { useFavoris } from '../features/useFavoris';
import { fetchBooksByIds } from '../shared/data/BookFetch';
import type { Book } from '../types/Book';

export default function MaBibliotheque() {
  const { emprunts } = useEmprunts();
  const { favoris } = useFavoris();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        setError(null);

        // Récupère les IDs des livres empruntés ET favoris
        const empruntIds = emprunts
          .filter((e) => e.statut === 'en_cours')
          .map((e) => e.volumeId);
        const allIds = [...new Set([...empruntIds, ...favoris])]; // Évite les doublons

        if (allIds.length === 0) {
          setBooks([]);
          return;
        }

        // Fetch les détails des livres via l'API
        const fetchedBooks = await fetchBooksByIds(allIds);
        setBooks(fetchedBooks);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erreur lors du chargement des livres',
        );
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, [emprunts, favoris]);

  return (
    <section>
      <h1 className="mb-6 text-center text-2xl">Ma bibliothèque</h1>
      <p className="text-xl mb-5">filtres</p>

      {loading && <p className="text-center">Chargement...</p>}
      {error && <p className="text-center text-red-500">Erreur: {error}</p>}
      {!loading && books.length === 0 && (
        <p className="text-center">Aucun livre dans votre bibliothèque</p>
      )}
      {!loading && books.length > 0 && <BooksList books={books} />}
    </section>
  );
}
