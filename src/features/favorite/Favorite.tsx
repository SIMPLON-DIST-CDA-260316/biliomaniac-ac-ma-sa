// src/components/FavoriteButton.tsx
import { useFavoris } from '../../features/useFavoris';

interface Props {
  bookId: string;
}

const FavoriteButton = ({ bookId }: Props) => {
  const { isFavorite, toggleFavorite } = useFavoris();

  return (
    <img
      src={
        isFavorite(bookId) ? '/images/starFull.svg' : '/images/starEmpty.svg'
      }
      alt=""
      onClick={() => toggleFavorite(bookId)}
      className="cursor-pointer"
    />
  );
};

export default FavoriteButton;
