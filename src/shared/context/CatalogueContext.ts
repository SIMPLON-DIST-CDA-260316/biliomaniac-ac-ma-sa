import { createContext } from 'react';
import type { Book } from '../../types/Book';

export interface CatalogueContextValue {
  nouveautes: Book[];
  coupDeCoeur: Book[];
  nosLivres: Book[];
  loading: boolean;
  error: string | null;
}

export const CatalogueContext = createContext<CatalogueContextValue | null>(null);
