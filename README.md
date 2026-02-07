# Resume Publisher

A monorepo application for publishing resumes, built with React, Node.js, Express, Temporal, and PostgreSQL.

## Project Structure

This is a monorepo managed with npm workspaces:

```
resume-publisher/
├── api/              # Node.js/Express API server
├── ui/               # React/Vite frontend application
├── temporal-worker/  # Temporal worker for workflow execution
├── package.json      # Root package.json with workspace configuration
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

This will install dependencies for `api`, `ui`, and `temporal-worker` workspaces.

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

### Temporal Worker Environment Variables

The temporal-worker uses environment variables for Temporal connection configuration. When running locally, these can be set in your shell or in a `.env` file:

```env
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=default
TEMPORAL_TASK_QUEUE=hello-world-test
```

When running in Docker, these are automatically configured to connect to the `temporal` service.

## Development

### Local Development (Without Docker)

Run all services (API, UI, and Temporal worker) in development mode:

```bash
npm run dev
```

Run individual services:

```bash
# API only
npm run dev:api

# UI only
npm run dev:ui

# Temporal worker only
npm run dev:worker
```

The API will be available at `http://localhost:3000` and the UI at `http://localhost:3001`. The Temporal worker will connect to the Temporal server and start processing workflow tasks.

### Development with Docker

Run all services (API, UI, Temporal server, and Temporal worker) in Docker with hot reload:

```bash
npm run docker:up:dev
```

This will start:
- Temporal server on ports 7233 (gRPC) and 8233 (Web UI)
- API on port 3000 with hot reload
- UI on port 3001 with hot reload
- Temporal worker with hot reload (connects to Temporal server)

### Production Build

Build all projects:

```bash
npm run build
```

Build individual projects:

```bash
npm run build:api
npm run build:ui
npm run build:worker
```

### Production with Docker

Build and run production containers:

```bash
npm run docker:build
npm run docker:up
```

## Available Scripts

### Root Scripts

- `npm run dev` - Run all services (API, UI, and Temporal worker) in development mode
- `npm run dev:api` - Run API in development mode
- `npm run dev:ui` - Run UI in development mode
- `npm run dev:worker` - Run Temporal worker in development mode
- `npm run build` - Build all projects
- `npm run build:api` - Build API only
- `npm run build:ui` - Build UI only
- `npm run build:worker` - Build Temporal worker only
- `npm run start` - Start all projects in production mode
- `npm run start:api` - Start API in production mode
- `npm run start:ui` - Start UI in production mode
- `npm run start:worker` - Start Temporal worker in production mode
- `npm run lint` - Lint all projects
- `npm run lint:api` - Lint API only
- `npm run lint:ui` - Lint UI only
- `npm run lint:worker` - Lint Temporal worker only
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

### Temporal Worker Scripts

Run from `temporal-worker/` directory or use `npm run <script> --workspace=temporal-worker`:

- `npm run start` - Start worker in development mode (using ts-node)
- `npm run build` - Compile TypeScript to JavaScript
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
- Temporal worker service

Environment variables are automatically loaded from `api/.env` when using Docker Compose. The Temporal worker is configured to connect to the Temporal server using the service name `temporal:7233`.

## Project Architecture

- **Frontend (UI)**: React application built with Vite, using React Router and React Hook Form
- **Backend (API)**: Express.js API server with TypeScript
- **Workflow Engine**: Temporal for workflow orchestration
- **Temporal Worker**: Processes workflow tasks and executes activities
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS

### Architecture Diagram

> **Note**: The Mermaid diagram below renders best on GitHub. For a text-based view, see the ASCII diagram below.

#### Text-Based Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  React UI    │───▶│ ResumeForm   │───▶│ Resume       │      │
│  │  Port: 3001  │    │  Component   │    │ Publisher    │      │
│  └──────────────┘    └──────────────┘    │ Service      │      │
│                                           └──────┬───────┘      │
└───────────────────────────────────────────────────┼──────────────┘
                                                    │ HTTP POST
                                                    │ /api/resume
