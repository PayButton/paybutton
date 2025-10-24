import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import replace from '@rollup/plugin-replace';
import svg from 'rollup-plugin-svg';
import inject from '@rollup/plugin-inject';
import typescript from '@rollup/plugin-typescript';
import json from "@rollup/plugin-json";
import dotenv from "rollup-plugin-dotenv";
import progress from "rollup-plugin-progress";
import { fileURLToPath } from 'url';
import { dirname, resolve as pathResolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default ( env ) => ({
  input: 'src/index.tsx',
  output: {
    file: 'dist/paybutton.js',
    name: 'PayButton',
    exports: 'default',
    esModule: false,
    format: 'umd',
  },
  plugins: [
    progress({
      clearline: true
    }),
    alias({
      entries: [
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },

        // minimal polyfill for cipher-base/hash.js Transform
        { find: 'stream', replacement: 'stream-browserify' },

        { find: '@paybutton/react', replacement: pathResolve(__dirname, '../react/dist/index.modern.mjs') },
      ],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      preventAssignment: true,
    }),
    image(),
    svg(),
    resolve({
      browser: true,
      preferBuiltins: false,
      dedupe: ['preact', 'preact/compat', 'preact/jsx-runtime'],
      extensions: [ '.js', '.jsx', '.ts', '.tsx', '.svg' ],
    }),
    typescript({ compilerOptions: {lib: ["es5", "es6", "dom"], target: "es5"}}),
    commonJS( { extensions: [ '.js', '.jsx' ], transformMixedEsModules: true } ),

    inject({
      process: 'process',
      Buffer: ['buffer', 'Buffer'],
    }),

    json(),
    dotenv({
      cwd: "../react"
    }),
  ],
  external: [
    '@types/currency-formatter',
    'currency-formatter'
  ],
});

