# Student Task Manager: Technical Setup & Best Practices Documentation

This document (`doc.md`) serves as the core technical guide for building the **Student Task Manager**. It outlines the setup requirements, architectural patterns, conventions, and latest best practices (as of 2024-2026) for the chosen technology stack. 

The stack includes **Next.js (App Router)** for the frontend and **Node.js, Express, & MongoDB (Mongoose)** for the backend.

---

## 1. Frontend: Next.js (App Router) & React Ecosystem

### 1.1 Architectural Mindset: Server vs. Client
- **Server Components by Default**: The `app/` directory utilizes React Server Components (RSC) by default. Use RSCs for fetching data directly on the server, avoiding client-side network waterfalls, and keeping sensitive variables secure. They have zero impact on the client-side bundle.
- **Minimize `'use client'` Directive**: Only add `'use client'` at the top of files that require browser-specific capabilities:
  - React hooks (`useState`, `useEffect`, `useRef`)
  - Event listeners (`onClick`, `onChange`)
  - Browser APIs (`window`, `localStorage`)
- **Composition Pattern**: Keep client components as leaves in the React tree. You can pass Server Components as `children` to Client Components to preserve server-side rendering benefits.

### 1.2 Data Fetching & State
- **Server Fetching**: Prefer fetching data in Server Components utilizing `async/await`.
- **Zod Validation**: Use `zod` for strictly typing data payloads at runtime. Combine this with `react-hook-form` via the `@hookform/resolvers/zod` package to handle form state and validation securely and intuitively without triggering extra re-renders. 

### 1.3 UI & Styling (Tailwind CSS + Shadcn UI)
- **Utility-First styling**: Utilize standard Tailwind classes. Keep them manageable by abstracting repeated combinations into reusable React components rather than relying on `@apply` in CSS.
- **Shadcn UI Setup**: Components from Shadcn UI will be imported to an intrinsic `components/ui` folder. Keep them modular and isolate your own custom components in a separate `components/` level (e.g., `components/forms/`).
- **Framer Motion**: Keep animation code inside Client Components. Use `AnimatePresence` for smooth layout transitions and modal dismissals.

### 1.4 Frontend Folder Structure Best Practices
Keep logic co-located by feature rather than just generic type folders when possible.
```text
frontend/
├── app/                  # Next.js App Router specific files (layout.tsx, page.tsx, loading.tsx)
│   ├── (auth)/           # Route Groups for shared layouts (e.g., login, register)
│   └── dashboard/        # Dashboard feature routes
├── components/           # UI structure
│   ├── ui/               # Shadcn generated components
│   └── shared/           # Reusable non-Shadcn components
├── lib/                  # Utility functions (e.g., cn, axios instance)
├── hooks/                # Custom React hooks
└── types/                # Typescript definition files
```

---

## 2. Backend: Express.js, TypeScript, & MongoDB

### 2.1 Backend Architecture Setup
Use a robust Model-Controller-Route (MCR) plus Service architectural pattern.
- **Controllers**: Handle HTTP requests/responses, extract params/bodies, and pass them to Services.
- **Services**: Contain the core business logic. Separation of logic from controllers makes it easier to test.
- **Models**: Defines Mongoose schemas and Typescript interfaces.

### 2.2 Security & Middleware
- Ensure the following middleware is loaded early in `server.ts`:
  - `helmet()`: Provides security headers.
  - `cors()`: Set with explicit `origin` restrictions matching the frontend domain (Vercel or localhost).
  - `express.json()`: Parse incoming requests.
  - `express-rate-limit`: Apply globally or specifically to `/auth` routes to prevent brute-forcing.
- **Bcrypt & JWT**: Store only hashed passwords (`bcrypt`). Issue stateless JWT tokens for authentication. Validate JWTs on protected routes using a dedicated middleware.

### 2.3 Express + TypeScript Tips
- Extend the Express `Request` type to naturally type augmented properties:
  ```typescript
  import { Request } from 'express';
  export interface AuthRequest extends Request {
      user?: { id: string; role?: string };
  }
  ```
- Use strict TypeScript compiler checks (`"strict": true` in `tsconfig.json`) to catch potential `null` errors.

### 2.4 Error Handling
Create a centralized error-handling paradigm.
- Define a custom `AppError` class that captures `statusCode`.
- Use a `catchAsync` utility wrapper for Express routes so you don't need to manually `try/catch` in every controller.
- Use a global error middleware inside `server.ts`: `app.use((err, req, res, next) => { ... })`.

---

## 3. Database: MongoDB (Mongoose) Best Practices

- **Strongly Typed Schemas**: Use Mongoose schemas alongside standard TypeScript interfaces (e.g., `interface ITask extends Document { ... }`).
- **Indexes**: Set up appropriate indexes within Mongoose schemas (e.g., `email: { type: String, unique: true }`, or indexing `userId` in tasks for fast lookup) to optimize query performance.
- **Timestamps**: Utilize Mongoose's built in `{ timestamps: true }` heavily over manually setting `createdAt` and `updatedAt`.
- **References constraints**: Use `.populate()` carefully to maintain performance. Do not over-nest data. Tasks should simply store a `userId` referencing the `User` model rather than embedding total User objects.

---

## 4. Deployment Prerequisites & Environment Handling

### 4.1 Frontend (Vercel)
- Next.js requires little configuration on Vercel naturally. However, ensure `NEXT_PUBLIC_API_URL` is properly assigned in the Vercel project environment variables (pointing to the Render URL).
- Using `next.config.js` or `vercel.json`, verify correct rewrite/cache settings. Standard deployments without a custom build step work automatically.

### 4.2 Backend (Render)
- In `package.json`, set clear `build` and `start` scripts.
  ```json
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "ts-node-dev src/server.ts"
  }
  ```
- Ensure the port binds strictly to `process.env.PORT || 5000`. Render injects a `PORT` variable dynamically; hardcoding it will cause deployment failure.
- Configure cross-origin domains accurately: Your backend will run on `https://student-task-manager.onrender.com` meaning your CORS options must allow requests from the specific Vercel frontend URL.

---

## 5. Development Workflow Guidelines

1. **Keep Types in Sync**: Changes made to Mongoose schemas should immediately reflect in frontend API call response types.
2. **Environment `.env` Segregation**: Never push `.env` files. Maintain up-to-date `.template` or `.sample` files for developer onboarding.
3. **Commit often**: Group work by isolated feature flags (Auth, Tasks CRUD, Dashboard UI).
4. **Use `eslint` and `prettier`**: Ensure styling and code guidelines stay organized automatically on save.
