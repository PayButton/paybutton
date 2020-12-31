# What Is PayButton?

> PayButton makes it easy to accept Bitcoin Cash by adding a donation or buy button to your website. PayButton requires that you have set up a wallet already so you can begin receiving money. If you don’t have one, there are plenty to choose from.

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" theme='{ "palette": { "primary": "#42b983", "secondary": "#ffffff", "tertiary": "#333333"} }'></div>

>

# Basic Usage

Simply add the following to your website’s HTML:

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton@1.0.2/dist/paybutton.js"></script>
<div class="paybutton" to="bch_address_here"></div>
```

# Advanced Usage

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

# React

Example using React to generate a PayButton:

```react

```

# Parameters

Customize your PayButton with the following available options:

## to

> **The ‘to’ parameter specifies where the money will be sent to.**

?> This parameter is required. Possible values are any valid Bitcoin Cash address.

<!-- tabs:start -->

#### ** HTML **

```html
to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"
```

#### ** JavaScript **

```javascript
to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp'
```

#### ** React **

```react

```

<!-- tabs:end -->

## amount

> **The ‘amount’ parameter specifies how much money to request. Use this in conjunction with the optional ‘currency’ paramter to specify a specific amount in a different currency.**

?> This parameter is optional. Default value is 0. Possible values are any decimal.

<!-- tabs:start -->

#### ** HTML **

```html
amount=100
```

#### ** JavaScript **

```javascript
amount: 100
```

#### ** React **

```react

```

<!-- tabs:end -->

## currency

> **The ‘currency’ parameter specifies what currency the amount will be denominated in. Use this in conjunction with the optional ‘amount’ paramter to specify an specific amount in a different currency.**

?> This parameter is optional. Default value is ‘BCH’. Possible values are ‘BCH’, ‘SAT’, ‘USD’, ‘CAD’, ‘EUR’, ‘GBP’, and ‘AUD’.


<!-- tabs:start -->

#### ** HTML **

```html
currency="USD"
```

#### ** JavaScript **

```javascript
currency: 'USD'
```

#### ** React **

```react

```

<!-- tabs:end -->

## text

> **The ‘text’ parameter specifies the default text displayed on the button.**

?> This parameter is optional. Default value is ‘Donate’. Possible values are any string.

<!-- tabs:start -->

#### ** HTML **

```html
text="Purchase"
```

#### ** JavaScript **

```javascript
text: 'Purchase'
```

#### ** React **

```react

```

<!-- tabs:end -->

## hover-text

> **The ‘hover-text’ parameter specifies the text displayed on the button on hover.**

?> This parameter is optional. Default value is ‘Click to send BCH’. Possible values are any string.

<!-- tabs:start -->

#### ** HTML **

```html
hover-text="Send Bitcoin Cash"
```

#### ** JavaScript **

```javascript
hoverText: 'Send Bitcoin Cash'
```

#### ** React **

```react

```

<!-- tabs:end -->

## theme

> **The ‘theme’ parameter specifies the themeing of the button and dialog.**

?> This parameter is optional. Default value is ‘{ “palette”: { “primary”: “#4bc846”, “secondary”: “#f8fdf8”, “tertiary”: “#374936” } }’. Possible values are any valid palette object.

<!-- tabs:start -->

#### ** HTML **

```html
theme='{ "palette": { "primary": "#ee8b2b", "secondary": "#fefbf8", "tertiary": "#504030"} }'
```

#### ** JavaScript **

```javascript
theme: { "palette": { "primary": "#ee8b2b", "secondary": "#fefbf8", "tertiary": "#504030"} }
```

#### ** React **

```react

```

<!-- tabs:end -->

## animation

> **The ‘animation’ parameter specifies how the buttons change when hovering over them.**

?> This parameter is optional. Default value is ‘slide’. Possible values are ‘slide’, ‘invert’, ‘none’.

<!-- tabs:start -->

#### ** HTML **

```html
animation="invert"
```

#### ** JavaScript **

```javascript
animation: 'invert'
```

#### ** React **

```react

```

<!-- tabs:end -->

## success-text

> **The ‘success-text’ parameter specifies the text displayed upon successful payment.**

?> This parameter is optional. Default value is ‘Thanks for your support!’. Possible values are any string.

<!-- tabs:start -->

#### ** HTML **

```html
success-text="Thanks!"
```

#### ** JavaScript **

```javascript
successText: 'Thanks!'
```

#### ** React **

```react

```

<!-- tabs:end -->

## on-success

> **The ‘on-success’ parameter specifies the callback function that runs upon successful payment.**

?> This parameter is optional. Default value is empty. Possible values are any defined function.

<!-- tabs:start -->

#### ** HTML **

```html
on-success="successCallback"
```

#### ** JavaScript **

```javascript
onSuccess: successCallback
```

#### ** React **

```react

```

<!-- tabs:end -->

## on-transaction

> **The ‘on-transaction’ parameter specifies the callback function that runs upon any payment received to the specified address.**

?> This parameter is optional. Default value is empty. Possible values are any defined function.

<!-- tabs:start -->

#### ** HTML **

```html
on-transaction="transactionCallback"
```

#### ** JavaScript **

```javascript
onTransaction: transactionCallback
```

#### ** React **

```react

```

<!-- tabs:end -->

## random-satoshis

> **The ‘random-satoshis’ parameter specifies whether to randomize the last few digits of the payment amount so that it’s unlikely that a payment made by one person will trigger the onSuccess callback of another who has the payment screen open at the same time.**

?> This parameter is optional. Default value is false. Possible values are true or false.

<!-- tabs:start -->

#### ** HTML **

```html
random-satoshis="true"
```

#### ** JavaScript **

```javascript
randomSatoshis: true
```

#### ** React **

```react

```

<!-- tabs:end -->