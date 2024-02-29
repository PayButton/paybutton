import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import commonjs from 'vite-plugin-commonjs'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        commonjs(),
        dts()
    ],
    build: {
        outDir: 'dist',
        target: 'esnext',
        minify: true,
        lib: {
            name: 'paybutton',
            entry: 'index.ts',
            formats: ['es', 'cjs'],
            fileName: format => `paybutton-react.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'svg'],
            output: {
                sourcemapExcludeSources: true,
            },
        },
    },
})
