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
  coverUrls: string[];
}

export interface BookCardProps {
  book: Book;
}
