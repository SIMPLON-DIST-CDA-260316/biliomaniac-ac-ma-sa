# Bibliomaniac

Application web de bibliothèque numérique permettant de rechercher des livres via l'API Google Books, consulter leurs informations et explorer un catalogue sur mobile comme sur desktop.

## Fonctionnalités

- Recherche de livres par titre, auteur ou ISBN
- Affichage des résultats sous forme de liste
- Fiche détaillée pour chaque livre
- Gestion des états de chargement, d'erreur et d'absence de résultat
- Interface responsive (mobile first) et accessible

## Tech stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 6
- [Vite](https://vite.dev/) 8
- [Tailwind CSS](https://tailwindcss.com/) 4
- [ESLint](https://eslint.org/) 9
- [Prettier](https://prettier.io/) 3
- [API Google Books](https://developers.google.com/books)

## Prérequis

- [Node.js](https://nodejs.org/) >= 20
- npm >= 10

## Installation

```bash
git clone https://github.com/<votre-organisation>/bibliomaniac.git
cd bibliomaniac
npm install
```

## Lancement

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile TypeScript et build de production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run format` | Formate le code avec Prettier |
| `npm run format:check` | Vérifie le formatage sans modifier |

## Structure du projet

```
bibliomaniac/
├── public/             # Fichiers statiques
├── src/
│   ├── App.tsx         # Composant principal
│   ├── main.tsx        # Point d'entrée
│   ├── index.css       # Styles globaux + Tailwind
│   └── App.css         # Styles du composant App
├── .prettierrc         # Configuration Prettier
├── eslint.config.js    # Configuration ESLint
├── tsconfig.json       # Configuration TypeScript
└── vite.config.ts      # Configuration Vite + Tailwind
```

## Déploiement

L'application est déployée sur [Vercel](https://vercel.com/).

Chaque push sur `main` déclenche un déploiement en production. Les pull requests génèrent des previews automatiques.

## Organisation du travail

- Travail en trinôme
- Une branche par fonctionnalité
- Pull requests pour chaque évolution
- Commits suivant [Conventional Commits](https://www.conventionalcommits.org/)
- Suivi des tâches via GitHub Projects

## Maquettes

Les maquettes et le prototype cliquable sont disponibles sur [Figma](<lien-figma>).

## Auteurs

- A renseigner
