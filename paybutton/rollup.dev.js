import html from '@rollup/plugin-html';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

import common from './rollup.config.js';

const config = common( 'development' );

module.exports = config;

config.plugins.push(
    html( { template } ),
    serve( 'dist' ),
    livereload( ),
);

function template ( { attributes, title, bundle } ) {
  return `
    <!DOCTYPE html>
    <html ${attributes}>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
      </head>
      <body>
        ${ Object.keys( bundle ).map( chunk => `<script src="${chunk}"></script>`) }
        <div id="content">
          <div class="paybutton"
            amount="1"
            animation="invert"
            callback="( txid, amount ) => console.log( { txid, amount } )"
            currency="CAD"
            detect-payment="true"
            hover-text="Send BCH!!!"
            palette='{ "primary": "#26a", "secondary": "#dff", "dark": "#3a6" }'
            text="Donate!!!"
            to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"
            success-text="Thank you!!!!"
          >
          </div>
          <br />
          <div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" animation="invert" palette='{ "primary": "#26a", "secondary": "#dff", "dark": "#3a6" }'></div>
          <br />
          <div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" amount="2.1999" animation="none" palette="orange"></div>
          <br />
          <div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" amount="5" currency="USD" display-currency="BCH"></div>
          <br />
          <div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" amount="50000" currency="SAT" detect-payment="true"</div>
          <br />
          <div class="paybutton-widget" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" amount="50000" currency="SAT" detect-payment="true"</div>
          <br />
          <div id="js-test" />
        </div>
      </body>
      <script>
        PayButton.renderWidget(document.getElementById('js-test'), { to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp', currency: 'SAT', detect-payment: 'true' });
      </script>
    </html>
  `;
}