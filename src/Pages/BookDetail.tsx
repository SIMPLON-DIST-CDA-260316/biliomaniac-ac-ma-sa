import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Book } from "../types/Book";
import { ReservedButton } from "../shared/components/ReservedButton";

function removeHtmlTags(raw: string) {
  return raw.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractCategory(cat: string) {
  return cat.split("/")[0].trim();
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState<Book | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [resumeOuvert, setResumeOuvert] = useState(false);

  useEffect(() => {
    if (!id) return;

    const cache = localStorage.getItem("books_cache");
    if (cache) {
      const livres: Book[] = JSON.parse(cache);
      const livreFound = livres.find(b => b.id === id);
      if (livreFound) {
        setBookData(livreFound);
        setIsFetching(false);
        return;
      }
    }

    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`)
      .then(res => {
        if (!res.ok) throw new Error(`erreur ${res.status}`);
        return res.json();
      })
      .then(data => {
        setBookData(data);
      })
      .catch(err => {
        console.error("Problème lors du chargement du livre :", err);
        setFetchError("Ce livre n'a pas pu être chargé, réessaie plus tard.");
      })
      .finally(() => {
        setIsFetching(false);
      });

  }, [id]);

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Chargement…
      </div>
    );
  }

  if (fetchError || !bookData) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {fetchError ?? "Ce livre est introuvable."}
      </div>
    );
  }

  const { title, authors, description, publisher, publishedDate, categories, imageLinks } = bookData.volumeInfo;

  const couverture = imageLinks?.thumbnail ?? imageLinks?.smallThumbnail ?? null;

  let auteurs = null;
  if (authors && authors.length > 0) {
    auteurs = authors.join(", ");
  }

  let resume = null;
  if (description) {
    resume = removeHtmlTags(description);
  }

  const resumeLong = resume != null && resume.length > 300;
  let resumeAffiche = resume;
  if (resumeLong && !resumeOuvert) {
    resumeAffiche = resume!.slice(0, 300) + "…";
  }

  let categoriesUniques: string[] = [];
  if (categories) {
    const extraites = categories.map(extractCategory);
    categoriesUniques = [...new Set(extraites)];
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        ← Retour
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="flex-shrink-0 flex flex-col items-center gap-3">
          {couverture ? (
            <img
              src={couverture}
              alt={`Couverture de ${title}`}
              className="w-44 rounded shadow-lg"
            />
          ) : (
            <div className="w-44 h-64 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
              Pas de couverture
            </div>
          )}
        </aside>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {auteurs && (
              <p className="text-gray-600 mt-1">{auteurs}</p>
            )}
          </div>

          {categoriesUniques.length > 0 && (
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {categoriesUniques.map(cat => (
                <li key={cat} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {cat}
                </li>
              ))}
            </ul>
          )}

          <div className="text-sm text-gray-500 space-y-1">
            {publishedDate && (
              <p>Parution : <span className="text-gray-700">{publishedDate}</span></p>
            )}
            {publisher && (
              <p>Édition : <span className="text-gray-700">{publisher}</span></p>
            )}
          </div>

          {resume && (
            <div>
              <h2 className="font-semibold mb-1">Résumé</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {resumeAffiche}
              </p>
              {resumeLong && (
                <button
                  onClick={() => setResumeOuvert(!resumeOuvert)}
                  className="mt-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {resumeOuvert ? "Lire moins" : "Lire plus"}
                </button>
              )}
            </div>
          )}

          <ReservedButton />
        </div>
      </div>
    </section>
  );
}