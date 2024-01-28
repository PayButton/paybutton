# What Is PayButton?

> PayButton makes it easy to accept eCash by adding a donation or buy button to your website.<br />To get started, you'll have to set up a eCash wallet so you can begin receiving money. If you don’t have one yet, there are [plenty to choose from](https://e.cash/wallets).

<div class="paybutton" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp" theme='{ "palette": { "primary": "#42b983", "secondary": "#ffffff", "tertiary": "#333333"} }'></div>

>

# Basic Usage

Simply add the following to your website’s HTML, replacing `YOUR_ADDRESS_HERE` with an address from your eCash wallet:

<div class="paybutton" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>
<div class="paybutton" to="YOUR_ADDRESS_HERE"></div>
```

# Advanced Usage

Example using JavaScript to generate a PayButton:

<div id="advanced-usage-example"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>

<div id="my_button"></div>

<script>
function mySuccessFunction(txid, amount) {
  console.log( { txid, amount } );
}

function myTransactionFunction(txid, amount) {
  console.log( 'Received: ' + amount );
}

function myOpenFunction() {
  console.log('Dialog opened.');
}

function myCloseFunction(success) {
  console.log(`Dialog closed - user ${success ? 'did' : 'did not'} pay.`);
}

var config = {
  to: 'ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp',
  amount: 4.5,
  goalAmount: 300000,
  editable: false,
  currency: 'USD',
  text: 'Tip Us a Coffee!',
  hoverText: 'One coffee',
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
  onOpen: myOpenFunction,
  onClose: myCloseFunction,
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

function myOpenFunction() {
  console.log('Dialog opened.');
}

function myCloseFunction(success) {
  console.log(`Dialog closed - user ${success ? 'did' : 'did not'} pay.`);
}



// render JS button
render( '#advanced-usage-example', {
  to: 'ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp',
  amount: 4.5,
  goalAmount: 300000,
  editable: false,
  currency: 'USD',
  text: 'Tip Us a Coffee!',
  hoverText: 'One coffee',
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
  onOpen: myOpenFunction,
  onClose: myCloseFunction,
  randomSatoshis: true
})

// render 'react' button
render( '#react-usage-example', {
  text: 'Join the Cause',
  hoverText: 'Fee: $12',
  currency: 'USD',
  amount: 12,
  to: 'ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp',
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

  const to = 'ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp'
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

<div class="paybutton-widget" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp" style="max-width:500px"></div>

<!-- tabs:start -->

#### ** HTML **

```html
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>
<div class="paybutton-widget" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"></div>
```

#### ** JavaScript **

```javascript
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>

<div id="my_button"></div>

<script>
PayButton.renderWidget(document.getElementById('my_button'), { to: 'ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp' });
</script>
```

#### ** React **

```react
import { Widget as PayButtonWidget } from '@paybutton/react'

function App() {
  return <PayButtonWidget
    to='ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp'
  />
}
export default App;
```

<!-- tabs:end -->

# Parameters

Customize your PayButton with the following available options:

## to

> **The ‘to’ parameter specifies where the money will be sent to.**

!> This parameter is required. Possible values are any valid eCash address.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"
```

#### ** JavaScript **

```javascript
to: 'ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp'
```

#### ** React **

```react
to = "ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"
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

?> This parameter is optional. Default value is ‘XEC’. Possible values are ‘XEC’, ‘BCH’, ‘USD’ and ‘CAD’.

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

?> This parameter is optional. Default value is ‘Click to send XEC’. Possible values are any string.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
hover-text="Send eCash"
```

#### ** JavaScript **

```javascript
hoverText: 'Send eCash'
```

#### ** React **

```react
hoverText = "Send eCash"
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

## editable

> **The ‘editable’ parameter specifies whether to provide an input for the user to be able to change the payment amount.**

?> This parameter is optional. Default value is false. Possible values are true or false.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
editable="true"
```

#### ** JavaScript **

```javascript
editable: true
```

#### ** React **

