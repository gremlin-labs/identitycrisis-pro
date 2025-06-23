import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

// Convert ESM URL paths to filesystem paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL('.', import.meta.url).pathname;

export default defineConfig({
  root: 'src',
  base: './', // Use relative paths
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: false, // Don't empty the output directory
    assetsDir: 'assets',
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      }
    }
  },
  plugins: [
    react(),
    tailwindcss() // Tailwind CSS v4 plugin
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
});