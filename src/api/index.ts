/**
 * API base URL — set VITE_API_URL in .env to point to the backend in production.
 * In development, Vite proxies /api to localhost:5000.
 */
export const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken = (): string | null => localStorage.getItem('admin_token');

export const setToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('admin_token');
};

// ── Fetch wrapper ─────────────────────────────────────────────────────────────
interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = false, headers = {}, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: finalHeaders,
    ...rest,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }

  // 204 No Content
  if (res.status === 204) return null as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; admin: { id: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verify: () =>
    apiFetch<{ valid: boolean; admin: { id: string; email: string } }>('/auth/verify', {
      auth: true,
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch('/auth/change-password', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ── Projects ──────────────────────────────────────────────────────────────────
export interface Project {
  _id?: string;
  number: string;
  title: string;
  category: string;
  type: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  repoLabel?: string;
  note?: string;
  order?: number;
  visible?: boolean;
}

export const projectsApi = {
  getAll: () => apiFetch<Project[]>('/projects'),
  getAllAdmin: () => apiFetch<Project[]>('/projects/all', { auth: true }),
  create: (data: Project) =>
    apiFetch<Project>('/projects', { method: 'POST', auth: true, body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Project>) =>
    apiFetch<Project>(`/projects/${id}`, { method: 'PUT', auth: true, body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch(`/projects/${id}`, { method: 'DELETE', auth: true }),
};

// ── Skills ────────────────────────────────────────────────────────────────────
export interface SkillGroup {
  _id?: string;
  label: string;
  skills: string[];
  order?: number;
  visible?: boolean;
}

export const skillsApi = {
  getAll: () => apiFetch<SkillGroup[]>('/skills'),
  getAllAdmin: () => apiFetch<SkillGroup[]>('/skills/all', { auth: true }),
  create: (data: SkillGroup) =>
    apiFetch<SkillGroup>('/skills', { method: 'POST', auth: true, body: JSON.stringify(data) }),
  update: (id: string, data: Partial<SkillGroup>) =>
    apiFetch<SkillGroup>(`/skills/${id}`, { method: 'PUT', auth: true, body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch(`/skills/${id}`, { method: 'DELETE', auth: true }),
};

// ── Experience ────────────────────────────────────────────────────────────────
export interface ExperienceItem {
  _id?: string;
  role: string;
  company: string;
  type: string;
  period: string;
  description: string;
  contributions: string[];
  order?: number;
  visible?: boolean;
}

export const experienceApi = {
  getAll: () => apiFetch<ExperienceItem[]>('/experience'),
  getAllAdmin: () => apiFetch<ExperienceItem[]>('/experience/all', { auth: true }),
  create: (data: ExperienceItem) =>
    apiFetch<ExperienceItem>('/experience', { method: 'POST', auth: true, body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ExperienceItem>) =>
    apiFetch<ExperienceItem>(`/experience/${id}`, { method: 'PUT', auth: true, body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiFetch(`/experience/${id}`, { method: 'DELETE', auth: true }),
};

// ── About ─────────────────────────────────────────────────────────────────────
export interface AboutData {
  _id?: string;
  lead: string;
  paragraphs: string[];
  status: string;
  interests: string[];
  principles: Array<{ number: string; title: string; desc: string }>;
}

export const aboutApi = {
  get: () => apiFetch<AboutData | null>('/about'),
  update: (data: AboutData) =>
    apiFetch<AboutData>('/about', { method: 'PUT', auth: true, body: JSON.stringify(data) }),
};
