import { useParams, useNavigate } from "react-router";
import { books } from "../shared/data/data";
import Favorite from "../shared/components/Favorite";
 
export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
 
  const book = books.find((b) => b.id === id);
 
  if (!book) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Livre introuvable.
      </div>
    );
  }
 
  const { title, authors, description, publisher, publishedDate, categories, imageLinks } = book.volumeInfo;
  const cover = imageLinks?.thumbnail ?? imageLinks?.smallThumbnail;
 
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        ← Retour
      </button>
 
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          {cover ? (
            <img
              src={cover}
              alt={`Couverture de ${title}`}
              className="w-44 rounded shadow-lg"
            />
          ) : (
            <div className="w-44 h-64 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
              Pas de couverture
            </div>
          )}
          <Favorite bookId={book.id} />
        </div>
 
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {authors && (
              <p className="text-gray-600 mt-1">{authors.join(", ")}</p>
            )}
          </div>
 
          {categories && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
 
          <div className="flex flex-col gap-1 text-sm text-gray-500">
            {publishedDate && <p>Parution : {publishedDate}</p>}
            {publisher && <p>Édition : {publisher}</p>}
          </div>
 
          {description && (
            <div>
              <h2 className="font-semibold mb-1">Résumé</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
            </div>
          )}
 
          <button className="mt-2 w-fit bg-black text-white text-sm px-6 py-2 rounded hover:bg-gray-800 transition-colors">
            Réserver
          </button>
        </div>
      </div>
    </section>
  );
}