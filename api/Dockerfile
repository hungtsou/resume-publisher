# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Dev stage
FROM node:20-alpine AS dev

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source files (will be overridden by volume mount in docker-compose)
COPY . .

# Expose port (configurable via PORT env var)
EXPOSE 3000

# Start the application in dev mode
CMD ["npm", "run", "dev"]

# Runtime stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled JavaScript from build stage
COPY --from=builder /app/dist ./dist

# Expose port (configurable via PORT env var)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
