import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,               // browser auto open
    historyApiFallback: true  // 👈 FIX for "No routes matched /dashboard"
  }
})

