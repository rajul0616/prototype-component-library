import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/prototype-component-library/',
  plugins: [react()],
})
