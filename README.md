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
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
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
- Kafka on port 9092 (topic `resume_publisher` created by kafka-init)
- Temporal server on ports 7233 (gRPC) and 8233 (Web UI)
- API on port 3000 with hot reload
- UI on port 3001 with hot reload
- Temporal worker with hot reload (connects to Temporal server and Kafka)

**Viewing worker events in Kafka (real time):** In a **second terminal**, run (use partition 0 and offset 0 so you always see all messages):

```bash
docker exec -it resume-publisher-kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic resume_publisher \
  --partition 0 \
  --offset 0
```

Trigger a resume publish from the UI; you should see JSON event messages in that terminal. In the main docker compose terminal, look for `Event publisher (Kafka) connected` and `Event published to Kafka: ...` in the temporal-worker logs, and `Worker event received: ...` in the API logs.

**If the consumer shows no output:** First confirm the consumer and topic work. With the consumer running in terminal 2, in a **third terminal** produce a test message:

```bash
echo '{"event":"test","step":"manual","message":"hello"}' | docker exec -i resume-publisher-kafka /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic resume_publisher
```

You should see that line appear in the consumer terminal. If it does, Kafka and the consumer are fine—check temporal-worker logs for `Event publisher Kafka bootstrap servers:` (should be `kafka:9092`), `Event publisher (Kafka) connected`, and either `Event published to Kafka:` or `Event publisher send failed:` when you submit a resume.

**Event logs not appearing in UI:** The worker pushes events to the API via HTTP (POST /api/worker-events) in addition to Kafka, so event logs work even when the Kafka consumer has issues (e.g. "group coordinator not available"). Ensure the worker can reach the API (`API_URL` / `http://api:3000` in Docker). The Resumes page gets `workflowId` from navigation state after submit; a page refresh loses it. Use `GET /api/worker-events?debug=1` to verify the store has events.

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
- **Kafka** (Apache Kafka 4.1.1, KRaft mode, port 9092) and **kafka-init** (creates topic `resume_publisher` on startup)
- Temporal server
- API service
- UI service
- Temporal worker service (dev compose only)

Environment variables are automatically loaded from `api/.env` when using Docker Compose. The Temporal worker connects to the Temporal server at `temporal:7233` and to Kafka at `kafka:9092`. The API consumes worker events from Kafka (`KAFKA_BOOTSTRAP_SERVERS=kafka:9092`).

## Project Architecture

- **Frontend (UI)**: React application built with Vite, using React Router and React Hook Form
- **Backend (API)**: Express.js API server with TypeScript; consumes worker events from Kafka
- **Workflow Engine**: Temporal for workflow orchestration
- **Temporal Worker**: Processes workflow tasks, runs activities, publishes progress events to Kafka
- **Kafka**: Apache Kafka (topic `resume_publisher`) for worker event stream; API exposes **GET /api/worker-events**
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS

### Architecture Diagram

> **Note**: The Mermaid diagram below renders best on GitHub. For a text-based view, see the ASCII diagram below.

#### Text-Based Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐     │
│  │  React UI    │───▶│ ResumeForm   │───▶│ Resume Publisher     │     │
│  │  Port: 3001  │    │  Component   │    │ Service              │     │
│  └──────────────┘    └──────────────┘    └──────────┬───────────┘     │
│                                                       │ POST /api/publish-resume
└───────────────────────────────────────────────────────┼─────────────────┘
                                                        │
┌───────────────────────────────────────────────────────▼─────────────────┐
│                            API LAYER                                     │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │            Express API Server (Port: 3000)                         │  │
│  │                                                                    │  │
│  │  Routes & Controllers:                                              │  │
│  │  ┌─────────────────────┐    ┌─────────────────────────────┐       │  │
│  │  │ POST /api/publish-   │───▶│ Publish Resume Controller   │       │  │
│  │  │      resume          │    │ (starts publishResume       │       │  │
│  │  └─────────────────────┘    │  workflow via Temporal)     │       │  │
│  │                              └──────────────┬──────────────┘       │  │
│  │  ┌─────────────────────┐    ┌──────────────▼──────────────┐       │  │
│  │  │ GET /api/worker-     │───▶│ Worker Events Controller    │       │  │
│  │  │     events           │    │ (events from Kafka consumer)│       │  │
│  │  └─────────────────────┘    └─────────────────────────────┘       │  │
│  │  ┌─────────────────────┐    ┌──────────────────────────────────┐  │  │
│  │  │ POST/GET/PUT        │───▶│ Resume Controller                 │  │  │
│  │  │ /api/resume         │    │ (create, getById, getAll, update)  │  │  │
│  │  └─────────────────────┘    └──────────────┬───────────────────┘  │  │
│  │  ┌─────────────────────┐    ┌──────────────▼──────────────┐       │  │
│  │  │ POST/GET /api/user   │───▶│ User Controller              │       │  │
│  │  └─────────────────────┘    │ (create, getById, getAll)    │       │  │
│  │                              └──────────────┬──────────────┘       │  │
│  │  ┌─────────────────────┐    ┌──────────────▼──────────────┐       │  │
│  │  │ GET /api/check        │───▶│ Check Controller             │       │  │
│  │  └─────────────────────┘    │ (health check)                │       │  │
│  │                              └─────────────────────────────┘       │  │
│  │                                                                    │  │
│  │  ┌─────────────────────┐    ┌─────────────────────┐                │  │
│  │  │ Temporal Client     │    │ Kafka Consumer      │                │  │
│  │  └──────────┬──────────┘    │ (resume_publisher)  │                │  │
│  │              │               └──────────▲──────────┘                │  │
│  │  ┌───────────┴──────────┐   ┌───────────┴──────────┐                │  │
│  │  │ Database Client      │   │                      │                │  │
│  │  └──────────┬──────────┘   │                      │                │  │
│  └─────────────┼──────────────┼──────────────────────┼────────────────┘  │
└────────────────┼──────────────┼──────────────────────┼───────────────────┘
                 │ gRPC         │ SQL                  │ consume
                 │              │                      │
