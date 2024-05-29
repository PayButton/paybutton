import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['lib', 'lib/main.ts'],})
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'],
      fileName: 'app'
    },
  }
})
