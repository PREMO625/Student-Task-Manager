# 🚀 TaskFlow — Student Task Manager

A full-stack productivity web app that helps students organize assignments, track deadlines, and monitor progress. Built with Next.js, Express, TypeScript, and MongoDB.

## Tech Stack

### Frontend
- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + Custom Midnight Scholar design system
- **Framer Motion** for animations
- **Recharts** for analytics visualizations
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js + Express** + TypeScript
- **MongoDB Atlas** with Mongoose
- **JWT** authentication with bcrypt
- **Helmet, CORS, Rate Limiting** for security
- **Jest + Supertest** for testing

## Project Structure

```
├── frontend/             # Next.js frontend app
│   ├── app/              # Pages (dashboard, tasks, analytics, etc.)
│   ├── components/       # Shared UI components
│   ├── hooks/            # Custom React hooks (auth, tasks, analytics)
│   ├── lib/              # Utilities (API client, helpers)
│   ├── types/            # TypeScript definitions
│   ├── vercel.json       # Vercel deployment config
│   └── .env.local        # Frontend environment variables
├── backend/              # Express API server
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API route definitions
│   │   ├── utils/        # AppError, catchAsync
│   │   ├── validators/   # Express-validator rules
│   │   ├── __tests__/    # Integration tests
│   │   └── server.ts     # Entry point
│   ├── render.yaml       # Render deployment config
│   └── .env              # Backend environment variables
├── prd.md                # Product Requirements
├── doc.md                # Technical Documentation
└── README.md             # This file
```

## Setup & Installation

### Prerequisites
- Node.js 20+
- npm 9+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd student-task-manager
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (or copy `.env.template`):

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file (or copy `.env.local.template`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running Locally

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Server starts at `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

App opens at `http://localhost:3000`

## Running Tests

```bash
cd backend
npm test
```

This runs the full integration test suite (19 tests):
- ✅ MongoDB Connection
- ✅ Environment Variables
- ✅ API Health Check
- ✅ Auth Flow (Register, Login, JWT)
- ✅ Task CRUD (Create, Read, Update, Delete, Toggle, Duplicate)
- ✅ Analytics (Summary, Charts)

## Build Commands

### Frontend
```bash
cd frontend
npm run build    # Creates production build
```

### Backend
```bash
cd backend
npm run build    # Compiles TypeScript to dist/
npm start        # Runs production build
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/tasks` | List tasks (with filters/search/pagination) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task status |
| POST | `/api/tasks/:id/duplicate` | Duplicate task |
| DELETE | `/api/tasks/bulk` | Bulk delete tasks |
| GET | `/api/analytics/summary` | Dashboard stats |
| GET | `/api/analytics/charts` | Chart data |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/password` | Change password |
| DELETE | `/api/users/account` | Delete account |

## Deployment

### Frontend → Vercel
1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add env: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
4. Deploy

### Backend → Render
1. Create a new Web Service on Render
2. Set root directory to `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables (MONGODB_URI, JWT_SECRET, CLIENT_URL, etc.)

## Features

- 🔐 JWT Authentication (Register/Login/Logout)
- 📝 Full Task CRUD with validation
- 🔍 Search, filter, sort, and paginate tasks
- 📊 Analytics with Recharts (bar charts, pie charts, streaks)
- 📅 Calendar view with task deadlines
- 👤 Profile management (name, password, delete account)
- 🎨 Premium Midnight Scholar dark theme
- 📱 Fully responsive (mobile to desktop)
- ⚡ Loading skeletons and smooth animations
- 🛡️ Rate limiting, Helmet, CORS security

---

Built with ❤️ for students.
