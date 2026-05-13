import { useEffect, useRef, useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selected: string | null;
  onFilter: (category: string | null) => void;
}

export function CategoryFilter({ categories, selected, onFilter }: CategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(category: string | null) {
    onFilter(category);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Filtrer par catégorie"
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm transition-colors ${
          selected
            ? 'border-(--text-hover) text-(--text-hover)'
            : 'border-[rgba(41,89,98,0.4)] text-(--text) hover:border-(--text-hover) hover:text-(--text-hover)'
        }`}
      >
        <img src="/images/filtre.png" alt="" aria-hidden="true" className="w-4 h-4 opacity-60" />
        {selected ?? 'Catégorie'}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 w-full rounded-xl py-1 shadow-lg"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <button
            onClick={() => handleSelect(null)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:text-(--text-hover) ${
              selected === null ? 'text-(--text-hover) font-semibold' : 'text-(--text)'
            }`}
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:text-(--text-hover) capitalize ${
                selected === category ? 'text-(--text-hover) font-semibold' : 'text-(--text)'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
