import { useMemo, useState } from 'react';
import { SearchBar } from '../shared/components/SearchBar';
import { BooksCarousel } from '../shared/components/BooksCarousel';
import { BooksList } from '../shared/components/BooksList';
import { useCatalogue } from '../shared/context/useCatalogue';

export default function Accueil() {
  const { nouveautes, coupDeCoeur, nosLivres, loading, error } = useCatalogue();
  const [searchQuery, setSearchQuery] = useState('');

  const nosLivresExclusifs = useMemo(() => {
    const alreadyShown = new Set([
      ...nouveautes.map((b) => b.id),
      ...coupDeCoeur.map((b) => b.id),
    ]);
    return nosLivres.filter((b) => !alreadyShown.has(b.id)).slice(0, 20);
  }, [nouveautes, coupDeCoeur, nosLivres]);

  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return [];
    return nosLivres.filter(
      (b) =>
        b.volumeInfo.title.toLowerCase().includes(q) ||
        (b.volumeInfo.authors ?? []).join(' ').toLowerCase().includes(q)
    );
  }, [searchQuery, nosLivres]);

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-(--text-h) text-center my-8">
          Bienvenue chez Bibliomaniac
        </h1>
        <div className="flex w-full max-w-md">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </header>

      {error && <p className="italic text-(--text)">{error}</p>}

      {searchQuery ? (
        <BooksList books={searchResults} loading={loading} />
      ) : (
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="text-2xl font-semibold text-(--text-h) mb-4">Nos nouveautés</h2>
            <BooksCarousel books={nouveautes} loading={loading} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-(--text-h) mb-4">Nos coups de cœur</h2>
            <BooksCarousel books={coupDeCoeur} loading={loading} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-(--text-h) mb-4">Nos livres</h2>
            <BooksCarousel books={nosLivresExclusifs} loading={loading} />
          </section>
        </div>
      )}
    </section>
  );
}
