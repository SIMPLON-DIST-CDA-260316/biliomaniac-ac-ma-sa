import { useState } from "react";

interface Props {
    bookId: string | number;
    defaultFavorite?: boolean;
}

const FavoriteButton = ({ defaultFavorite = false }: Props) => {
    const [isFavorite, setIsFavorite] = useState(defaultFavorite);

    const handleClick = () => {
        setIsFavorite((prev) => !prev);
    };

    return (
        <img
            src={isFavorite ? "/images/starFull.svg" : "/images/starEmpty.svg"}
            alt=""
            onClick={handleClick}
            className="cursor-pointer"
        />
    );
};

export default FavoriteButton;