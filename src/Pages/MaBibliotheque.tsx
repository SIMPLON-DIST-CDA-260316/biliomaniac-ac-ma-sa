import { useEffect, useState } from 'react';
import { BooksList } from '../shared/components/BooksList';
import { useEmprunts } from '../features/useEmprunts';
import { useFavoris } from '../features/favorite/useFavoris.ts';
import { fetchBooksByIds } from '../shared/data/BookFetch';
import type { Book } from '../types/Book';

type Filtre = 'tous' | 'favoris' | 'en_cours' | 'rendus';

export default function MaBibliotheque() {
  const { emprunts } = useEmprunts();
  const { favoris } = useFavoris();

  const [books, setBooks] = useState<Book[]>([]); // ✅ Une seule liste
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<Filtre>('tous');

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

  return (
    <section>
      <h1 className="mb-6 text-center text-2xl">Ma bibliothèque</h1>

      <select
        value={filtre}
        onChange={(e) => setFiltre(e.target.value as Filtre)}
        className="mb-6 px-4 py-2 rounded-lg border border-gray-300 text-sm"
      >
        <option value="tous">Mes livres</option>
        <option value="favoris">Mes favoris</option>
        <option value="en_cours">En cours d'emprunt</option>
        <option value="rendus">Déjà lus</option>
      </select>

      {error && <p className="text-center text-red-500">Erreur : {error}</p>}

      {!loading && booksAffiches.length === 0 && (
        <p className="text-center">Aucun livre dans cette catégorie</p>
      )}
      <BooksList books={booksAffiches} loading={loading} />
    </section>
  );
}
