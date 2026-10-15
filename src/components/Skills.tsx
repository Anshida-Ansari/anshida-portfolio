import React, { useEffect, useState } from 'react';
import { skillsApi, type SkillGroup } from '../api';
import './Skills.css';

const staticSkillGroups: SkillGroup[] = [
  {
    label: 'Frontend',
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Redux', 'Zustand'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'Authentication', 'Middleware'],
  },
  {
    label: 'Databases',
    skills: ['MongoDB', 'Mongoose', 'SQL'],
  },
  {
    label: 'Tools & Workflow',
    skills: ['Git', 'GitHub', 'Testing', 'Debugging', 'Deployment', 'CI/CD'],
  },
];

const Skills: React.FC = () => {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(staticSkillGroups);

  useEffect(() => {
    skillsApi.getAll()
      .then((data) => { if (data.length > 0) setSkillGroups(data); })
      .catch(() => { /* use static fallback */ });
  }, []);

  return (
    <section id="skills" className="section section-border skills" aria-labelledby="skills-heading">
      <div className="container">
        <div className="skills__inner">
          {/* Header */}
          <div className="skills__left reveal">
            <span className="eyebrow">Stack</span>
            <h2 id="skills-heading" className="heading-lg skills__title">
              Technical<br />Expertise
            </h2>
            <p className="body-sm skills__note">
              Technologies I work with across the stack.
              Proficiency varies by tool and project context.
            </p>
          </div>

          {/* Groups */}
          <div className="skills__groups">
            {skillGroups.map((group, i) => (
              <div
                key={group._id || group.label}
                className={`skill-group reveal reveal-delay-${i + 1}`}
              >
                <h3 className="skill-group__label eyebrow">{group.label}</h3>
                <div className="skill-group__list">
                  {group.skills.map(s => (
                    <span key={s} className="skill-item">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
