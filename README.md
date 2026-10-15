# Anshida — Portfolio & Content Management Dashboard

A modern, responsive full-stack developer portfolio built with React 19, TypeScript, Vite, and a secure Express + MongoDB MERN backend for dynamic content management.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas URI)

### 1. Install Dependencies
```bash
# Frontend dependencies (root)
npm install

# Backend dependencies (server)
cd server && npm install && cd ..
```

### 2. Configure Environment
Verify or update `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/anshida-portfolio
JWT_SECRET=change-this-to-a-long-random-secret
ADMIN_EMAIL=admin@anshida.dev
ADMIN_PASSWORD=Admin@1234
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed Existing Portfolio Data
Populates MongoDB with all the initial portfolio projects, skills, experience, and bio data:
```bash
npm run seed
```

### 4. Run Development Servers

**Run the backend server (Port 5000):**
```bash
npm run server
```

**Run the frontend development server (Port 5173):**
```bash
npm run dev
```

---

## 🔐 Admin Dashboard

Navigate to: **[http://localhost:5173/admin](http://localhost:5173/admin)**

- **Default Email**: `admin@anshida.dev`
- **Default Password**: `Admin@1234`

### Features:
- 📊 **Overview Stats**: Quick counts of projects, skills, and experience items with direct action links.
- 💼 **Project Management**: Add, edit, delete, toggle visibility, and configure featured projects, live URLs, GitHub repos, and tags.
- ⚡ **Skills Management**: Organize skills into category groups (Frontend, Backend, Tools, etc.), add/remove skill badges dynamically.
- 🏢 **Experience Management**: Manage roles, companies, dates, locations, and bullet-point contributions.
- 📝 **About & Bio Editor**: Update introduction, core engineering philosophy, status badge, and passions.
- 🔒 **Security & Settings**: Change credentials securely with bcrypt-hashed password updates.

---

## 🛡️ Architecture & Resilient Design

- **Static Fallback**: The public portfolio automatically operates seamlessly with built-in fallback data even if the backend or database is offline.
- **Code Splitting**: The admin dashboard is lazily loaded via `React.lazy`, ensuring the public portfolio bundle remains lightweight and fast.
- **Security**: JWT authentication with bearer tokens, rate limiting on auth endpoints, input sanitization, and CORS enforcement.
- **Vite Proxy**: In development, `/api` requests are seamlessly forwarded to the backend on `localhost:5000`.

---

## 📦 Build for Production

```bash
# Build frontend bundle
npm run build

# Preview build locally
npm run preview
```
