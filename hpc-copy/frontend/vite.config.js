import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    proxy:{
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    },
    // host:'0.0.0.0' ---> this is used to host locally over a network.
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})