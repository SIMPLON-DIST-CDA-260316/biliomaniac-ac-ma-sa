import { BrowserRouter, Routes, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Add your routes here */}
          {/* <Route index element={<Home />} /> */}
          {/* <Route path="book/:id" element={<BookDetail />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
