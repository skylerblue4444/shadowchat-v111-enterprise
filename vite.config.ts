import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: "/shadowchat-v111-enterprise/",
  root: './client',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'terser',
    sourcemap: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            '@tanstack/react-query',
            '@trpc/client',
            '@trpc/react-query',
          ],
          'ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
          ],
        },
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|svg/.test(ext)) {
            return `images/[name].[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name].[hash][extname]`
          } else if (ext === 'css') {
            return `css/[name].[hash][extname]`
          }
          return `[name].[hash][extname]`
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: '0.0.0.0',
    middlewareMode: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@components': path.resolve(__dirname, './client/components'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@trpc/client',
      '@trpc/react-query',
      'zustand',
      'zod',
    ],
  },
})
