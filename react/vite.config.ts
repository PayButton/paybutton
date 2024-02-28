import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'
import path from 'path'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    base: '.',
    plugins: [
        react(),
        commonjs(),
        dts({ rollupTypes: true })
    ],
    build: {
        outDir: 'dist',
        lib: {
        entry: 'index.tsx',
        fileName: 'index'
        },
        rollupOptions: {
            external: ['react'],
            output: {
              globals: {
                react: 'React',
              },
            },
        },
    },
})
