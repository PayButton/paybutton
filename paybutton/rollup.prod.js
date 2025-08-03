import common from './rollup.config.js';

import terser from '@rollup/plugin-terser';

const config = common( 'production' );

config.plugins.push(
  terser( {
    mangle: true,
  } ),
);

export default config;
