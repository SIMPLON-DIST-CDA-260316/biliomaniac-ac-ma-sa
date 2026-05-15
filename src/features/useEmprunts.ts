import { useState } from 'react';
import { SEED_DATA } from '../shared/data/seed';
import type { EmpruntType } from '../types/Book.ts';

const STORAGE_KEY = 'bibliomaniac_emprunts';
const SEEDED_KEY = 'bibliomaniac_seeded_emprunts';

export type Statut = 'en_cours' | 'rendu';

function initEmprunts(): EmpruntType[] {
  if (localStorage.getItem(SEEDED_KEY)) {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA.emprunts));
  localStorage.setItem(SEEDED_KEY, 'true');
  return SEED_DATA.emprunts as EmpruntType[];
}

export function useEmprunts() {
  const [emprunts] = useState<EmpruntType[]>(() => initEmprunts());

  const empruntEnCours = (volumeId: string) =>
    emprunts.find((e) => e.volumeId === volumeId && e.statut === 'en_cours');

  const estRendu = (volumeId: string) =>
    emprunts.some((e) => e.volumeId === volumeId && e.statut === 'rendu');

  return {
    emprunts,
    empruntEnCours,
    estRendu,
  };
}
