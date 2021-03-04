import alias from '@rollup/plugin-alias';
import cleanup from 'rollup-plugin-cleanup';
import commonJS from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import svg from 'rollup-plugin-svg';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default (env) => ({
  input: 'src/index.tsx',
  output: {
    file: 'dist/paybutton.js',
    name: 'PayButton',
    format: 'umd',
  },
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: require.resolve('preact/compat') },
        { find: 'react-dom', replacement: require.resolve('preact/compat') },
      ],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    image(),
    svg(),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
    }),
    commonJS({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
      transformMixedEsModules: true,
    }),
    image(),
    typescript(),
    terser({
      mangle: true,
    }),
    cleanup({ comments: 'none' }),
  ],
  external: ['@types/currency-formatter', 'currency-formatter'],
});
