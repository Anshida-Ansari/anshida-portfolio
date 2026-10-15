import React, { useEffect, useState } from 'react';
import { experienceApi, type ExperienceItem } from '../api';
import './Experience.css';

const staticExperiences: ExperienceItem[] = [
  {
    role: 'Web Developer Intern',
    company: 'Client Web Solutions',
    type: 'Internship',
    period: 'Recent',
    description:
      'Contributed to the development of real-world client websites as part of an internship engagement, working on frontend implementation, UI engineering, and responsive design across multiple active projects.',
    contributions: [
      'Developed and maintained client websites including Salamatek Medical Center, Sameera Healthcare, and Dazz Tradlink',
      'Implemented responsive layouts and translated design requirements into clean, performant web pages',
      'Collaborated on frontend development for the Dopeminex digital marketing website',
      'Worked within a professional development environment, adhering to client specifications and project timelines',
    ],
  },
  {
    role: 'Full Stack Developer',
    company: 'Independent & SaaS Development',
    type: 'Projects',
    period: 'Ongoing',
    description:
      'Independently designing and building end-to-end full-stack web applications, exploring SaaS product development and e-commerce from initial architecture through API design, database schemas, authentication, and deployment.',
    contributions: [
      'Built Sprintly, a full-stack SaaS project management platform using the MERN stack with JWT authentication and role-based access',
      'Developed Lush Scents, an e-commerce platform with product catalogs, shopping cart flow, and responsive checkout UX',
      'Engineered RESTful backend APIs with Node.js and Express.js, integrated with MongoDB databases',
      'Managed cloud deployment, environment configuration, and continuous production monitoring',
    ],
  },
];

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(staticExperiences);

  useEffect(() => {
    experienceApi.getAll()
      .then((data) => { if (data.length > 0) setExperiences(data); })
      .catch(() => { /* use static fallback */ });
  }, []);

  return (
    <section id="experience" className="section section-border experience" aria-labelledby="experience-heading">
      <div className="container">
        <div className="experience__inner">
          {/* Left Column / Header */}
          <div className="experience__left reveal">
            <span className="eyebrow">Background</span>
            <h2 id="experience-heading" className="heading-lg experience__title">
              Work &<br />Experience
            </h2>
            <p className="body-sm experience__note">
              Hands-on experience delivering client web solutions and architecting full-stack digital products.
            </p>
          </div>

          {/* Right Column / Timeline List */}
          <div className="experience__list">
            {experiences.map((exp, index) => (
              <article
                key={exp._id || exp.role}
                className={`experience-card reveal reveal-delay-${index + 1}`}
              >
                <div className="experience-card__header">
                  <div className="experience-card__meta">
                    <span className="experience-card__period">{exp.period}</span>
                    <span className="experience-card__type">{exp.type}</span>
                  </div>
                  <h3 className="experience-card__role">{exp.role}</h3>
                  <div className="experience-card__company">{exp.company}</div>
                </div>

                <p className="experience-card__desc body-text">{exp.description}</p>

                <div className="experience-card__contributions">
                  <h4 className="eyebrow experience-card__contrib-title">Key Contributions</h4>
                  <ul className="experience-card__points">
                    {exp.contributions.map((point, i) => (
                      <li key={i} className="experience-card__point">
                        <span className="experience-card__bullet" aria-hidden="true">—</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
