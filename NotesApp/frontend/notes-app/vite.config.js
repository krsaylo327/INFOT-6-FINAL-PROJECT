import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Export Vite configuration with React plugin enabled
export default defineConfig({
  plugins: [react()], // Enables React fast refresh and JSX support
})
