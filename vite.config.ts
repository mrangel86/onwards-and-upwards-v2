import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure PDF.js worker handling for Vercel deployment
  assetsInclude: ['**/*.worker.js', '**/*.worker.min.js'],
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  build: {
    rollupOptions: {
      output: {
        // Ensure PDF.js worker is properly chunked
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        }
      }
    }
  }
}));
