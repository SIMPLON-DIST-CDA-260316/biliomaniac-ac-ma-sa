import { useEffect, useState } from 'react';
import { fetchCoupDeCoeur, fetchNosLivres, fetchNouveautes } from '../data/BookFetch';
import type { Book } from '../../types/Book';
import { CatalogueContext } from './CatalogueContext';

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function CatalogueProvider({ children }: { children: React.ReactNode }) {
  const [nouveautes, setNouveautes] = useState<Book[]>([]);
  const [coupDeCoeur, setCoupDeCoeur] = useState<Book[]>([]);
  const [nosLivres, setNosLivres] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchNouveautes(), fetchCoupDeCoeur(), fetchNosLivres()])
      .then(([n, c, l]) => {
        setNouveautes(shuffle(n));
        setCoupDeCoeur(c);
        setNosLivres(l);
      })
      .catch(() => setError('Impossible de charger le catalogue.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CatalogueContext.Provider value={{ nouveautes, coupDeCoeur, nosLivres, loading, error }}>
      {children}
    </CatalogueContext.Provider>
  );
}
