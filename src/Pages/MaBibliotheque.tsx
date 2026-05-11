import { BooksList } from '../shared/components/BooksList';
import { books } from '../shared/data/data.tsx';

export default function MaBibliotheque() {
  return (
    <section>
      <h1 className="mb-6 text-center text-2xl">Ma bibliothèque</h1>
      <p className="text-xl mb-5">filtres</p>
      <BooksList books={books} />
    </section>
  );
}
