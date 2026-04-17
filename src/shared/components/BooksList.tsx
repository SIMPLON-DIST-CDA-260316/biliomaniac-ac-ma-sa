import { BookCard } from './BookCard';
import type { BookListType } from '../../types/Book';

export function BooksList({ books }: BookListType) {

  return (
    <section>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-3 place-items-center">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
