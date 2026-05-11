import type { BookCardType } from '../../types/Book';

export function BookCard({ book }: { book: BookCardType }) {
  const { volumeInfo } = book;
  const { title, authors, imageLinks } = volumeInfo;

  return (
    <div className="flex flex-col items-center gap-1 w-[112px] lg:w-[150px] h-[260px] lg:h-[320px] lg:transition-transform lg:duration-200 lg:hover:scale-105 lg:cursor-pointer">
      <img
        src={imageLinks.thumbnail}
        alt={title}
        className="rounded-[15px] w-[112px] lg:w-[150px] h-[165px] lg:h-[220px] object-cover mb-2 md:mb-3 shadow-[3px_3px_6px_rgba(0,0,0,0.25)] lg:shadow-[5px_5px_10px_rgba(0,0,0,0.6)]"
      />
      <h3 className="text-[14px] lg:text-[16px] font-semibold text-center line-clamp-2">
        {title}
      </h3>
      <p className="text-[11px] lg:text-[13px] italic text-center line-clamp-1">
        {authors.join(', ')}
      </p>
    </div>
  );
}
