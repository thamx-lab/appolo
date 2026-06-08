import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'router-vendor'
          }
          if (id.includes('node_modules/three/')) {
            return 'three-vendor'
          }
          if (id.includes('node_modules/@react-three/')) {
            return 'r3f-vendor'
          }
          if (id.includes('node_modules/gsap/') || id.includes('node_modules/@gsap/')) {
            return 'gsap-vendor'
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'framer-vendor'
          }
          if (id.includes('node_modules/@supabase/')) {
            return 'supabase-vendor'
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'lucide-vendor'
          }
          if (id.includes('node_modules/')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
