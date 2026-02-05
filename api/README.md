# Resume Publisher API

A Node.js API server built with Express, TypeScript, and Vite.

## Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast development with vite-node
- **Security** - Helmet for security headers
- **CORS** - Cross-origin resource sharing enabled
- **Logging** - Morgan HTTP request logger
- **ESLint** - Code linting with TypeScript support

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

```bash
npm install
```

## Available Scripts

- `npm run dev` - Start development server using vite-node (runs TypeScript directly)
- `npm run build` - Build TypeScript to JavaScript in the `dist` folder
- `npm run start` - Run the built JavaScript from `dist` folder
- `npm run lint` - Run ESLint to check code quality

## Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Project Structure

```
api/
├── src/
│   ├── index.ts              # Main Express application entry point
│   ├── routes/
│   │   └── check-route.ts    # Check route definition
│   └── controllers/
│       └── check-controller.ts  # Check route controller logic
├── dist/                     # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.cjs
└── README.md
```

## API Endpoints

### Health Check

- **GET /** - API status
  ```json
  {
    "message": "Resume Publisher API is running"
  }
  ```

- **GET /check** - Health check endpoint
  ```json
  {
    "status": "ok",
    "message": "API check endpoint is working",
    "timestamp": "2026-02-03T12:00:00.000Z"
  }
  ```

## Middleware

The following middlewares are configured in order:

1. **Morgan** - HTTP request logging
2. **Helmet** - Security headers
3. **CORS** - Cross-origin resource sharing
4. **express.json()** - JSON body parser

## Configuration

- **Port**: Defaults to `3000`, can be overridden with `PORT` environment variable
- **TypeScript**: Configured in `tsconfig.json`
- **ESLint**: Configured in `.eslintrc.cjs`
- **Vite**: Configured in `vite.config.ts`

## Building for Production

```bash
npm run build
npm run start
```

## Code Quality

Run ESLint to check for code quality issues:

```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the root of the `api` folder to set environment variables:

```env
PORT=3000
```

## License

Private project
