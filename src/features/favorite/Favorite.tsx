interface Props {
  isFavorite: boolean;
  onToggle: () => void;
}

const FavoriteButton = ({ isFavorite, onToggle }: Props) => {

<<<<<<< HEAD
    const handleClick = () => {
        setIsFavorite((prev) => !prev);
    };

    return (
        <img src={isFavorite ? "/images/starFull.svg" : "/images/starEmpty.svg"}
        alt="" onClick={handleClick}
        className="cursor-pointer w-8 h-8"/>
    );
=======
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
>>>>>>> bb4b082f8e1b2e4a6958e4432ed445e0b40700df
};

export default FavoriteButton;
