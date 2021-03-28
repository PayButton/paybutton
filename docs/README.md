# What Is PayButton?

> PayButton makes it easy to accept Bitcoin Cash by adding a donation or buy button to your website.<br />To get started, you'll have to set up a Bitcoin Cash wallet so you can begin receiving money. If you don’t have one yet, there are [plenty to choose from](https://bitcoincash.org/#wallets-section).

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" theme='{ "palette": { "primary": "#42b983", "secondary": "#ffffff", "tertiary": "#333333"} }'></div>

>

# Basic Usage

Simply add the following to your website’s HTML, replacing `YOUR_ADDRESS_HERE` with an address from your Bitcoin Cash wallet:

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton@^1.1/dist/paybutton.js"></script>
<div class="paybutton" to="YOUR_ADDRESS_HERE"></div>
```

# Advanced Usage

Example using JavaScript to generate a PayButton:

<div id="advanced-usage-example"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton@^1.1/dist/paybutton.js"></script>

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
  amount: 4.5,
  goalAmount: 300000,
  canEdit: false,
  currency: 'AUD',
  text: 'Tip Us a Coffee!',
  hoverText: 'One BCHinno',
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

// render JS button
render( '#advanced-usage-example', {
  to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
  amount: 4.5,
  goalAmount: 300000,
  canEdit: false,
  currency: 'AUD',
  text: 'Tip Us a Coffee!',
  hoverText: 'One BCHinno',
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

// render 'react' button
render( '#react-usage-example', {
  text: 'Join the Cause',
  hoverText: 'Fee: $12',
  currency: 'USD',
  amount: 12,
  to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
  theme: {
    palette: {
      primary: '#b94283',
      secondary: '#ffffff',
      tertiary: '#333333'
    }
  },
  onSuccess: mySuccessFunction
})

</script>

# React

Example using React to generate a PayButton:

<div id="react-usage-example"></div>

!> Requires React v16.3 or later.

```bash
npm i --save @paybutton/react
```

```react
import { PayButton } from '@paybutton/react'

function App() {
  function mySuccessFunction() {
    console.log("Success!")
  }

  const to = 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp'
  const amount = 12
  const currency = 'USD'
  const text = 'Join the Cause'
  const hoverText = 'Fee: $12'
  const theme = {
    palette: {
      primary: '#B94283',
      secondary: '#FFFFFF',
      tertiary: '#333333'
    }
  }
  const onSuccess = mySuccessFunction()

  return <PayButton
    to={to}
    amount={amount}
    currency={currency}
    text={text}
    hoverText={hoverText}
    theme={theme}
    onSuccess={onSuccess}
  />
}
```

# Widget

You can also create an always-visible PayButton Widget that doesn't require clicking a button to open:

<div class="paybutton-widget" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" style="max-width:500px"></div>

<!-- tabs:start -->

#### ** HTML **

```html
<script src="https://unpkg.com/@paybutton/paybutton@^1.1/dist/paybutton.js"></script>
<div class="paybutton-widget" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>
```

#### ** JavaScript **

```javascript
<script src="https://unpkg.com/@paybutton/paybutton@^1.1/dist/paybutton.js"></script>

<div id="my_button"></div>

