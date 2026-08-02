# TaskFlow Monorepo

TaskFlow is a full-stack project management and task tracker application. This repository is structured as a monorepo containing both the frontend (React + Vite) and backend (Express + Node.js) applications under unified scripts.

## Architecture: Feature-First (Module-Based)

We use a feature-first architectural pattern rather than a layer-first structure. Files are grouped by business domains/modules rather than by technical roles.

## Project Structure

```text
taskflow/
├── frontend/             # React + Vite application
│   └── src/
│       ├── api/          # Axios and TanStack query base setups
│       ├── components/   # Shared UI components
│       ├── context/      # React contexts (e.g. AuthContext)
│       ├── hooks/        # Custom React hooks
│       ├── layouts/      # Page layout components
│       ├── pages/        # Page components
│       ├── routes/       # Router definition
│       ├── types/        # TypeScript global declarations
│       ├── utils/        # Generic frontend utility functions
│       └── features/     # Feature modules (auth, projects, tasks, reports)
│
├── backend/              # Express API application
│   └── src/
│       ├── modules/      # Feature modules (auth, users, projects, tasks, reports)
│       │   └── [module]/ # Contains routes, controller, service, repository, validator, types
│       ├── shared/       # Shared middleware, DB driver, errors, logger, and utils
│       ├── config/       # Configuration files
│       ├── tests/        # Integration/unit tests
│       ├── app.ts        # Express app configuration
│       └── server.ts     # Express server listener
│
├── docs/                 # Documentation files
├── .github/              # GitHub Actions workflows and templates
├── .gitignore            # Root git ignore configuration
├── .prettierrc           # Shared code formatting configuration
└── package.json          # Monorepo workspaces and scripts
```

## Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **pg** (Raw SQL / parameterized queries, no ORM)
- **ESLint** & **Prettier**

### Frontend
- **React** (via **Vite**)
- **TypeScript**
- **React Query** (TanStack Query)
- **Axios**
- **ESLint** & **Prettier**

## Scripts

Run commands from the root directory:

* **Install all dependencies:** `npm install`
* **Run in Development Mode (Frontend & Backend parallel):** `npm run dev`
* **Build both packages:** `npm run build`
* **Lint both packages:** `npm run lint`
* **Format code using Prettier:** `npm run format`
