import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.glb', '**/*.vrm', '**/*.blend'],
  server: {
    watch: {
      ignored: ['**/images.webp', '**/scratch_*', '**/.git/**', '**/frames/**', '**/*.glb', '**/*.vrm', '**/*.blend', '**/public/assets/**'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@react-three/rapier') || id.includes('@dimforge')) {
              return 'vendor-physics';
            }
            if (id.includes('@react-three') || id.includes('three') || id.includes('meshline')) {
              return 'vendor-three';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
})

