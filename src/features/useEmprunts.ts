// src/lib/useEmprunts.ts
import { useState } from 'react';
import { SEED_DATA } from '../shared/data/seed';

const STORAGE_KEY = 'bibliomaniac_emprunts';
const SEEDED_KEY = 'bibliomaniac_seeded_emprunts';

export type Statut = 'en_cours' | 'rendu';

export interface Emprunt {
  volumeId: string;
  dateEmprunt: string;
  dateRestitution: string;
  statut: Statut;
}

function initEmprunts(): Emprunt[] {
  if (localStorage.getItem(SEEDED_KEY)) {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA.emprunts));
  localStorage.setItem(SEEDED_KEY, 'true');
  return SEED_DATA.emprunts as Emprunt[];
}

export function useEmprunts() {
  const [emprunts, setEmprunts] = useState<Emprunt[]>(() => initEmprunts());

  function save(updated: Emprunt[]) {
    setEmprunts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function ajouterEmprunt(volumeId: string, dateRestitution: string) {
    const dejaEmprunte = emprunts.some(
      (e) => e.volumeId === volumeId && e.statut === 'en_cours',
    );
    if (dejaEmprunte) return;
    save([
      ...emprunts,
      {
        volumeId,
        dateEmprunt: new Date().toISOString().split('T')[0],
        dateRestitution,
        statut: 'en_cours',
      },
    ]);
  }

  function rendreEmprunt(volumeId: string) {
    save(
      emprunts.map((e) =>
        e.volumeId === volumeId && e.statut === 'en_cours'
          ? { ...e, statut: 'rendu' }
          : e,
      ),
    );
  }

  const empruntEnCours = (volumeId: string) =>
    emprunts.find((e) => e.volumeId === volumeId && e.statut === 'en_cours');

  const estEmprunte = (volumeId: string) => !!empruntEnCours(volumeId);

  return {
    emprunts,
    ajouterEmprunt,
    rendreEmprunt,
    empruntEnCours,
    estEmprunte,
  };
}
