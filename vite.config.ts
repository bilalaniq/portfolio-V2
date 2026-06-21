import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from '@tailwindcss/vite'
import { plugin as markdown, Mode } from 'vite-plugin-markdown'

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    markdown({ 
      mode: [Mode.HTML] // Explicitly declares the Mode enum to satisfy TypeScript
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
