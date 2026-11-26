import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { scrollToSection } from '../../utils/scroll';
import { navLinks, profile } from '../../data/profile';
import './Navbar.scss';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (e: MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar${isScrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-logo">
          <a href="#home" onClick={(e) => handleNav(e, 'home')}>
            {profile.name}
          </a>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Open Menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close Menu">
            <i className="fas fa-times" />
          </button>
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={(e) => handleNav(e, link.id)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} />
          </button>
        </div>
      </div>
    </nav>
  );
}
