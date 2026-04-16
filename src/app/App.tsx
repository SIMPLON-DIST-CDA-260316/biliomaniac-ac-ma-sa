import { BrowserRouter, Routes, Route } from 'react-router';
import MainLayout from './MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="*" element={null} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
