import alias from '@rollup/plugin-alias';
import commonJS from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svg from 'rollup-plugin-svg';
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
    format: 'umd',
  },
  plugins: [
    progress({
      clearline: true
    }),
    alias({
      entries: [
        { find: 'react', replacement: pathResolve(__dirname, 'node_modules/preact/compat/dist/compat.js') },
        { find: 'react-dom', replacement: pathResolve(__dirname, 'node_modules/preact/compat/dist/compat.js') },
        { find: '@paybutton/react', replacement: pathResolve(__dirname, '../react/dist/index.js') },
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      preventAssignment: true,
    }),
    image(),
    svg(),
    resolve({ 
      browser: true, 
      extensions: [ '.js', '.jsx', '.ts', '.tsx', '.svg' ],
      preferBuiltins: false,
      mainFields: ['module', 'main']
    }),
    typescript({ compilerOptions: {lib: ["es5", "es6", "dom"], target: "es5"}}),
    commonJS( { extensions: [ '.js', '.jsx' ], transformMixedEsModules: true } ),
    image(),
    nodePolyfills(),
    json(),
    dotenv({
      cwd: "../react"
    }),
    ],
    external: ['@types/currency-formatter', 'currency-formatter'],
  });
