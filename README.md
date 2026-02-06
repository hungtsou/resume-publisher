# Resume Publisher

A monorepo application for publishing resumes, built with React, Node.js, Express, Temporal, and PostgreSQL.

## Project Structure

This is a monorepo managed with npm workspaces:

```
resume-publisher/
├── api/          # Node.js/Express API server
├── ui/           # React/Vite frontend application
├── package.json  # Root package.json with workspace configuration
└── docker-compose.yml  # Docker Compose configuration
```

## Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- Docker and Docker Compose (for containerized development)
- PostgreSQL database (Supabase or local)

## Installation

Install all dependencies for the monorepo:

```bash
npm install
```

This will install dependencies for both `api` and `ui` workspaces.

## Environment Variables

### API Environment Variables

Create `api/.env` file with the following variables:

```env
DATABASE_URL=postgresql://user:password@host:port/database
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=hello-world-test
PORT=3000
```

### UI Environment Variables (Optional)

Create `ui/.env` file if you need to override the API URL:

```env
VITE_API_URL=http://localhost:3000
```

## Development

### Local Development (Without Docker)

Run both API and UI in development mode:

```bash
npm run dev
```

Run individual services:

```bash
# API only
npm run dev:api

# UI only
npm run dev:ui
```

The API will be available at `http://localhost:3000` and the UI at `http://localhost:3001`.

### Development with Docker

Run all services (API, UI, and Temporal) in Docker with hot reload:

```bash
npm run docker:up:dev
```

This will start:
- Temporal server on ports 7233 (gRPC) and 8233 (Web UI)
- API on port 3000 with hot reload
- UI on port 3001 with hot reload

### Production Build

Build all projects:

```bash
npm run build
```

Build individual projects:

```bash
npm run build:api
npm run build:ui
```

### Production with Docker

Build and run production containers:

```bash
npm run docker:build
npm run docker:up
```

## Available Scripts

### Root Scripts

- `npm run dev` - Run both API and UI in development mode
- `npm run dev:api` - Run API in development mode
- `npm run dev:ui` - Run UI in development mode
- `npm run build` - Build all projects
- `npm run build:api` - Build API only
- `npm run build:ui` - Build UI only
- `npm run start` - Start all projects in production mode
- `npm run start:api` - Start API in production mode
- `npm run start:ui` - Start UI in production mode
- `npm run lint` - Lint all projects
- `npm run lint:api` - Lint API only
- `npm run lint:ui` - Lint UI only
- `npm run docker:up` - Start Docker containers (production)
- `npm run docker:up:dev` - Start Docker containers (development)
- `npm run docker:down` - Stop Docker containers
- `npm run docker:build` - Build Docker images (production)
- `npm run docker:build:dev` - Build Docker images (development)

### API Scripts

Run from `api/` directory or use `npm run <script> --workspace=api`:

- `npm run dev` - Start development server with vite-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations

### UI Scripts

Run from `ui/` directory or use `npm run <script> --workspace=ui`:

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Setup

### Running Migrations

Run database migrations:

```bash
cd api
npm run db:migrate
```

Or from root:

```bash
npm run db:migrate --workspace=api
```

Make sure your `api/.env` file has the correct `DATABASE_URL` configured.

## Temporal Server

Temporal is included in the Docker Compose setup. When running with Docker, Temporal starts automatically.

To run Temporal separately:

```bash
docker run --rm -p 7233:7233 -p 8233:8233 temporalio/temporal:latest server start-dev --ip 0.0.0.0
```

Access Temporal Web UI at `http://localhost:8233`.

## Docker Compose

The project includes two Docker Compose configurations:

- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development configuration with hot reload

Both configurations include:
- Temporal server
- API service
- UI service

Environment variables are automatically loaded from `api/.env` when using Docker Compose.

## Project Architecture

- **Frontend (UI)**: React application built with Vite, using React Router and React Hook Form
- **Backend (API)**: Express.js API server with TypeScript
- **Workflow Engine**: Temporal for workflow orchestration
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS

## License

Private project

