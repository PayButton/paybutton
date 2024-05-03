import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

import common from './rollup.config.js';

const config = common( 'development' );

module.exports = config;
config.output.file = 'dev/demo/paybutton.js'
config.plugins.push(
    serve( 'dev/demo' ),
    livereload( ),
);

