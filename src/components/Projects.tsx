import React, { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GitHubIcon } from './Icons';
import { projectsApi, type Project } from '../api';
import './Projects.css';

// Static fallback data (used when server is unreachable)
const staticProjects: Project[] = [
  {
    number: '01',
    title: 'Sprintly',
    category: 'SaaS · Project Management',
    type: 'Personal Project',
    description:
      'A full-stack project management platform inspired by tools like Jira. Built around organizing projects, managing tasks, and supporting team workflows — exploring the engineering behind modern SaaS tools.',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'REST API', 'Auth'],
    liveUrl: 'https://app.anshida.online/',
    repoUrl: 'https://github.com/Anshida-Ansari/Sprintly-Backend',
    repoLabel: 'Backend Repo',
  },
  {
    number: '02',
    title: 'Lush Scents',
    category: 'E-commerce · Web Development',
    type: 'Personal Project',
    description:
      'An e-commerce application focused on product presentation, responsive interfaces, and core shopping functionality. Built full-stack from catalog to cart.',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'CSS'],
    repoUrl: 'https://github.com/Anshida-Ansari/Lush-Scentes',
    repoLabel: 'View Repository',
  },
  {
    number: '03',
    title: 'Dopeminex',
    category: 'Digital Marketing · Web Development',
    type: 'Client Work',
    description:
      'Frontend implementation and responsive design for a digital marketing business website. Focused on translating requirements into a performant, mobile-friendly experience.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    liveUrl: 'https://www.dopeminex.com/',
    repoUrl: 'https://github.com/Anshida-Ansari/dopeminex-websites',
    repoLabel: 'Repository',
  },
  {
    number: '04',
    title: 'Healthcare Websites',
    category: 'Healthcare · Client Work',
    type: 'Internship',
    description:
      'Frontend development and responsive layout implementation for Salamatek Medical Center and Sameera Healthcare. Delivered as part of an internship engagement — translating design requirements into functional, accessible web pages.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    note: 'Internship contribution — frontend development and responsive layouts.',
  },
  {
    number: '05',
    title: 'Dazz Tradlink',
    category: 'Business Website · Client Work',
    type: 'Internship',
    description:
      'Website development for a trading and business services company. Contribution included frontend implementation, responsive design, and meeting client specifications during my internship.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    note: 'Internship contribution — frontend development and responsiveness.',
  },
];

const ProjectRow: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const id = project._id || project.title.toLowerCase().replace(/\s+/g, '-');
  return (
    <article
      className={`project-row reveal reveal-delay-${Math.min(index + 1, 5)}`}
      id={`project-${id}`}
    >
      {/* Left — number + category */}
      <div className="project-row__meta">
        <span className="project-row__number body-xs">{project.number}</span>
        <span className="project-row__type body-xs">{project.type}</span>
      </div>

      {/* Center — main content */}
      <div className="project-row__body">
        <div className="project-row__top">
          <h3 className="project-row__title heading-md">{project.title}</h3>
          <span className="project-row__category eyebrow">{project.category}</span>
        </div>
        <p className="project-row__desc body-text">{project.description}</p>

        {project.note && (
          <p className="project-row__note body-xs">↳ {project.note}</p>
        )}

        <div className="project-row__tech">
          {project.tech.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Right — links */}
      <div className="project-row__links">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-row__link project-row__link--live"
            id={`project-${id}-live`}
            aria-label={`View ${project.title} live site`}
          >
            <ArrowUpRight size={16} strokeWidth={1.5} />
            <span>Live Site</span>
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-row__link"
            id={`project-${id}-repo`}
            aria-label={`${project.title} repository on GitHub`}
          >
            <GitHubIcon size={14} />
            <span>{project.repoLabel || 'Repository'}</span>
          </a>
        )}
      </div>
    </article>
  );
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(staticProjects);

  useEffect(() => {
    projectsApi.getAll()
      .then((data) => { if (data.length > 0) setProjects(data); })
      .catch(() => { /* silently use static fallback */ });
  }, []);

  return (
    <section id="work" className="section section-border projects" aria-labelledby="work-heading">
      <div className="container">
        {/* Section label */}
        <div className="projects__header reveal">
          <span className="eyebrow">Selected Work</span>
          <h2 id="work-heading" className="heading-lg projects__title">
            Projects
          </h2>
        </div>

        {/* Project list */}
        <div className="projects__list" role="list">
          {projects.map((p, i) => (
            <ProjectRow key={p._id || p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
