import React, { useEffect, useState, useCallback } from 'react';
import { skillsApi, type SkillGroup } from '../../api';
import { Toast, ConfirmDialog, Spinner } from '../components/AdminUI';

type ToastState = { message: string; type: 'success' | 'error' } | null;

interface SkillGroupFormProps {
  initial?: SkillGroup;
  onSave: (data: SkillGroup) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

const SkillGroupForm: React.FC<SkillGroupFormProps> = ({ initial, onSave, onClose, isSaving }) => {
  const [form, setForm] = useState<SkillGroup>(
    initial ?? { label: '', skills: [], order: 0, visible: true }
  );
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !form.skills.includes(v)) {
      setForm((f) => ({ ...f, skills: [...f.skills, v] }));
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{initial ? 'Edit Skill Group' : 'New Skill Group'}</h2>
          <button className="admin-modal__close" onClick={onClose} type="button">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal__body">
            <div className="admin-field">
              <label className="admin-field__label">Group Label *</label>
              <input
                className="admin-field__input"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                required
                placeholder="Frontend, Backend, Tools…"
              />
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Display Order</label>
              <input
                type="number"
                className="admin-field__input"
                value={form.order ?? 0}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
              />
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Skills</label>
              <div className="admin-tags-row" style={{ marginBottom: '0.5rem', minHeight: '24px' }}>
                {form.skills.map((s) => (
                  <span key={s} className="admin-tag">
                    {s}
                    <button type="button" className="admin-tag__remove" onClick={() => removeSkill(s)}>✕</button>
                  </span>
                ))}
              </div>
              <div className="admin-tag-input-wrap">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="React, Node.js, MongoDB…"
                />
                <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={addSkill}>Add</button>
              </div>
              <span className="admin-field__hint">Press Enter or click Add to append a skill</span>
            </div>

            <div className="admin-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
              <label className="admin-toggle">
                <input
                  type="checkbox"
                  checked={form.visible ?? true}
                  onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))}
                />
                <span className="admin-toggle__track" />
              </label>
              <span style={{ fontSize: '0.8125rem', color: '#aaa' }}>Visible on portfolio</span>
            </div>
          </div>

          <div className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" id="skill-group-save-btn" disabled={isSaving}>
              {isSaving ? 'Saving…' : initial ? 'Save Changes' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminSkills: React.FC = () => {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);
  const [editGroup, setEditGroup] = useState<SkillGroup | null | 'new'>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      const data = await skillsApi.getAllAdmin();
      setGroups(data);
    } catch {
      showToast('Failed to load skills', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: SkillGroup) => {
    setIsSaving(true);
    try {
      if (editGroup && editGroup !== 'new' && editGroup._id) {
        await skillsApi.update(editGroup._id, data);
        showToast('Skill group updated', 'success');
      } else {
        await skillsApi.create(data);
        showToast('Skill group created', 'success');
      }
      setEditGroup(null);
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
      await skillsApi.delete(deleteId);
      showToast('Skill group deleted', 'success');
      setDeleteId(null);
      load();
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleVisible = async (g: SkillGroup) => {
    if (!g._id) return;
    try {
      await skillsApi.update(g._id, { visible: !g.visible });
      load();
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1>Skills</h1>
          <p>{groups.length} skill group{groups.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditGroup('new')} id="admin-add-skill-btn">
          + Add Skill Group
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <Spinner />
        ) : groups.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">⭐</div>
            <div className="admin-empty__title">No skill groups yet</div>
            <div className="admin-empty__desc">Create your first skill category</div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Group</th>
                  <th>Skills</th>
                  <th>Count</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <tr key={g._id}>
                    <td style={{ color: '#555', width: '48px' }}>{g.order ?? '—'}</td>
                    <td><div className="admin-table__title">{g.label}</div></td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {g.skills.map((s) => (
                          <span key={s} className="admin-tag">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge--green">{g.skills.length}</span>
                    </td>
                    <td>
                      <label className="admin-toggle">
                        <input type="checkbox" checked={g.visible ?? true} onChange={() => toggleVisible(g)} />
                        <span className="admin-toggle__track" />
                      </label>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => setEditGroup(g)} id={`edit-skill-${g._id}`}>Edit</button>
                        <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteId(g._id!)} id={`delete-skill-${g._id}`}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editGroup !== null && (
        <SkillGroupForm
          initial={editGroup !== 'new' ? editGroup : undefined}
          onSave={handleSave}
          onClose={() => setEditGroup(null)}
          isSaving={isSaving}
        />
      )}

      {deleteId && (
        <div className="admin-modal-overlay">
          <ConfirmDialog
            title="Delete Skill Group"
            description="This will permanently remove this skill group and all its skills."
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

export default AdminSkills;
