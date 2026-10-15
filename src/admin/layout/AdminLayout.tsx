import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../admin.css';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const LayoutIcon = ({ d }: { d: string }) => (
  <svg className="admin-nav-link__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const navItems: NavItem[] = [
  {
    to: '/admin/dashboard',
    label: 'Dashboard',
    icon: <LayoutIcon d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" />,
  },
  {
    to: '/admin/projects',
    label: 'Projects',
    icon: <LayoutIcon d="M1.5 12.5l4-9 3 6 2-3 3 6" />,
  },
  {
    to: '/admin/skills',
    label: 'Skills',
    icon: <LayoutIcon d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" />,
  },
  {
    to: '/admin/experience',
    label: 'Experience',
    icon: <LayoutIcon d="M2 4h12M2 8h8M2 12h5" />,
  },
  {
    to: '/admin/about',
    label: 'About',
    icon: <LayoutIcon d="M8 8a3 3 0 100-6 3 3 0 000 6zm-5 7a5 5 0 0110 0" />,
  },
];

const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-app">
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar__brand">
            <div className="admin-sidebar__logo">A</div>
            <span className="admin-sidebar__brand-name">Portfolio Admin</span>
          </div>

          <nav className="admin-sidebar__nav" aria-label="Admin navigation">
            <span className="admin-sidebar__section-label">Content</span>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `admin-nav-link${isActive ? ' active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}

            <span className="admin-sidebar__section-label" style={{ marginTop: '0.5rem' }}>Account</span>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutIcon d="M8 10a2 2 0 100-4 2 2 0 000 4zm6-2a6 6 0 01-.5 2.4l1.7 1.3-1.5 2.6-2-.7A6 6 0 019 14.9V17H7v-2.1a6 6 0 01-1.7-.8l-2 .7-1.5-2.6 1.7-1.3A6 6 0 012 8a6 6 0 01.5-2.4L.8 4.3 2.3 1.7l2 .7A6 6 0 017 1.1V-1h2v2.1a6 6 0 011.7.8l2-.7 1.5 2.6-1.7 1.3A6 6 0 0114 8z" />
              Settings
            </NavLink>
          </nav>

          <div className="admin-sidebar__bottom">
            <button
              className="admin-nav-link"
              onClick={handleLogout}
              id="admin-logout-btn"
              style={{ color: '#ef4444', width: '100%' }}
            >
              <svg className="admin-nav-link__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main */}
        <div className="admin-main">
          <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ display: 'none' }}
                id="admin-menu-toggle"
                aria-label="Toggle menu"
              >
                ☰
              </button>
              <span className="admin-topbar__title">Dashboard</span>
            </div>
            <div className="admin-topbar__actions">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                id="admin-view-portfolio-btn"
              >
                ↗ View Portfolio
              </a>
              <div className="admin-user-badge">
                <span className="admin-user-badge__dot" />
                <span>{admin?.email}</span>
              </div>
            </div>
          </header>

          <main className="admin-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
