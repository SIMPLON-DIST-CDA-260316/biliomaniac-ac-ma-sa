import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';

const navigationLinks = [
  { path: '/', label: 'Accueil' },
  { path: '/nos-livres', label: 'Nos livres' },
  { path: '/nouveautes', label: 'Nouveautés' },
  { path: '/coup-coeur', label: 'Coup de cœur' },
  { path: '/ma-bibliotheque', label: 'Ma bibliothèque' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((open) => !open);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <nav
      aria-label="Navigation principale"
      className="flex w-full items-center justify-between"
    >
      <Link to="/" onClick={closeMenu} className="inline-flex items-center">
        <img
          src="/logoBibliomaniac.svg"
          alt="Bibliomaniac"
          className="block h-16 w-auto -translate-y-1 md:-translate-y-2"
        />
      </Link>

      <button
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="primary-menu"
        aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        onClick={toggleMenu}
        className="relative z-[60] inline-flex translate-y-2 items-center justify-center p-2 text-[var(--text-h)] md:hidden"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {isMenuOpen ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <ul
        id="primary-menu"
        className={`${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} fixed top-0 right-0 z-50 flex h-dvh w-72 max-w-[80vw] flex-col gap-2 bg-[var(--bg)] p-6 pt-20 shadow-xl transition-transform duration-500 ease-out md:static md:h-auto md:w-auto md:max-w-none md:translate-x-0 md:flex-row md:items-center md:gap-6 md:bg-transparent md:p-0 md:shadow-none`}
      >
        {navigationLinks.map(({ path, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              end={path === '/'}
              onClick={closeMenu}
              className={({ isActive }) =>
                `block py-2 no-underline hover:text-[var(--text-hover)] ${
                  isActive ? 'text-[var(--text-hover)]' : 'text-[var(--text)]'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
