import { BrowserRouter, Routes, Route } from 'react-router';
import MainLayout from '../shared/layout/MainLayout';
import { CatalogueProvider } from '../shared/context/CatalogueProvider';
import Accueil from '../Pages/Accueil';
import NosLivres from '../Pages/NosLivres';
import Nouveautes from '../Pages/Nouveautes';
import CoupDeCoeur from '../Pages/CoupDeCoeur';
import MaBibliotheque from '../Pages/MaBibliotheque';

export default function App() {
  return (
    <BrowserRouter>
      <CatalogueProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Accueil />} />
          <Route path="nos-livres" element={<NosLivres />} />
          <Route path="nouveautes" element={<Nouveautes />} />
          <Route path="coup-coeur" element={<CoupDeCoeur />} />
          <Route path="ma-bibliotheque" element={<MaBibliotheque />} />
        </Route>
      </Routes>
      </CatalogueProvider>
    </BrowserRouter>
  );
}
