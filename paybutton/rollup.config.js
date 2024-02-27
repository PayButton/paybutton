import alias from '@rollup/plugin-alias';
import commonJS from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svg from 'rollup-plugin-svg';
import typescript from '@rollup/plugin-typescript';
import json from "@rollup/plugin-json";
import progress from "rollup-plugin-progress";

export default ( env ) => ({
  makeAbsoluteExternalsRelative: true,
	preserveEntrySignatures: 'strict',
  input: 'src/index.tsx',
  output: {
    file: 'dist/paybutton.js',
    name: 'PayButton',
    esModule: true,
    generatedCode: {
      reservedNamesAsProps: false
    },
    systemNullSetters: false
  },
  plugins: [
    progress({
      clearline: true
    }),
    alias({
      entries: [
        { find: 'react', replacement: require.resolve( 'preact/compat' ) },
        { find: 'react-dom', replacement: require.resolve( 'preact/compat' ) },
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
      preferBuiltins: false 
    }),
    commonJS( { extensions: [ '.js', '.jsx', '.ts', '.tsx', '.svg' ], transformMixedEsModules: true } ),
    image(),
    nodePolyfills(),
    json(),
    typescript({ compilerOptions: {lib: ["es5", "es6", "dom", "esnext"], target: "esnext"}}),
    ],
    external: ['@types/currency-formatter', 'currency-formatter'],
  });
