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
        { find: 'react', replacement: require.resolve( 'preact/compat' ) },
        { find: 'react-dom', replacement: require.resolve( 'preact/compat' ) },
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    image(),
    svg(),
    resolve( { browser: true, extensions: [ '.js', '.jsx', '.ts', '.tsx', '.svg' ] } ),
    commonJS( { extensions: [ '.js', '.jsx', '.ts', '.tsx', '.svg' ], transformMixedEsModules: true } ),
    image(),
    nodePolyfills(),
    typescript(),
    json(),
    dotenv({
      cwd: "../react"
    }),
  ],
  external: ['@types/currency-formatter', 'currency-formatter'],
});
