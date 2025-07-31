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
        { 
          find: /^react\/jsx-runtime$/, 
          replacement: require.resolve('preact/compat/jsx-runtime').replace(/\\/g, '/') 
        },
        { 
          find: /^react\/jsx-dev-runtime$/, 
          replacement: require.resolve('preact/compat/jsx-dev-runtime').replace(/\\/g, '/') 
        },
        { find: 'react', replacement: require.resolve('preact/compat') },
        { find: 'react-dom', replacement: require.resolve('preact/compat') },
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
      dedupe: ['react', 'react-dom', 'preact']
    }),
    commonJS( { extensions: [ '.js', '.jsx', '.ts', '.tsx', '.svg' ], transformMixedEsModules: true } ),
    image(),
    nodePolyfills(),
    json(),
    dotenv({
      cwd: "../react"
    }),
    typescript({ compilerOptions: {lib: ["es5", "es6", "dom"], target: "es5"}}),
    ],
    external: ['@types/currency-formatter'],
  });