┌────────────────▼──────────────▼──────────────────────┼───────────────────┐
│                         WORKFLOW LAYER                │                   │
│  ┌──────────────────────────────────────────────────┴───────────────┐   │
│  │  Temporal Server  (Port: 7233 gRPC / 8233 Web UI)                │   │
│  └────────────────────────────┬─────────────────────────────────────┘   │
│                               │ Task Queue                               │
│  ┌────────────────────────────▼───────────────────────────────────────┐  │
│  │  Temporal Worker                                                    │  │
│  │  ┌─────────────────────────┐   ┌─────────────────────────────────┐ │  │
│  │  │ Workflows               │   │ Activities                      │ │  │
│  │  │ - example (greet)       │   │ - greet                         │ │  │
│  │  │ - publishResumeWorkflow │   │ - createUser → POST /api/user    │ │  │
│  │  │   (createUser →         │   │ - createResume → POST /api/      │ │  │
│  │  │    createResume →       │   │   resume                        │ │  │
│  │  │    updateResume)        │   │ - updateResume → PUT /api/       │ │  │
│  │  └─────────────────────────┘   │   resume/:id                    │ │  │
│  │                                 └──────────────┬──────────────────┘ │  │
│  │                                 publish events │                    │  │
│  └────────────────────────────────────────────────┼────────────────────┘  │
└────────────────────────────────────────────────────┼───────────────────────┘
                                                    │ produce (topic:
                                                    │ resume_publisher)
┌───────────────────────────────────────────────────▼───────────────────────┐
│                         EVENT STREAM LAYER                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  Kafka (Port: 9092) - topic: resume_publisher                         │ │
│  │  Worker publishes activity events; API consumes for worker-events    │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
         │ Activities call back to API (User + Resume controllers)
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                               │  │
│  │  ┌──────────────────┐              ┌──────────────────┐           │  │
│  │  │ User Schema       │              │ Resume Schema     │           │  │
│  │  └──────────────────┘              └──────────────────┘           │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Workflow Summary

End-to-end flow for publishing a resume:

```mermaid
sequenceDiagram
  participant UI
  participant API
  participant Temporal
  participant Worker
  participant Kafka

  UI->>API: POST publish-resume
  API->>Temporal: start workflow
  API->>UI: 202 + workflowId
  Temporal->>Worker: run workflow/activities
  Worker->>Kafka: produce log events (resume_publisher)
  Kafka->>API: consumer receives messages
  API->>API: store/log and optionally expose GET /api/logs
```

1. **UI** → User submits the resume form; frontend sends **POST /api/publish-resume** with resume data.
2. **API** → Publish Resume Controller starts the `publishResume` Temporal workflow and returns **202 Accepted** with `workflowId` and `runId`.
3. **Temporal** → Server schedules the workflow; the worker dequeues the task.
4. **Temporal Worker** → Runs the `publishResumeWorkflow`: calls **createUser** (POST /api/user), **createResume** (POST /api/resume), then **updateResume** (PUT /api/resume/:id). For each activity it emits events (e.g. started, completed, failed) to **Kafka** topic `resume_publisher`.
5. **Kafka** → Receives worker events; the **API** consumes them via the worker-events module and stores them in an in-memory, bounded store.
6. **API** → User and Resume controllers handle the worker’s HTTP calls (createUser, createResume, updateResume) and persist to **PostgreSQL**.
7. **API** → Clients can read worker progress via **GET /api/worker-events** (optional `?workflowId=` to filter by workflow).

### Component Interactions

1. **User submits resume form** → `ResumeForm` component collects data; frontend sends POST to `/api/publish-resume`.
2. **Publish Resume Controller** → Receives request, starts the `publishResume` Temporal workflow via Temporal Client, returns 202 Accepted with `workflowId` and `runId`.
3. **Temporal Server** → Schedules the workflow; worker picks up the task.
4. **Temporal Worker** → Runs `publishResumeWorkflow`, which executes activities in order: `createUser` (POST to `/api/user`), `createResume` (POST to `/api/resume`), then `updateResume` (PUT to `/api/resume/:id`). The worker publishes progress events to Kafka topic `resume_publisher`.
5. **Kafka** → Holds worker events; the API’s worker-events consumer reads from `resume_publisher` and stores events for **GET /api/worker-events**.
6. **User Controller** → Handles POST `/api/user` from the worker’s `createUser` activity; creates user in PostgreSQL.
7. **Resume Controller** → Handles POST `/api/resume` and PUT `/api/resume/:id` from the worker’s `createResume` and `updateResume` activities; creates and updates resume in PostgreSQL.
8. **Database** → Stores users and resumes via the API’s User and Resume controllers.

## License

Private project

