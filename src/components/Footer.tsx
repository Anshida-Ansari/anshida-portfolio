import React from 'react';
import { ArrowUp } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './Icons';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        {/* Top bar with huge statement or wordmark */}
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__name">ANSHIDA ANSARI</span>
            <span className="footer__tagline">FULL STACK DEVELOPER · MERN STACK</span>
          </div>

          <button
            type="button"
            className="footer__back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {currentYear} Anshida Ansari. Designed & developed with React, TypeScript & CSS.
          </p>

          <div className="footer__socials">
            <a
              href="https://github.com/Anshida-Ansari"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
              aria-label="GitHub profile (opens in new tab)"
              id="footer-github-link"
            >
              <GitHubIcon size={16} />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/anshida-ansari/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
              aria-label="LinkedIn profile (opens in new tab)"
              id="footer-linkedin-link"
            >
              <LinkedInIcon size={16} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
