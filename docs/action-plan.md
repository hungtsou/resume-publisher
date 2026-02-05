Here is **your demo action plan**, restated clearly and sequentially, without adding new scope.
This is the **exact plan you and I converged on**, just distilled.

---

# Demo Action Plan (End-to-End)

## Demo Goal

Build a **simple, correct example** showing how:

**React → Node.js → Temporal → Kafka**

work together, and where the **user-visible result** lives.

---

# Phase 1 — Infrastructure (local, minimal)

### What you run

Using **Docker Compose**:

* **Temporal Server** (workflow engine backend)
* **Kafka** (single broker)
* *(ZooKeeper only if the Kafka image requires it)*

### What this phase proves

* Temporal can persist workflow state
* Kafka can publish and consume events

> No application code yet — just infra running.

---

# Phase 2 — Temporal Worker (core of the demo)

### You implement

A **Temporal worker (Node.js + TypeScript)** containing:

#### Workflow

`PublishResumeWorkflow`

#### Activities

1. `validateResume`
2. `renderHTML`
3. `storeArtifact`
4. `publishToKafka`

### Responsibility split

* **Workflow** → orchestration (deterministic)
* **Activities** → side effects (IO, Kafka, filesystem)

### Output

* A published resume artifact (HTML)
* A `ResumePublished` Kafka event

---

# Phase 3 — Node.js API (command entrypoint)

### You implement

A **Node.js REST API**:

#### Endpoint

`POST /publish`

#### Responsibilities

* Authenticate / validate input
* Start Temporal workflow
* Return `workflowId` (async, `202 Accepted`)
* Serve published resumes as static files

### Important rule

❌ API does **not** execute business logic
✅ API **starts workflows**

---

# Phase 4 — Kafka Consumer (downstream reaction)

### You implement

A **separate Node.js service** that:

* Subscribes to Kafka topic: `domain.resume`
* Listens for `ResumePublished`
* Simulates:

  * search indexing
  * notifications
  * analytics logging

### Purpose

Demonstrates:

* Kafka is **not orchestration**
* Kafka is **event distribution**
* Services react independently

---

# Phase 5 — React Client (user interaction)

### You implement

A minimal **React UI**:

* Resume form (name, content)
* “Publish” button
* Calls `POST /publish`
* Displays:

  * `workflowId`
  * link to the published resume

### What the user sees

* Click → publish starts
* Resume becomes publicly accessible via URL

---

# Phase 6 — “Publishing” (user-visible result)

### Where the resume is published

For the demo:

* Generated HTML stored locally
* Served via Node.js static route

Example:

```
http://localhost:3000/resumes/<resumeId>.html
```

### Key insight

> Temporal ensures *publishing happens*
> Storage + HTTP make it *visible to users*

---

# Phase 7 — Verification (what to show in demo)

You can visibly demonstrate:

1. React triggers publish
2. Node API returns workflowId
3. Temporal Web UI shows workflow execution
4. Resume HTML exists and is accessible
5. Kafka topic contains `ResumePublished`
6. Kafka consumer logs downstream actions
7. Duplicate requests don’t duplicate workflows (idempotency)

---

# One-Page Mental Model (Final)

```
User clicks Publish
   ↓
React UI
   ↓
Node.js API (command)
   ↓
Temporal Workflow (orchestration)
   ↓
Activities (render, store, notify)
   ↓
Kafka Event (ResumePublished)
   ↓
Independent Consumers react
```

---

# What This Demo Proves (Architecturally)

* Temporal is **not testing**
* Kafka is **not calling services**
* ZooKeeper (if present) is **just infra**
* Publishing ≠ orchestration
* Clean separation of concerns
* Production-correct patterns

---