┌───────────────────────────────────────────────────▼──────────────┐
│                         API LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Express API Server (Port: 3000)                 │   │
│  │  ┌──────────────┐              ┌──────────────┐        │   │
│  │  │ /api/resume  │──────────────▶│ Resume       │        │   │
│  │  │   Route      │              │ Controller    │        │   │
│  │  └──────────────┘              └──────┬───────┘        │   │
│  │  ┌──────────────┐                    │                 │   │
│  │  │ /api/check   │──────────────┐     │                 │   │
│  │  │   Route      │              │     │                 │   │
│  │  └──────────────┘              ▼     ▼                 │   │
│  │                          ┌──────────────┐              │   │
│  │                          │ Check        │              │   │
│  │                          │ Controller   │              │   │
│  │                          └──────────────┘              │   │
│  │                                                         │   │
│  │  ┌──────────────┐              ┌──────────────┐        │   │
│  │  │ Temporal     │              │ Database     │        │   │
│  │  │ Client       │              │ Client       │        │   │
│  │  └──────┬───────┘              └──────┬───────┘        │   │
│  └─────────┼──────────────────────────────┼────────────────┘   │
└────────────┼──────────────────────────────┼────────────────────┘
             │ gRPC                         │ SQL Queries
             │                              │
┌────────────▼──────────────────────────────▼────────────────────┐
│                    WORKFLOW LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Temporal Server                                  │  │
│  │         Port: 7233 (gRPC) / 8233 (Web UI)                │  │
│  └────────────┬───────────────────────────────┬────────────┘  │
│               │ Task Queue                     │               │
│               │                                │               │
│  ┌────────────▼───────────────────────────────▼────────────┐  │
│  │         Temporal Worker                                 │  │
│  │  ┌──────────────────┐      ┌──────────────────────────┐ │  │
│  │  │ Workflows       │      │ Activities               │ │  │
│  │  │ - resumePublisher│      │ - create user            │ │  │
│  │  │                 │      │ - create resume          │ │  │
│  │  │                 │      │ - publish resume         │ │  │
│  │  └──────────────────┘      └──────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                         │   │
│  │  ┌──────────────┐              ┌──────────────┐        │   │
│  │  │ User Schema  │              │ Resume       │        │   │
│  │  │              │              │ Schema       │        │   │
│  │  └──────────────┘              └──────────────┘        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

#### Interactive Mermaid Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI<br/>Port: 3001]
        ResumeForm[ResumeForm Component]
        ResumeService[Resume Publisher Service]
        UI --> ResumeForm
        ResumeForm --> ResumeService
    end

    subgraph "API Layer"
        API[Express API Server<br/>Port: 3000]
        ResumeController[Resume Controller]
        CheckController[Check Controller]
        ResumeRoute[/api/resume Route]
        CheckRoute[/api/check Route]
        TemporalClient[Temporal Client]
        DBClient[Database Client]
        
        API --> ResumeRoute
        API --> CheckRoute
        ResumeRoute --> ResumeController
        CheckRoute --> CheckController
        ResumeController --> TemporalClient
        ResumeController --> DBClient
    end

    subgraph "Workflow Layer"
        TemporalServer[Temporal Server<br/>Port: 7233 gRPC<br/>Port: 8233 Web UI]
        TemporalWorker[Temporal Worker]
        Workflows[Workflows<br/>resumePublisher workflow]
        Activities[Activities<br/>create user<br/>create resume<br/>publish resume]
        
        TemporalWorker --> Workflows
        TemporalWorker --> Activities
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL Database)]
        UserSchema[User Schema]
        ResumeSchema[Resume Schema]
        
        PostgreSQL --> UserSchema
        PostgreSQL --> ResumeSchema
    end

    %% Connections
    ResumeService -->|HTTP POST /api/resume| API
    TemporalClient -->|gRPC| TemporalServer
    TemporalWorker -->|gRPC| TemporalServer
    TemporalServer -->|Task Queue| TemporalWorker
    DBClient -->|SQL Queries| PostgreSQL

    %% Styling
    classDef frontend fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef api fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef workflow fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef data fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px

    class UI,ResumeForm,ResumeService frontend
    class API,ResumeController,CheckController,ResumeRoute,CheckRoute,TemporalClient,DBClient api
    class TemporalServer,TemporalWorker,Workflows,Activities workflow
    class PostgreSQL,UserSchema,ResumeSchema data
```

### Component Interactions

1. **User submits resume form** → `ResumeForm` component collects data
2. **Frontend service** → `ResumePublisher` service sends POST request to `/api/resume`
3. **API Controller** → `ResumeController` receives request and:
   - Starts a Temporal workflow via `TemporalClient`
   - (Optionally) Creates user and resume records in PostgreSQL via `DBClient`
4. **Temporal Server** → Orchestrates workflow execution and dispatches tasks
5. **Temporal Worker** → Picks up tasks from the queue, executes workflows and activities
6. **Database** → Stores user and resume data (when implemented)

## License

Private project

