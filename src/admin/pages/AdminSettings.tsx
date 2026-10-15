import React, { useState } from 'react';
import { authApi } from '../../api';
import { Toast } from '../components/AdminUI';
import { useAuth } from '../context/AuthContext';

type ToastState = { message: string; type: 'success' | 'error' } | null;

const AdminSettings: React.FC = () => {
  const { admin } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to change password', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1>Settings</h1>
          <p>Account security and preferences</p>
        </div>
      </div>

      {/* Account Info */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div className="admin-card__header">
          <span className="admin-card__title">Account Info</span>
        </div>
        <div className="admin-card__body">
          <div className="admin-field">
            <label className="admin-field__label">Admin Email</label>
            <input className="admin-field__input" value={admin?.email || ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            <span className="admin-field__hint">Email cannot be changed from the dashboard. Edit the server .env to update.</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <div className="admin-card__header">
          <span className="admin-card__title">Change Password</span>
        </div>
        <form onSubmit={handleChangePassword}>
          <div className="admin-card__body">
            <div className="admin-field">
              <label className="admin-field__label">Current Password</label>
              <input
                type="password"
                className="admin-field__input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">New Password</label>
              <input
                type="password"
                className="admin-field__input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min. 8 characters, letters + numbers"
                autoComplete="new-password"
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Confirm New Password</label>
              <input
                type="password"
                className="admin-field__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat new password"
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="admin-modal__footer" style={{ borderTop: '1px solid var(--ad-border)', padding: '1rem 1.5rem' }}>
            <button type="submit" className="admin-btn admin-btn--primary" id="change-password-btn" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Info */}
      <div style={{
        background: 'rgba(124,58,237,0.06)',
        border: '1px solid rgba(124,58,237,0.15)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        fontSize: '0.8125rem',
        color: '#aaa',
        lineHeight: 1.7,
      }}>
        <strong style={{ color: '#e8e8e8' }}>🔐 Security note</strong> — Passwords are hashed with bcrypt. JWT sessions expire after 7 days. If you lose access, re-run the seed script to reset credentials.
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminSettings;
