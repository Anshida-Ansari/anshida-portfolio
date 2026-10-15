import React, { useEffect, useRef } from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  const headlineRef = useRef<HTMLDivElement>(null);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Parallax on hero headline — subtle
  useEffect(() => {
    const onScroll = () => {
      if (!headlineRef.current) return;
      const y = window.scrollY;
      headlineRef.current.style.transform = `translateY(${y * 0.12}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="home" className="hero" aria-label="Introduction">
      {/* Top meta row */}
      <div className="hero__meta-top container">
        <div className="hero__meta-left">
          <p className="body-xs hero__tagline">MERN Stack · SaaS Development</p>
        </div>
        <div className="hero__meta-right">
          <span className="hero__status">
            <span className="hero__status-dot" aria-hidden="true" />
            Open to opportunities
          </span>
        </div>
      </div>

      {/* Main display headline */}
      <div className="hero__headline-block container" ref={headlineRef}>
        <h1 className="hero__headline display-hero">
          <span className="hero__hl-row">Full Stack</span>
          <span className="hero__hl-row hero__hl-row--indent">Developer.</span>
        </h1>
      </div>

      {/* Bottom info row — scattered editorial layout */}
      <div className="hero__bottom container">
        <div className="hero__bottom-left">
          <p className="body-text hero__desc">
            Building digital products<br />
            that work beyond the interface.
          </p>
          <div className="hero__tags">
            <span className="tag">React</span>
            <span className="tag">Node.js</span>
            <span className="tag">MongoDB</span>
            <span className="tag">SaaS</span>
          </div>
        </div>

        <div className="hero__bottom-center">
          <p className="eyebrow hero__year">2026 Portfolio</p>
          <p className="body-sm hero__intro">
            I'm Anshida — a full-stack developer
            passionate about SaaS platforms and
            real-world web applications.
          </p>
        </div>

        <div className="hero__bottom-right">
          <div className="hero__name-block">
            <span className="hero__name display">Anshida<br />Ansari</span>
          </div>
          <div className="hero__ctas">
            <button
              id="hero-cta-work"
              className="hero__cta-work"
              onClick={scrollToWork}
            >
              Selected Work ↓
            </button>
            <button
              id="hero-cta-contact"
              className="btn btn-dark"
              onClick={scrollToContact}
            >
              Let's Connect
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
