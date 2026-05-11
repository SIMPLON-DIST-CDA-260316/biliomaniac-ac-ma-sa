import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Rechercher un livre...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(query.trim());
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl overflow-hidden rounded-full my-6 border border-[rgba(41,89,98,0.4)]"
    >
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-5 py-2.5 text-sm outline-none text-(--text-h) font-(--font)"
      />
      <button
        type="submit"
        className="px-4 transition-colors text-(--text)"
        aria-label="Rechercher"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
