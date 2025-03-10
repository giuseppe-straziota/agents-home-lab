import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3005',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ''),

        configure: (proxy, options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('error', err, options);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
          //  console.log('Request sent to target:', req.method, req.url,proxyReq);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
          //  console.log('Response received from target:', proxyRes.statusCode, req.url);
          });
        }
      },
    }
  }
})
