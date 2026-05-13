import type { BookCardType } from '../../types/Book';
import FavoriteButton from '../../features/favorite/Favorite';
import { useEmprunts } from '../../features/useEmprunts.ts';


export function BookCard({
  book,
  isFavorite,
  onToggleFavorite,
}: BookCardType) {
  const { volumeInfo } = book;
  const { title, authors, imageLinks } = volumeInfo;
  const { empruntEnCours, estRendu } = useEmprunts();

  const enCours = empruntEnCours(book.id);
  const rendu = estRendu(book.id);

  return (
    <div className="flex flex-col items-center gap-1 w-[112px] lg:w-[150px] h-[260px] lg:h-[320px] lg:transition-transform lg:duration-200 lg:hover:scale-105 lg:cursor-pointer">
      <div className="relative">
        <img
          src={imageLinks?.thumbnail}
          alt={title}
          className="rounded-[15px] w-[112px] lg:w-[150px] h-[165px] lg:h-[220px] object-cover mb-2 md:mb-3 shadow-[3px_3px_6px_rgba(0,0,0,0.25)] lg:shadow-[5px_5px_10px_rgba(0,0,0,0.6)]"
        />

        <div className="absolute top-1 right-1 cursor-pointer w-8 h-8 flex items-center justify-center">
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
        </div>

        {enCours && (
          <div className="absolute bottom-[8px] lg:bottom-[12px] left-0 right-0 rounded-b-[15px] py-0.5 text-center bg-[rgba(55,138,221,0.88)]">
            <span className="text-[9px] font-medium tracking-wide text-[#E6F1FB]">
              EN COURS
            </span>
          </div>
        )}

        {rendu && (
          <div className="absolute bottom-[8px] lg:bottom-[12px] left-0 right-0 rounded-b-[15px] py-0.5 text-center bg-[rgba(15,110,86,0.88)]">
            <span className="text-[9px] font-medium tracking-wide text-[#E1F5EE]">
              ✓ DÉJÀ LU
            </span>
          </div>
        )}
      </div>

      <h3 className="text-[14px] lg:text-[16px] font-semibold text-center line-clamp-2">
        {title}
      </h3>
      <p className="text-[11px] lg:text-[13px] italic text-center line-clamp-1">
        {authors?.join(', ')}
      </p>
    </div>
  );
}
