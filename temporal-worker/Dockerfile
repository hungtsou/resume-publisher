# Dev stage
FROM node:20-slim AS dev

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source files (will be overridden by volume mount in docker-compose)
COPY . .

# Start the application in dev mode using ts-node
CMD ["npm", "run", "start"]

# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Runtime stage
FROM node:20-slim AS runtime

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled JavaScript from build stage
COPY --from=builder /app/lib ./lib

# Start the compiled worker
CMD ["node", "lib/worker.js"]
