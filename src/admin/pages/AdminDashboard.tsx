import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi, skillsApi, experienceApi } from '../../api';
import { Spinner } from '../components/AdminUI';

interface Stats {
  projects: number;
  skills: number;
  experience: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectsApi.getAllAdmin(),
      skillsApi.getAllAdmin(),
      experienceApi.getAllAdmin(),
    ])
      .then(([projects, skills, experience]) => {
        setStats({ projects: projects.length, skills: skills.length, experience: experience.length });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const sections = [
    {
      to: '/admin/projects',
      label: 'Projects',
      count: stats?.projects,
      desc: 'Manage your work and case studies',
      color: '#7c3aed',
    },
    {
      to: '/admin/skills',
      label: 'Skill Groups',
      count: stats?.skills,
      desc: 'Frontend, backend, database, tooling',
      color: '#0891b2',
    },
    {
      to: '/admin/experience',
      label: 'Experience',
      count: stats?.experience,
      desc: 'Career timeline and contributions',
      color: '#059669',
    },
    {
      to: '/admin/about',
      label: 'About',
      count: '—',
      desc: 'Bio, principles, and interests',
      color: '#d97706',
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1>Overview</h1>
          <p>Your portfolio content at a glance</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn--ghost"
          id="admin-view-site-btn"
        >
          ↗ View Live Portfolio
        </a>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {sections.map((s) => (
          <div key={s.to} className="admin-stat" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div className="admin-stat__label">{s.label}</div>
            <div className="admin-stat__value">{s.count}</div>
            <div className="admin-stat__desc">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="admin-card">
        <div className="admin-card__header">
          <span className="admin-card__title">Quick Actions</span>
        </div>
        <div className="admin-card__body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="admin-btn admin-btn--ghost"
              id={`admin-quicklink-${s.label.toLowerCase().replace(/\s/g, '-')}`}
              style={{ justifyContent: 'flex-start', textDecoration: 'none' }}
            >
              → Manage {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info notice */}
      <div style={{
        marginTop: '1.5rem',
        background: 'rgba(124,58,237,0.06)',
        border: '1px solid rgba(124,58,237,0.15)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        fontSize: '0.8125rem',
        color: '#aaa',
        lineHeight: 1.6,
      }}>
        <strong style={{ color: '#e8e8e8' }}>📡 API Connected</strong> — Changes you make here are saved to MongoDB and reflected on the public portfolio in real time. Make sure the server is running at <code style={{ color: '#7c3aed', background: 'rgba(124,58,237,0.1)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>localhost:5000</code>.
      </div>
    </div>
  );
};

export default AdminDashboard;
