import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const navLinks = [
  { label: 'Work',    href: '#work' },
  { label: 'Skills',  href: '#skills' },
  { label: 'About',   href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Wordmark */}
        <a
          href="#home"
          className="navbar__logo"
          onClick={e => { e.preventDefault(); scrollTo('#home'); }}
          aria-label="Home"
        >
          Anshida Ansari
        </a>

        {/* Desktop Nav */}
        <nav className="navbar__links" aria-label="Primary navigation">
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="navbar__link"
              onClick={e => { e.preventDefault(); scrollTo(l.href); }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://drive.google.com/file/d/13Y93BNYwIT4fc9VzG09eGJI4ZjGXtphs/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark navbar__resume"
            id="nav-resume-link"
          >
            Resume ↗
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          id="nav-mobile-toggle"
        >
          {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile" role="dialog" aria-label="Mobile navigation">
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="navbar__mobile-link"
              onClick={e => { e.preventDefault(); scrollTo(l.href); }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://drive.google.com/file/d/13Y93BNYwIT4fc9VzG09eGJI4ZjGXtphs/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark navbar__mobile-resume"
            id="nav-mobile-resume-link"
          >
            Resume ↗
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
