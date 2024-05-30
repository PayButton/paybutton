import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import * as packageJson from './package.json'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['lib', 'main.tsx'],})
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'main.tsx'),
      formats: ['es'],
      fileName: 'app'
    },
  }
})
