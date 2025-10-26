import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: { 
    host: '::', 
    port: 8080,
    hmr: {
      overlay: false
    }
  },
  plugins: [react()],
  resolve: { 
    alias: { 
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  optimizeDeps: {
    force: true,
    include: ['react', 'react-dom', 'axios']
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});


