import common from './rollup.config.js';

import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';

const config = common( 'production' );

module.exports = config;

config.plugins.push(
  terser( {
    mangle: true,
  } ),
  cleanup( { comments: 'none' } ),
);
