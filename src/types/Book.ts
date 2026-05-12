import type { Statut } from '../features/useEmprunts.ts';

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publisher?: string;
    publishedDate?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
  };
  coverUrls?: string[];
}

export interface BookCardType {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export interface BooksListProps {
  books: Book[];
  loading?: boolean;
}

export interface EmpruntType {
  volumeId: string;
  dateEmprunt: string;
  dateRestitution: string;
  statut: Statut;
}