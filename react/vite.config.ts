import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['lib', 'main.tsx'],})
  ],
  build: {
    copyPublicDir: false,
    lib: {
      formats: ['es'],
      //entry: resolve(__dirname, 'src/main.tsx'),
      entry: resolve(__dirname, 'main.tsx'),
      fileName: 'index'
    },
  },
})
