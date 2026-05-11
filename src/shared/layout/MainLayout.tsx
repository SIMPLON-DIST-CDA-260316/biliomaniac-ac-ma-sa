import { Outlet } from 'react-router';
import Navbar from '../Navbar';

export default function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="border-b border-[var(--border)] px-6 md:px-16">
        <Navbar />
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border)] px-6 py-6 text-center text-sm">
        <p>Bibliomaniac &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
