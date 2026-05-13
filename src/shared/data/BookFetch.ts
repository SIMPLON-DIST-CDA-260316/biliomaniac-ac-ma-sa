import type { Book } from '../../types/Book';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

// Les catégories qu'on fetch pour remplir le catalogue. Change la liste pour changer les livres de l'app.
export const CATEGORIES = [
  'Fiction',
  'classics',
  'biography',
  'literature',
  'romance',
  'mystery',
  'novel',
  'art',
  'cooking',
  'fantasy',
];
const BOOKS_PER_CATEGORY = 10;

// Quelle tranche du catalogue va à chaque page.
const NOUVEAUTES_SLICE = [0, 20] as const;
const COUP_DE_COEUR_SLICE = [20, 40] as const;

// On cache la promesse pour que les 3 pages catalogue partagent un seul fetch.
let cataloguePromise: Promise<Book[]> | null = null;

// Les URLs d'images HD d'un livre. Les thumbnails renvoyés par Google sont petits et flous,
// donc on construit nos propres URLs à partir du volumeId pour avoir des images nettes.
export function makeImagesClear(volumeId: string): string[] {
  return [
    `https://books.google.com/books/publisher/content/images/frontcover/${volumeId}?fife=w1600-h2400&source=gbs_api`,
    `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&zoom=6&source=gbs_api`,
    `https://books.google.com/books/content?id=${volumeId}&printsec=frontcover&img=1&zoom=4&source=gbs_api`,
  ];
}

// On vire les livres incomplets (pas de titre, pas d'auteur ou pas de couverture),
// sinon BookCard finit avec des cases vides.
function hasRequiredFields(book: Omit<Book, 'coverUrls'>): boolean {
  const { title, authors, imageLinks } = book.volumeInfo;
  return Boolean(title)
    && Array.isArray(authors) && authors.length > 0
    && Boolean(imageLinks?.thumbnail);
}

// Ajoute les coverUrls HD au livre brut de l'API, pour que les pages n'aient pas à construire les URLs elles-mêmes.
function clearImages(rawBook: Omit<Book, 'coverUrls'>): Book {
  return {
    ...rawBook,
    coverUrls: makeImagesClear(rawBook.id),
  };
}

// Construit une URL Google Books proprement. Factorisé ici pour ne pas refaire
// la concat à la main dans chaque fetch (et oublier la clé API ou mal encoder
// les paramètres). `query` est optionnelle parce que `fetchBookById` n'en a pas
// besoin : il fetch un livre par son ID dans le path. La clé API est ajoutée
// auto si elle est définie dans le .env.
function buildRequestUrl(path: string, query?: string): URL {
  const url = new URL(`${GOOGLE_BOOKS_API}${path}`);
  if (query) url.searchParams.set('q', query);
  if (API_KEY) url.searchParams.set('key', API_KEY);
  return url;
}

// Re-essaie si Google répond 503 ou 429. Ça arrive souvent sur cette API.
async function fetchWithRetry(url: URL, maxAttempts = 2): Promise<Response> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(url);
    if (response.ok) return response;
    const isTransient = response.status === 503 || response.status === 429;
    if (!isTransient || attempt === maxAttempts) return response;
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
  }
  throw new Error('unreachable');
}

// Mélange Fisher-Yates pour mixer les catégories.
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Fetch une catégorie. On demande 2× le nombre final parce qu'on va en jeter
// après filtrage, donc il faut une marge pour quand même en garder assez.
async function fetchCategory(category: string): Promise<Book[]> {
  const url = buildRequestUrl('/volumes', `subject:${category}`);
  url.searchParams.set('orderBy', 'newest');
  url.searchParams.set('maxResults', String(BOOKS_PER_CATEGORY * 2));

  const response = await fetchWithRetry(url);
  if (!response.ok) {
    throw new Error(`Google Books fetch failed for category "${category}" (${response.status})`);
  }
  const data = await response.json();
  const items = (data.items ?? []) as Omit<Book, 'coverUrls'>[];
  return items
    .filter(hasRequiredFields)
    .slice(0, BOOKS_PER_CATEGORY)
    .map((book) => ({ ...clearImages(book), fetchedCategory: category }));
}

// On fetch les catégories 4 par 4, sinon Google throttle. Si une catégorie plante
// on garde les autres — on throw seulement si tout plante.
async function fetchCatalogue(): Promise<Book[]> {
  const CONCURRENCY = 3;
  const allBooks: Book[] = [];
  for (let i = 0; i < CATEGORIES.length; i += CONCURRENCY) {
    const batch = CATEGORIES.slice(i, i + CONCURRENCY);
    const settled = await Promise.allSettled(batch.map(fetchCategory));
    for (const result of settled) {
      if (result.status === 'fulfilled') allBooks.push(...result.value);
    }
  }
  if (allBooks.length === 0) {
    throw new Error('Google Books is unavailable — no categories could be fetched.');
  }
  return shuffle(allBooks);
}

// Cache la promesse. Si 2 pages appellent en même temps, elles partagent le même fetch.
// On vide le cache si ça plante pour pouvoir re-essayer.
async function getCatalogue(): Promise<Book[]> {
  if (!cataloguePromise) {
    cataloguePromise = fetchCatalogue().catch((error) => {
      cataloguePromise = null;
      throw error;
    });
  }
  return cataloguePromise;
}

// Utilisé par : page Nos livres. Tout le catalogue mélangé (~50 livres).
export async function fetchNosLivres(): Promise<Book[]> {
  return getCatalogue();
}

// Utilisé par : page Nouveautés. Les 20 premiers du catalogue.
export async function fetchNouveautes(): Promise<Book[]> {
  const catalogue = await getCatalogue();
  return catalogue.slice(...NOUVEAUTES_SLICE);
}

// Utilisé par : page Coup de cœur. Livres 20 à 39 du catalogue.
export async function fetchCoupDeCoeur(): Promise<Book[]> {
  const catalogue = await getCatalogue();
  return catalogue.slice(...COUP_DE_COEUR_SLICE);
}

// Utilisé par : page détail d'un livre. Fetch un livre par son volumeId.
export async function fetchBookById(id: string): Promise<Book> {
  const response = await fetchWithRetry(buildRequestUrl(`/volumes/${id}`));
  if (!response.ok) {
    throw new Error(`Google Books fetch failed for id "${id}" (${response.status})`);
  }
  const rawBook = (await response.json()) as Omit<Book, 'coverUrls'>;
  return clearImages(rawBook);
}

// Pour Accueil (Mes emprunts) et Ma bibliothèque (Favoris + Empruntés).
// Passez la liste d'IDs (localStorage, context React, peu importe d'où elle vient)
// — cette fonction sait juste récupérer les livres qui vont avec.
export async function fetchBooksByIds(ids: string[]): Promise<Book[]> {
  return Promise.all(ids.map(fetchBookById));
}

// Barre de recherche (phase 4) → recherche libre sur Google Books.
export async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetchWithRetry(buildRequestUrl('/volumes', query));
  if (!response.ok) {
    throw new Error(`Google Books search failed (${response.status})`);
  }
  const data = await response.json();
  const items = (data.items ?? []) as Omit<Book, 'coverUrls'>[];
  return items.filter(hasRequiredFields).map(clearImages);
}
