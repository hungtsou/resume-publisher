import { defineConfig } from 'vite';

export default defineConfig({
  // Vite config for Node.js backend
  // vite-node will use this for running TypeScript directly
  server: {
    port: 3000,
  },
});
