# 🚀 Investment App Platform

A full‑stack web platform that enables **students to pitch startup projects**, **admins to approve them**, and **alumni / student‑investors to invest** in approved projects.

Built with **MERN stack** and designed with **role‑based access control** and a modular architecture.

---

## 🧠 Core Concept

The platform simulates a real‑world startup investment ecosystem:

- **Students** create project proposals
- **Admins** review and approve proposals
- **Alumni & Student‑Investors** invest in approved projects
- **Completed projects** are publicly visible for credibility
- **Investors** get a portfolio view of their investments (Module C)

---

## 🧩 User Roles

### 👨‍🎓 Student
- Create project proposals
- View only **their own projects**
- Can toggle **Investor Mode**
- **Cannot invest in their own projects**

### 👨‍🎓 Student‑Investor
- Everything a student can do
- Access to **Marketplace**
- Can invest in other students’ projects
- Has **Portfolio** and **Completed** views

### 🎓 Alumni
- Browse **Marketplace**
- Invest in projects
- View **Portfolio** and **Completed** projects

### 🛡 Admin
- View **pending project proposals**
- Approve or reject projects
- Set approved valuation & equity
- Open projects for funding

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Role‑based UI rendering

### Backend
- Node.js
- Express (ESM)
- MongoDB + Mongoose
- JWT Authentication
- Modular Controllers & Routes

### Deployment
- Frontend: Vercel / Netlify
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

project-root/
│
├── backend/
│ ├── controllers/
│ │ ├── projectController.js
│ │ ├── projectAdminController.js
│ │ └── investController.js
│ │
│ ├── middleware/
│ │ ├── auth.js
│ │ └── adminOnly.js
│ │
│ ├── models/
│ │ ├── Project.js
│ │ └── User.js
│ │
│ ├── routes/
│ │ ├── projectRoutes.js
│ │ └── projectAdminRoutes.js
│ │
│ └── server.js
│
├── frontend/
│ ├── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Marketplace.jsx
│ │ ├── Portfolio.jsx
│ │ ├── Completed.jsx
│ │ ├── CreateProject.jsx
│ │ ├── Login.jsx
│ │ └── Register.jsx
│ │
│ ├── services/
│ │ └── api.js
│ │
│ └── App.jsx
│
└── README.md


---

## 🔐 Authentication

- JWT‑based authentication
- Tokens stored in `localStorage`
- Protected backend routes using `auth` middleware
- Admin routes protected using `adminOnly` middleware

---

## 🔁 Project Lifecycle

Student creates project
↓
pending-approval
↓
Admin approves
↓
open-for-funding
↓
Investors invest
↓
funded
↓
Completed section

---

## 📡 Backend API Endpoints

### Student / Investor Routes

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/projects/create` | Create project proposal |
| GET | `/projects/mine` | Fetch student’s projects |
| GET | `/projects/marketplace` | Fetch investable projects |
| GET | `/projects/completed` | Fetch funded projects |
| POST | `/projects/:id/invest` | Invest in a project |

### Admin Routes

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/admin/projects/pending` | View pending projects |
| PATCH | `/admin/projects/:id/approve` | Approve project |
| PATCH | `/admin/projects/:id/reject` | Reject project |

---

## 🚫 Security Rules

- ❌ Users cannot invest in their own projects  
- ❌ Students cannot see other projects unless Investor Mode is enabled  
- ❌ Admins cannot invest  
- ✔ Backend enforces all rules (not only UI)

---

## 🧪 Local Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd project-root
