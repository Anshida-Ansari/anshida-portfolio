import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login" id="admin-login-page">
      <div className="admin-login__card">
        {/* Brand */}
        <div className="admin-login__brand">
          <div className="admin-login__logo">A</div>
          <div>
            <p className="admin-login__brand-name">Anshida Ansari</p>
            <p className="admin-login__brand-sub">Portfolio Admin</p>
          </div>
        </div>

        <h1 className="admin-login__title">Sign in</h1>
        <p className="admin-login__desc">Manage your portfolio content securely.</p>

        <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
          <div className="admin-form-group">
            <label htmlFor="admin-email" className="admin-form-label">Email</label>
            <input
              id="admin-email"
              type="email"
              className="admin-form-input"
              placeholder="admin@anshida.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password" className="admin-form-label">Password</label>
            <input
              id="admin-password"
              type="password"
              className="admin-form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="admin-login__error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login__btn"
            id="admin-login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="admin-login__spinner" aria-label="Signing in…" />
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="admin-login__footer-note">
          Access restricted to authorized admin only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
