import { useEffect, useState } from 'react';
import { SEED_DATA } from '../shared/data/seed';

const STORAGE_KEY = 'bibliomaniac_favoris';
const SEEDED_KEY = 'bibliomaniac_seeded_favoris';

function initFavoris(): string[] {
  if (localStorage.getItem(SEEDED_KEY)) {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA.favoris));
  localStorage.setItem(SEEDED_KEY, 'true');
  return SEED_DATA.favoris;
}

export function useFavoris() {
  const [favoris, setFavoris] = useState<string[]>([]);

  useEffect(() => {
    setFavoris(initFavoris());
  }, []);

  function toggleFavorite(bookId: string) {
    const updated = favoris.includes(bookId)
      ? favoris.filter((id) => id !== bookId)
      : [...favoris, bookId];
    setFavoris(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const isFavorite = (bookId: string) => favoris.includes(bookId);

  return { favoris, toggleFavorite, isFavorite };
}
