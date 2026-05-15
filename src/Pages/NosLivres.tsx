import { useMemo, useState } from 'react';
import { BooksList } from '../shared/components/BooksList';
import { CategoryFilter } from '../shared/components/CategoryFilter';
import { SearchBar } from '../shared/components/SearchBar';
import { CATEGORIES } from '../shared/data/BookFetch';
import { useCatalogue } from '../shared/context/useCatalogue';

export default function NosLivres() {
  const { nosLivres, loading, error } = useCatalogue();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const books = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return nosLivres.filter((book) => {
      const matchesSearch =
        q === '' ||
        book.volumeInfo.title.toLowerCase().includes(q) ||
        (book.volumeInfo.authors ?? []).join(' ').toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === null ||
        book.fetchedCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [nosLivres, searchQuery, selectedCategory]);

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-(--text-h)">
          Nos livres
        </h1>
        <div className="flex items-center gap-2 w-full max-w-xl">
          <SearchBar onSearch={setSearchQuery} />
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onFilter={setSelectedCategory}
          />
        </div>
      </header>

      {error && <p className="italic text-(--text)">{error}</p>}

      <BooksList books={books} loading={loading} />
    </section>
  );
}
