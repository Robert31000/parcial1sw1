import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import stdLibBrowser from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
  plugins: [
    react(),
    stdLibBrowser(),  // 🧠 habilita "global", "process", etc.
  ],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    cors: true,
    allowedHosts: ["decision-significantly-built-left.trycloudflare.com"], 
  },
  
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',  // ✅ esto es suficiente
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),  // ✅ polífill para producción
      ],
    },
  },
});
