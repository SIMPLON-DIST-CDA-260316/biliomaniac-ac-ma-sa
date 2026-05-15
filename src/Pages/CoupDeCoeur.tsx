import { BooksList } from '../shared/components/BooksList';
import { useCatalogue } from '../shared/context/useCatalogue';

export default function CoupDeCoeur() {
  const { coupDeCoeur: books, loading, error } = useCatalogue();

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-(--text-h)">
          Coups de cœur
        </h1>
      </header>

      {error && <p className="italic text-(--text)">{error}</p>}

      <BooksList books={books} loading={loading} />
    </section>
  );
}
