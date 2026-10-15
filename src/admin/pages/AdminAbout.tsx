import React, { useEffect, useState, useCallback } from 'react';
import { aboutApi, type AboutData } from '../../api';
import { Toast, Spinner } from '../components/AdminUI';

type ToastState = { message: string; type: 'success' | 'error' } | null;

const defaultAbout: AboutData = {
  lead: '',
  paragraphs: ['', ''],
  status: 'Based in Kerala, India · Open to Remote & Relocation',
  interests: [],
  principles: [
    { number: '01', title: '', desc: '' },
    { number: '02', title: '', desc: '' },
    { number: '03', title: '', desc: '' },
  ],
};

const AdminAbout: React.FC = () => {
  const [form, setForm] = useState<AboutData>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [interestInput, setInterestInput] = useState('');

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const load = useCallback(async () => {
    try {
      const data = await aboutApi.get();
      if (data) setForm(data);
    } catch {
      showToast('Failed to load About content', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await aboutApi.update(form);
      showToast('About section updated', 'success');
    } catch {
      showToast('Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const setParagraph = (idx: number, val: string) =>
    setForm((f) => { const p = [...f.paragraphs]; p[idx] = val; return { ...f, paragraphs: p }; });

  const addParagraph = () => setForm((f) => ({ ...f, paragraphs: [...f.paragraphs, ''] }));
  const removeParagraph = (idx: number) =>
    setForm((f) => ({ ...f, paragraphs: f.paragraphs.filter((_, i) => i !== idx) }));

  const addInterest = () => {
    const v = interestInput.trim();
    if (v && !form.interests.includes(v)) {
      setForm((f) => ({ ...f, interests: [...f.interests, v] }));
      setInterestInput('');
    }
  };
  const removeInterest = (i: string) =>
    setForm((f) => ({ ...f, interests: f.interests.filter((x) => x !== i) }));

  const setPrinciple = (idx: number, field: 'title' | 'desc' | 'number', val: string) =>
    setForm((f) => {
      const p = [...f.principles];
      p[idx] = { ...p[idx], [field]: val };
      return { ...f, principles: p };
    });

  const addPrinciple = () =>
    setForm((f) => ({
      ...f,
      principles: [...f.principles, { number: String(f.principles.length + 1).padStart(2, '0'), title: '', desc: '' }],
    }));

  const removePrinciple = (idx: number) =>
    setForm((f) => ({ ...f, principles: f.principles.filter((_, i) => i !== idx) }));

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header__left">
          <h1>About</h1>
          <p>Edit your bio, principles, status, and interests</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Bio */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <div className="admin-card__header">
            <span className="admin-card__title">Bio & Lead</span>
          </div>
          <div className="admin-card__body">
            <div className="admin-field">
              <label className="admin-field__label">Lead Sentence</label>
              <input
                className="admin-field__input"
                value={form.lead}
                onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
                placeholder="I'm a full-stack developer who..."
              />
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Status / Location</label>
              <input
                className="admin-field__input"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                placeholder="Based in Kerala, India · Open to Remote"
              />
            </div>

            <div className="admin-field">
              <label className="admin-field__label">Bio Paragraphs</label>
              <div className="admin-contrib-list">
                {form.paragraphs.map((p, i) => (
                  <div key={i} className="admin-contrib-item">
                    <textarea
                      className="admin-field__textarea"
                      rows={3}
                      value={p}
                      onChange={(e) => setParagraph(i, e.target.value)}
                      placeholder={`Paragraph ${i + 1}…`}
                      style={{ width: '100%' }}
                    />
                    <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => removeParagraph(i)}>✕</button>
                  </div>
                ))}
              </div>
              <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={addParagraph}>
                + Add Paragraph
              </button>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <div className="admin-card__header">
            <span className="admin-card__title">Core Principles</span>
          </div>
          <div className="admin-card__body">
            {form.principles.map((principle, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--ad-surface-2)', borderRadius: '6px', marginBottom: '0.75rem', border: '1px solid var(--ad-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="admin-field">
                    <label className="admin-field__label">#</label>
                    <input className="admin-field__input" value={principle.number} onChange={(e) => setPrinciple(i, 'number', e.target.value)} placeholder="01" />
                  </div>
                  <div className="admin-field">
                    <label className="admin-field__label">Title</label>
                    <input className="admin-field__input" value={principle.title} onChange={(e) => setPrinciple(i, 'title', e.target.value)} placeholder="Principle title" />
                  </div>
                </div>
                <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
                  <label className="admin-field__label">Description</label>
                  <textarea className="admin-field__textarea" rows={2} value={principle.desc} onChange={(e) => setPrinciple(i, 'desc', e.target.value)} placeholder="What this principle means..." />
                </div>
                <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => removePrinciple(i)}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={addPrinciple}>
              + Add Principle
            </button>
          </div>
        </div>

        {/* Interests */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <div className="admin-card__header">
            <span className="admin-card__title">Currently Seeking / Interests</span>
          </div>
          <div className="admin-card__body">
            <div className="admin-tags-row" style={{ marginBottom: '0.75rem' }}>
              {form.interests.map((item) => (
                <span key={item} className="admin-tag">
                  {item}
                  <button type="button" className="admin-tag__remove" onClick={() => removeInterest(item)}>✕</button>
                </span>
              ))}
            </div>
            <div className="admin-tag-input-wrap">
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
                placeholder="Full Stack Developer roles, MERN Stack…"
              />
              <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={addInterest}>Add</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="admin-btn admin-btn--primary" id="about-save-btn" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save About Section'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminAbout;
