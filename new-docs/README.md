## What Is PayButton?

> PayButton makes it easy to accept Bitcoin Cash by adding a donation or buy button to your website. PayButton requires that you have set up a wallet already so you can begin receiving money. If you don’t have one, there are plenty to choose from.

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" theme='{ "palette": { "primary": "#42b983", "secondary": "#ffffff", "tertiary": "#333333"} }'></div>

>

## Basic Usage

Simply add the following to your website’s HTML:

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton@1.0.2/dist/paybutton.js"></script>
<div class="paybutton" to="bch_address_here"></div>
```

## Advanced Usage

Example using JavaScript to generate a PayButton:

<div id="advanced-usage-1"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton@1.0.2/dist/paybutton.js"></script>

<div id="my_button"></div>

<script>
function mySuccessFunction(txid, amount) {
  console.log( { txid, amount } );
}

function myTransactionFunction(txid, amount) {
  console.log( 'Received: ' + amount );
}

var config = {
  to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
  amount: 25,
  currency: 'EUR',
  text: 'Purchase (25 EUR)',
  hoverText: 'Limited Time Only!',
  theme: {
    palette: {
      primary: '#ee8b2b',
      secondary: '#fefbf8',
      tertiary: '#504030'
    }
  },
  animation: 'invert',
  successText: 'Purchase Complete!',
  onSuccess: mySuccessFunction,
  onTransaction: myTransactionFunction,
  randomSatoshis: true
};

PayButton.render(document.getElementById('my_button'), config);
</script>
```

<script>

function mySuccessFunction(txid, amount) {
  console.log( { txid, amount } );
}

function myTransactionFunction(txid, amount) {
  console.log( 'Received: ' + amount );
}

// render button 1
render( '#advanced-usage-1', {
  to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
  amount: 25,
  currency: 'EUR',
  text: 'Purchase (25 EUR)',
  hoverText: 'Limited Time Only!',
  theme: {
    palette: {
      primary: '#ee8b2b',
      secondary: '#fefbf8',
      tertiary: '#504030'
    }
  },
  animation: 'invert',
  successText: 'Purchase Complete!',
  onSuccess: mySuccessFunction,
  onTransaction: myTransactionFunction,
  randomSatoshis: true
})

// render button 2
/*render( '#advanced-usage-2', {
  text: 'Purchase',
  to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
  theme: {
    palette: {
      primary: '#b94283',
      secondary: '#ffffff',
      tertiary: '#333333'
    }
  }
})*/

</script>

## Parameters