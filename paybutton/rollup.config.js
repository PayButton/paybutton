import alias from '@rollup/plugin-alias';
import commonJS from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from "@rollup/plugin-json";
import progress from "rollup-plugin-progress";
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default (env) => ({
  makeAbsoluteExternalsRelative: true,
  preserveEntrySignatures: 'strict',
  input: 'src/index.tsx',
  output: {
    file: 'dist/paybutton.js',
    name: 'PayButton',
    format: 'umd',
    systemNullSetters: false,
  },
  plugins: [
    progress({ clearline: true }),
    alias({
      entries: [
        { find: 'react', replacement: require.resolve('preact/compat') },
        { find: 'react-dom', replacement: require.resolve('preact/compat') },
        { find: 'react/jsx-runtime', replacement: require.resolve('preact/jsx-runtime') }
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      preventAssignment: true,
    }),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      preferBuiltins: false
    }),
    commonJS({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      transformMixedEsModules: true
    }),
    json(),
    nodePolyfills({ sourceMap: true }),
    typescript({
      compilerOptions: {
        lib: ["es5", "es6", "ES2020", "ESnext", "dom"],
        target: "ES2020"
      }
    }),
  ],
  external: ['@types/currency-formatter', 'currency-formatter', 'jsx-runtime'],
});
