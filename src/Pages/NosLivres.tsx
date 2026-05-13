import { useEffect, useRef, useState } from 'react';
import { BooksList } from '../shared/components/BooksList';
import { CategoryFilter } from '../shared/components/CategoryFilter';
import { SearchBar } from '../shared/components/SearchBar';
import { CATEGORIES, fetchNosLivres } from '../shared/data/BookFetch';
import type { Book } from '../types/Book';

export default function NosLivres() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const catalogue = useRef<Book[]>([]);

  useEffect(() => {
    fetchNosLivres()
      .then((data) => {
        catalogue.current = data;
        setBooks(data);
      })
      .catch(() => setError('Impossible de charger les livres.'))
      .finally(() => setLoading(false));
  }, []);

  function applyFilters(query: string, category: string | null) {
    const q = query.toLowerCase();
    setBooks(
      catalogue.current.filter((book) => {
        const matchesSearch =
          q === '' ||
          book.volumeInfo.title.toLowerCase().includes(q) ||
          (book.volumeInfo.authors ?? []).join(' ').toLowerCase().includes(q);
        const matchesCategory =
          category === null ||
          book.fetchedCategory === category;
        return matchesSearch && matchesCategory;
      })
    );
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    applyFilters(query, selectedCategory);
  }

  function handleFilter(category: string | null) {
    setSelectedCategory(category);
    applyFilters(searchQuery, category);
  }

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-(--text-h)">
          Nos livres
        </h1>
        <div className="flex items-center gap-2 w-full max-w-xl">
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onFilter={handleFilter}
          />
        </div>
      </header>

      {error && (
        <p className="italic text-(--text)">{error}</p>
      )}

      <BooksList books={books} loading={loading} />
    </section>
  );
}