<script>
PayButton.renderWidget(document.getElementById('my_button'), { to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp' });
</script>
```

#### ** React **

```react
import { Widget as PayButtonWidget } from '@paybutton/react'

function App() {
  return <PayButtonWidget
    to='bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp'
  />
}
export default App;
```

<!-- tabs:end -->

# Parameters

Customize your PayButton with the following available options:

## to

> **The ‘to’ parameter specifies where the money will be sent to.**

!> This parameter is required. Possible values are any valid Bitcoin Cash address.

**Example:**
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
to = "bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"
```

<!-- tabs:end -->

## amount

> **The ‘amount’ parameter specifies how much money to request. Use this in conjunction with the optional ‘currency’ paramter to specify a specific amount in a different currency.**

?> This parameter is optional. Default value is 0. Possible values are any decimal.

**Example:**
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
amount = 100
```

<!-- tabs:end -->

## currency

> **The ‘currency’ parameter specifies what currency the amount will be denominated in. Use this in conjunction with the optional ‘amount’ paramter to specify an specific amount in a different currency.**

?> This parameter is optional. Default value is ‘BCH’. Possible values are ‘BCH’, ‘SAT’, ‘USD’, ‘CAD’, ‘EUR’, ‘GBP’, and ‘AUD’.

**Example:**
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
currency = "USD"
```

<!-- tabs:end -->

## text

> **The ‘text’ parameter specifies the default text displayed on the button.**

?> This parameter is optional. Default value is ‘Donate’. Possible values are any string.

**Example:**
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
text = "Purchase"
```

<!-- tabs:end -->

## hover-text

> **The ‘hover-text’ parameter specifies the text displayed on the button on hover.**

?> This parameter is optional. Default value is ‘Click to send BCH’. Possible values are any string.

**Example:**
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
hoverText = "Send Bitcoin Cash"
```

<!-- tabs:end -->

## goal-amount

> **The ‘goal-amount’ parameter specifies how much in donations/contributions is required for funding to be considered complete, indicated by a progress bar.**

?> This parameter is optional. Default value is 0 (none). Possible values are any number.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
goal-amount="10"
```

#### ** JavaScript **

```javascript
goalAmount: 10
```

#### ** React **

```react
goalAmount = 10
```

<!-- tabs:end -->

## can-edit

> **The ‘can-edit’ parameter specifies whether to provide an input for the user to be able to change the payment amount.**

?> This parameter is optional. Default value is false. Possible values are true or false.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
can-edit="true"
```

#### ** JavaScript **

```javascript
canEdit: true
```

#### ** React **

```react
canEdit = true
```

<!-- tabs:end -->

## theme

> **The ‘theme’ parameter specifies the themeing of the button and dialog.**

?> This parameter is optional. Default value is ‘{ “palette”: { “primary”: “#4bc846”, “secondary”: “#f8fdf8”, “tertiary”: “#374936” } }’. Possible values are any valid palette object.

**Example:**
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
theme = { palette: { primary: "#ee8b2b", secondary: "#fefbf8", tertiary: "#504030"} }
```

<!-- tabs:end -->

## animation

> **The ‘animation’ parameter specifies how the buttons change when hovering over them.**

?> This parameter is optional. Default value is ‘slide’. Possible values are ‘slide’, ‘invert’, ‘none’.

**Example:**
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
animation = "invert"
```

<!-- tabs:end -->

## success-text

> **The ‘success-text’ parameter specifies the text displayed upon successful payment.**

?> This parameter is optional. Default value is ‘Thanks for your support!’. Possible values are any string.

**Example:**
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
successText = "Thanks!"
```

<!-- tabs:end -->

## on-success

> **The ‘on-success’ parameter specifies the callback function that runs upon successful payment.**

?> This parameter is optional. Default value is empty. Possible values are any defined function.

**Example:**
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
onSuccess = successCallback
```

<!-- tabs:end -->

## on-transaction

> **The ‘on-transaction’ parameter specifies the callback function that runs upon any payment received to the specified address.**

?> This parameter is optional. Default value is empty. Possible values are any defined function.

**Example:**
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
onTransaction = transactionCallback
```

<!-- tabs:end -->

## random-satoshis

> **The ‘random-satoshis’ parameter specifies whether to randomize the last few digits of the payment amount so that it’s unlikely that a payment made by one person will trigger the onSuccess callback of another who has the payment screen open at the same time.**

?> This parameter is optional. Default value is false. Possible values are true or false.

**Example:**
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
randomSatoshis = true
```

<!-- tabs:end -->

## hide-toasts

> **The ‘hide-toasts’ parameter specifies whether to let the application take full control of what happens when a payment is detected.**

?> This parameter is optional. Default value is false. Possible values are true or false.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
disabled="true"
```

#### ** JavaScript **

```javascript
disabled: true
```

#### ** React **

```react
disabled = true
```

<!-- tabs:end -->

## disable-enforce-focus

> **The ‘disable-enforce-focus’ parameter is passed to the Dialog material UI component. The ‘disable-enforce-focus’ parameter is passed to the Dialog material UI component. Setting it to false can help with accessibility with technology such as screen readers but may throw errors on sites running Material UI.**

?> This parameter is optional. Default value is true. Possible values are true or false.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
disable-enforce-focus="false"
```

#### ** JavaScript **

```javascript
disableEnforceFocus: false
```

#### ** React **

```react
disableEnforceFocus = false
```

<!-- tabs:end -->

## disabled

> **The ‘disabled’ parameter specifies whether to lock out the button/widget to prevent it from being used.**

?> This parameter is optional. Default value is false. Possible values are true or false.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
disabled="true"
```

#### ** JavaScript **

```javascript
disabled: true
```

#### ** React **

```react
disabled = true
```

<!-- tabs:end -->

# Contribute

PayButton is a community-driven open-source initiative. Contributions from the community are _crucial_ to the success of the project.

## Developer Quick Start

### Build

1. `git clone https://github.com/PayButton/paybutton.git`
2. `cd paybutton/react && npm i && npm run build && cd ../paybutton && npm i && npm run build`

### Starting Storybook

1. `cd react && npm i`
2. `npm start`
3. If site does not open automatically, it will be running on `localhost:6006`.

### Starting Rollup

1. `cd paybutton && npm i`
2. `npm start`
3. Site will be running on `localhost:10001`.

### Website / Documentation

1. `cd docs && npm i`
2. `npm run serve`
3. Site will be running on `localhost:3000`.

## Donate

> All PayButton donations received are used to directly fund PayButton development.

<div class="paybutton-widget" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" style="max-width:500px"></div>