```react
editable = true
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

## on-open

> **The ‘on-open’ parameter specifies the callback function that runs when the button is clicked, before the dialog opens.**

?> This parameter is optional. Default value is empty. Possible values are any defined function.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
on-open="successCallback"
```

#### ** JavaScript **

```javascript
onOpen: successCallback
```

#### ** React **

```react
onOpen = successCallback
```

<!-- tabs:end -->

## on-close

> **The ‘on-close’ parameter specifies the callback function that runs when the dialog is closed.**

?> This parameter is optional. Default value is empty. Possible values are any defined function.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
on-close="successCallback"
```

#### ** JavaScript **

```javascript
onClose: successCallback
```

#### ** React **

```react
onClose = successCallback
```

<!-- tabs:end -->

## op-return

> **The ‘op-return’ parameter specifies the custom message that will be send with the transaction.**

?> This parameter is optional. Default value is empty. Possible values are any string with up to 68 bytes.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
op-return="myCustomMessage"
```

#### ** JavaScript **

```javascript
opReturn: "myCustomMessage"
```

#### ** React **

```react
opReturn = "myCustomMessage"
```

<!-- tabs:end -->

## disable-payment-id

> **The ‘disable-payment-id’ parameter removes the random ID generated for the payment that is used to prevent the onSuccess callback to be triggered by a person who has the payment screen open at the same time as another.**

?> This parameter is optional. Default value is false. Possible values are true or false.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
disable-payment-id="true"
```

#### ** JavaScript **

```javascript
disablePaymentId: true
```

#### ** React **

```react
disablePaymentId = true
```

<!-- tabs:end -->

## random-satoshis

> **The ‘random-satoshis’ parameter specifies whether to randomize the last few digits of the payment amount so that it’s unlikely that a payment made by one person will trigger the onSuccess callback of another who has the payment screen open at the same time.**

?> This parameter is optional. Default value is false. Possible values are true, false, or an integer from 0 to 4 that specifies how many last digits should be randomized. Setting it to true is the same as setting it to 3. Setting it to false is the same as setting it to 0.

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

> **The ‘disable-enforce-focus’ parameter is passed to the Dialog material UI component. Setting it to false can help with accessibility with technology such as screen readers but may throw errors on sites running Material UI.**

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

## ws-base-url

> **The ‘wsBaseUrl’ parameter specifies the URL for the websocket where information about new transactions will come from.**

?> This parameter is optional. Default value is ‘https://socket.paybutton.org’. Possible values are any valid URL.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
ws-base-url="https://socket.paybutton.org".
```

#### ** JavaScript **

```javascript
wsBaseUrl: 'https://socket.paybutton.org'
```

#### ** React **

```react
wsBaseUrl = "https://socket.paybutton.org"
```

<!-- tabs:end -->


## api-base-url

> **The ‘apiBaseUrl’ parameter specifies the URL for the API where information about new transactions, prices, and addresses will come from.**

?> This parameter is optional. Default value is ‘https://paybutton.org’. Possible values are any valid URL.

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
api-base-url="https://paybutton.org".
```

#### ** JavaScript **

```javascript
apiBaseUrl: 'https://paybutton.org'
```

#### ** React **

```react
apiBaseUrl = "https://paybutton.org"
```

<!-- tabs:end -->

# Contribute

PayButton is a community-driven open-source initiative. Contributions from the community are _crucial_ to the success of the project.

## Developer Quick Start

### Build

1. `git clone https://github.com/PayButton/paybutton.git`
2. `cd paybutton && yarn build`

### Starting Storybook

1. `docker-compose up`
2. Wait for storybook to initialize.
3. Open `http://localhost:6006`.

### Starting Rollup

1. `yarn start:rollup`
3. Site will be running on `localhost:10001`.

### Website / Documentation

1. `yarn start:docs`
3. Site will be running on `localhost:3001`.

## Donate

> All PayButton donations received are used to directly fund PayButton development.

<div class="paybutton-widget" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp" style="max-width:500px"></div>
