import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div className={`admin-toast admin-toast--${type}`} role="alert" aria-live="polite">
      <span style={{ color: type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#888' }}>
        {icon}
      </span>
      {message}
    </div>
  );
};

interface ConfirmDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  isLoading = false,
}) => (
  <div className="admin-modal-overlay" onClick={onCancel}>
    <div className="admin-confirm" onClick={(e) => e.stopPropagation()}>
      <h3 className="admin-confirm__title">{title}</h3>
      <p className="admin-confirm__desc">{description}</p>
      <div className="admin-confirm__actions">
        <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button
          className="admin-btn admin-btn--danger admin-btn--sm"
          onClick={onConfirm}
          disabled={isLoading}
          id="confirm-delete-btn"
        >
          {isLoading ? '...' : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

// Inline spinner for loading states
export const Spinner: React.FC = () => <div className="admin-spinner" aria-label="Loading…" />;
