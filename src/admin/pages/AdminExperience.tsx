import React, { useEffect, useState, useCallback } from 'react';
import { experienceApi, type ExperienceItem } from '../../api';
import { Toast, ConfirmDialog, Spinner } from '../components/AdminUI';

type ToastState = { message: string; type: 'success' | 'error' } | null;

const emptyExp = (): ExperienceItem => ({
  role: '',
  company: '',
  type: 'Internship',
  period: '',
  description: '',
  contributions: [''],
  order: 0,
  visible: true,
});

interface ExpFormProps {
  initial?: ExperienceItem;
  onSave: (data: ExperienceItem) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

const ExpForm: React.FC<ExpFormProps> = ({ initial, onSave, onClose, isSaving }) => {
  const [form, setForm] = useState<ExperienceItem>(initial ?? emptyExp());

  const set = (field: keyof ExperienceItem, val: unknown) =>
    setForm((f) => ({ ...f, [field]: val }));

  const setContrib = (idx: number, val: string) =>
    setForm((f) => {
      const c = [...f.contributions];
      c[idx] = val;
      return { ...f, contributions: c };
    });

  const addContrib = () => setForm((f) => ({ ...f, contributions: [...f.contributions, ''] }));
  const removeContrib = (idx: number) =>
    setForm((f) => ({ ...f, contributions: f.contributions.filter((_, i) => i !== idx) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter empty contributions
    onSave({ ...form, contributions: form.contributions.filter((c) => c.trim()) });
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{initial ? 'Edit Experience' : 'New Experience'}</h2>
          <button className="admin-modal__close" onClick={onClose} type="button">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal__body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem' }}>
              <div className="admin-field">
                <label className="admin-field__label">Role *</label>
                <input className="admin-field__input" value={form.role} onChange={(e) => set('role', e.target.value)} required placeholder="Web Developer Intern" />
              </div>
              <div className="admin-field">
                <label className="admin-field__label">Company *</label>
                <input className="admin-field__input" value={form.company} onChange={(e) => set('company', e.target.value)} required placeholder="Company name" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem' }}>
              <div className="admin-field">
                <label className="admin-field__label">Type *</label>
                <select className="admin-field__select" value={form.type} onChange={(e) => set('type', e.target.value)}>
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Freelance</option>
                  <option>Projects</option>
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-field__label">Period *</label>
                <input className="admin-field__input" value={form.period} onChange={(e) => set('period', e.target.value)} required placeholder="2023 – 2024" />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Description *</label>
              <textarea className="admin-field__textarea" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required placeholder="Brief description of the role..." />
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Key Contributions</label>
              <div className="admin-contrib-list">
                {form.contributions.map((c, i) => (
                  <div key={i} className="admin-contrib-item">
                    <input
                      value={c}
                      onChange={(e) => setContrib(i, e.target.value)}
                      placeholder={`Contribution ${i + 1}…`}
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn--danger admin-btn--sm"
                      onClick={() => removeContrib(i)}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={addContrib}>
                + Add Contribution
              </button>
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Display Order</label>
              <input type="number" className="admin-field__input" value={form.order ?? 0} onChange={(e) => set('order', Number(e.target.value))} />
            </div>

            <div className="admin-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
              <label className="admin-toggle">
                <input type="checkbox" checked={form.visible ?? true} onChange={(e) => set('visible', e.target.checked)} />
                <span className="admin-toggle__track" />
              </label>
              <span style={{ fontSize: '0.8125rem', color: '#aaa' }}>Visible on portfolio</span>
            </div>
          </div>

          <div className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" id="exp-save-btn" disabled={isSaving}>
              {isSaving ? 'Saving…' : initial ? 'Save Changes' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminExperience: React.FC = () => {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);
  const [editItem, setEditItem] = useState<ExperienceItem | null | 'new'>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      const data = await experienceApi.getAllAdmin();
      setItems(data);
    } catch {
      showToast('Failed to load experience', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: ExperienceItem) => {
    setIsSaving(true);
    try {
      if (editItem && editItem !== 'new' && editItem._id) {
        await experienceApi.update(editItem._id, data);
        showToast('Experience updated', 'success');
      } else {
        await experienceApi.create(data);
        showToast('Experience created', 'success');
      }
      setEditItem(null);
      load();
    } catch {
      showToast('Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await experienceApi.delete(deleteId);
      showToast('Experience deleted', 'success');
      setDeleteId(null);
      load();
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleVisible = async (item: ExperienceItem) => {
    if (!item._id) return;
    try {
      await experienceApi.update(item._id, { visible: !item.visible });
      load();
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1>Experience</h1>
          <p>{items.length} entr{items.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditItem('new')} id="admin-add-exp-btn">
          + Add Experience
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <Spinner />
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">📋</div>
            <div className="admin-empty__title">No experience entries yet</div>
            <div className="admin-empty__desc">Add your work history to get started</div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Period</th>
                  <th>Contributions</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((exp) => (
                  <tr key={exp._id}>
                    <td><div className="admin-table__title">{exp.role}</div></td>
                    <td>{exp.company}</td>
                    <td>
                      <span className={`admin-badge ${exp.type === 'Full-time' ? 'admin-badge--green' : exp.type === 'Internship' ? 'admin-badge--amber' : 'admin-badge--red'}`}>
                        {exp.type}
                      </span>
                    </td>
                    <td>{exp.period}</td>
                    <td>
                      <span className="admin-badge admin-badge--green">{exp.contributions.length}</span>
                    </td>
                    <td>
                      <label className="admin-toggle">
                        <input type="checkbox" checked={exp.visible ?? true} onChange={() => toggleVisible(exp)} />
                        <span className="admin-toggle__track" />
                      </label>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setEditItem(exp)} id={`edit-exp-${exp._id}`}>Edit</button>
                        <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteId(exp._id!)} id={`delete-exp-${exp._id}`}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editItem !== null && (
        <ExpForm
          initial={editItem !== 'new' ? editItem : undefined}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
          isSaving={isSaving}
        />
      )}

      {deleteId && (
        <div className="admin-modal-overlay">
          <ConfirmDialog
            title="Delete Experience"
            description="This will permanently remove this experience entry."
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
            isLoading={isDeleting}
          />
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminExperience;
