import { useState } from "react";

export function ReservedButton() {
    const [reserved, setReserved] = useState(false);

    function handleClick() {
        if (!reserved) setReserved(true);
    }

    return (
        <button
            onClick={handleClick}
            className={`mt-2 w-fit text-sm px-6 py-2 rounded transition-colors ${reserved
                    ? "bg-green-600 text-white cursor-default"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
        >
            {reserved ? "Réservé !" : "Réserver"}
        </button>
    );
}