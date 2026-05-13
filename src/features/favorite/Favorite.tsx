interface Props {
  isFavorite: boolean;
  onToggle: () => void;
}

const FavoriteButton = ({ isFavorite, onToggle }: Props) => {

  return (
    <img
      src={
        isFavorite ? '/images/starFull.svg' : '/images/starEmpty.svg'
      }
      alt="favoris"
      onClick={onToggle}
      className="cursor-pointer"
    />
  );
};

export default FavoriteButton;
