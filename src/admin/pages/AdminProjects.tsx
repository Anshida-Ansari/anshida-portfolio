import React, { useEffect, useState, useCallback } from 'react';
import { projectsApi, type Project } from '../../api';
import { Toast, ConfirmDialog, Spinner } from '../components/AdminUI';

type ToastState = { message: string; type: 'success' | 'error' } | null;

const emptyProject = (): Omit<Project, '_id'> => ({
  number: '',
  title: '',
  category: '',
  type: 'Personal Project',
  description: '',
  tech: [],
  liveUrl: '',
  repoUrl: '',
  repoLabel: 'Repository',
  note: '',
  order: 0,
  visible: true,
});

// ── ProjectForm ───────────────────────────────────────────────────────────────
interface ProjectFormProps {
  initial?: Project;
  onSave: (data: Project) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initial, onSave, onClose, isSaving }) => {
  const [form, setForm] = useState<Project>(initial ?? (emptyProject() as Project));
  const [techInput, setTechInput] = useState('');

  const set = (field: keyof Project, val: unknown) =>
    setForm((f) => ({ ...f, [field]: val }));

  const addTech = () => {
    const v = techInput.trim();
    if (v && !form.tech.includes(v)) {
      set('tech', [...form.tech, v]);
      setTechInput('');
    }
  };

  const removeTech = (t: string) => set('tech', form.tech.filter((x) => x !== t));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{initial ? 'Edit Project' : 'New Project'}</h2>
          <button className="admin-modal__close" onClick={onClose} type="button" aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="admin-modal__body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem' }}>
              <div className="admin-field">
                <label className="admin-field__label">Number *</label>
                <input className="admin-field__input" value={form.number} onChange={(e) => set('number', e.target.value)} required placeholder="01" />
              </div>
              <div className="admin-field">
                <label className="admin-field__label">Type *</label>
                <select className="admin-field__select" value={form.type} onChange={(e) => set('type', e.target.value)}>
                  <option>Personal Project</option>
                  <option>Client Work</option>
                  <option>Internship</option>
                  <option>Open Source</option>
                </select>
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Title *</label>
              <input className="admin-field__input" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="Project name" />
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Category *</label>
              <input className="admin-field__input" value={form.category} onChange={(e) => set('category', e.target.value)} required placeholder="SaaS · Project Management" />
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Description *</label>
              <textarea className="admin-field__textarea" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} required placeholder="Project description..." />
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Tech Stack</label>
              <div className="admin-tags-row" style={{ marginBottom: '0.5rem' }}>
                {form.tech.map((t) => (
                  <span key={t} className="admin-tag">
                    {t}
                    <button type="button" className="admin-tag__remove" onClick={() => removeTech(t)}>✕</button>
                  </span>
                ))}
              </div>
              <div className="admin-tag-input-wrap">
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  placeholder="React, Node.js…"
                />
                <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={addTech}>Add</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem' }}>
              <div className="admin-field">
                <label className="admin-field__label">Live URL</label>
                <input className="admin-field__input" value={form.liveUrl || ''} onChange={(e) => set('liveUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div className="admin-field">
                <label className="admin-field__label">Repo URL</label>
                <input className="admin-field__input" value={form.repoUrl || ''} onChange={(e) => set('repoUrl', e.target.value)} placeholder="https://github.com/..." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1rem' }}>
              <div className="admin-field">
                <label className="admin-field__label">Repo Label</label>
                <input className="admin-field__input" value={form.repoLabel || ''} onChange={(e) => set('repoLabel', e.target.value)} placeholder="Repository" />
              </div>
              <div className="admin-field">
                <label className="admin-field__label">Display Order</label>
                <input type="number" className="admin-field__input" value={form.order ?? 0} onChange={(e) => set('order', Number(e.target.value))} />
              </div>
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Note (optional)</label>
              <input className="admin-field__input" value={form.note || ''} onChange={(e) => set('note', e.target.value)} placeholder="Internship contribution..." />
            </div>

            <div className="admin-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
              <label className="admin-toggle">
                <input type="checkbox" checked={form.visible ?? true} onChange={(e) => set('visible', e.target.checked)} />
                <span className="admin-toggle__track" />
              </label>
              <span className="admin-field__label" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.8125rem', color: '#aaa' }}>
                Visible on portfolio
              </span>
            </div>
          </div>

          <div className="admin-modal__footer">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" id="project-save-btn" disabled={isSaving}>
              {isSaving ? 'Saving…' : initial ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);
  const [editProject, setEditProject] = useState<Project | null | 'new'>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      const data = await projectsApi.getAllAdmin();
      setProjects(data);
    } catch {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: Project) => {
    setIsSaving(true);
    try {
      if (editProject && editProject !== 'new' && editProject._id) {
        await projectsApi.update(editProject._id, data);
        showToast('Project updated', 'success');
      } else {
        await projectsApi.create(data);
        showToast('Project created', 'success');
      }
      setEditProject(null);
      load();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await projectsApi.delete(deleteId);
      showToast('Project deleted', 'success');
      setDeleteId(null);
      load();
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleVisible = async (p: Project) => {
    if (!p._id) return;
    try {
      await projectsApi.update(p._id, { visible: !p.visible });
      load();
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1>Projects</h1>
          <p>{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          className="admin-btn admin-btn--primary"
          onClick={() => setEditProject('new')}
          id="admin-add-project-btn"
        >
          + Add Project
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <Spinner />
        ) : projects.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon">📁</div>
            <div className="admin-empty__title">No projects yet</div>
            <div className="admin-empty__desc">Add your first project to get started</div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Tech</th>
                  <th>Visible</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id}>
                    <td style={{ color: '#555', width: '36px' }}>{p.number}</td>
                    <td>
                      <div className="admin-table__title">{p.title}</div>
                      {p.liveUrl && <div style={{ fontSize: '0.6875rem', color: '#555', marginTop: '0.2rem' }}>↗ {p.liveUrl}</div>}
                    </td>
                    <td style={{ maxWidth: '180px' }}>{p.category}</td>
                    <td>
                      <span className={`admin-badge ${p.type === 'Personal Project' ? 'admin-badge--green' : p.type === 'Client Work' ? 'admin-badge--amber' : 'admin-badge--red'}`}>
                        {p.type}
                      </span>
                    </td>
                    <td style={{ maxWidth: '160px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {p.tech.slice(0, 3).map((t) => (
                          <span key={t} className="admin-tag">{t}</span>
                        ))}
                        {p.tech.length > 3 && <span className="admin-tag">+{p.tech.length - 3}</span>}
                      </div>
                    </td>
                    <td>
                      <label className="admin-toggle">
                        <input type="checkbox" checked={p.visible ?? true} onChange={() => toggleVisible(p)} />
                        <span className="admin-toggle__track" />
                      </label>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          className="admin-btn admin-btn--ghost admin-btn--sm"
                          onClick={() => setEditProject(p)}
                          id={`edit-project-${p._id}`}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() => setDeleteId(p._id!)}
                          id={`delete-project-${p._id}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {editProject !== null && (
        <ProjectForm
          initial={editProject !== 'new' ? editProject : undefined}
          onSave={handleSave}
          onClose={() => setEditProject(null)}
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="admin-modal-overlay">
          <ConfirmDialog
            title="Delete Project"
            description="This action cannot be undone. The project will be permanently removed."
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
            isLoading={isDeleting}
          />
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default AdminProjects;
