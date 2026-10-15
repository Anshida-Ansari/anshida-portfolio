import React, { useEffect, useState } from 'react';
import { aboutApi, type AboutData } from '../api';
import './About.css';

const staticAbout: AboutData = {
  lead: "I'm a full-stack developer who bridges the gap between clean product design and reliable backend systems.",
  paragraphs: [
    "From architecting applications from scratch to testing, deploying, and maintaining them in production, I genuinely enjoy working across the entire development lifecycle. I have contributed to real-world client websites during my internship and built full-stack SaaS projects that tackle real operational flows.",
    "I am particularly drawn to SaaS platforms and helping founders turn early ideas into scalable, functional digital products. The engineering puzzles behind product development — data modeling, authentication mechanics, state synchronization, and snappy user interfaces — are what make this work exciting.",
  ],
  status: 'Based in Kerala, India · Open to Remote & Relocation',
  interests: [
    'Full Stack Developer roles',
    'MERN Stack engineering',
    'SaaS product development',
    'React & Node.js positions',
    'RESTful API architecture',
    'Collaborative dev teams',
  ],
  principles: [
    {
      number: '01',
      title: 'Product-First Engineering',
      desc: 'Writing code that solves actual user problems and drives business value, not just implementing specs in isolation.',
    },
    {
      number: '02',
      title: 'End-to-End Ownership',
      desc: 'From data modeling and authentication to UI micro-interactions, responsive design, and production deployment.',
    },
    {
      number: '03',
      title: 'Maintainable & Scalable',
      desc: 'Clean directory structures, typed components, reusable patterns, and clear API boundaries that teams can grow with.',
    },
  ],
};

const About: React.FC = () => {
  const [about, setAbout] = useState<AboutData>(staticAbout);

  useEffect(() => {
    aboutApi.get()
      .then((data) => { if (data) setAbout(data); })
      .catch(() => { /* use static fallback */ });
  }, []);

  return (
    <section id="about" className="section section-border about" aria-labelledby="about-heading">
      <div className="container">
        <div className="about__inner">
          {/* Left Column / Header */}
          <div className="about__left reveal">
            <span className="eyebrow">Philosophy</span>
            <h2 id="about-heading" className="heading-lg about__title">
              About &<br />Approach
            </h2>
            <div className="about__status">
              <span className="about__status-dot" aria-hidden="true" />
              <span className="about__status-text">{about.status}</span>
            </div>
          </div>

          {/* Right Column / Narrative */}
          <div className="about__content">
            <div className="about__intro reveal reveal-delay-1">
              <p className="about__lead">{about.lead}</p>
              {about.paragraphs.map((p, i) => (
                <p key={i} className="body-text about__text">{p}</p>
              ))}
            </div>

            {/* Principles */}
            <div className="about__principles reveal reveal-delay-2">
              <span className="eyebrow about__section-label">Core Principles</span>
              <div className="about__principles-grid">
                {about.principles.map(p => (
                  <div key={p.number} className="principle-card">
                    <span className="principle-card__num">{p.number}</span>
                    <h3 className="principle-card__title">{p.title}</h3>
                    <p className="principle-card__desc">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests / Looking for */}
            <div className="about__interests reveal reveal-delay-3">
              <span className="eyebrow about__section-label">Currently Seeking</span>
              <div className="about__interests-list">
                {about.interests.map(item => (
                  <span key={item} className="interest-tag">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
