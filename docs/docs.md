---
layout: default
title: Documentation
permalink: /docs/
---

## Summary

PayButton makes it easy to accept Bitcoin Cash by adding a donation or buy button to your website. PayButton requires that you have set up a wallet already so you can begin receiving money. If you don't have one, [there are plenty to choose from](https://www.bitcoincash.org/wallets.html). 

## Basic Usage

Simply add the following to your website's HTML:

```
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>

<div class="paybutton" to="bch_address_here"></div>
```

## Advanced Usage

### Generate using JavaScript

Example using JavaScript to generate a PayButton.

```
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>

<div id="button_element_id"></div>

<script>
function mySuccessFunction(txid, amount) {
  console.log( { txid, amount } );
}

var config = {
  text: 'Donate',
  amount: 100,
  currency: 'USD',
  to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp',
  onSuccess: mySuccessFunction
};

PayButton.render(document.getElementById('button_element_id'), config);
</script>
```

### Parameters

#### to

**This parameter is required. Possible values are any valid Bitcoin Cash address.**

The 'to' parameter specifies where the money will be sent to.

Example:

```to: 'bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp'```

#### amount

**This parameter is optional. Default value is 0. Possible values are any decimal.**

The 'amount' parameter specifies how much money to request. Use this in conjunction with the optional 'currency' paramter to specify a specific amount in a different currency.

Example:

```amount: 100```

#### currency

**This parameter is optional. Default value is 'BCH'. Possible values are 'BCH', 'SAT', 'USD', 'CAD', 'EUR', 'GBP', and 'AUD'.**

The 'currency' parameter specifies what currency the amount will be denominated in. Use this in conjunction with the optional 'amount' paramter to specify an specific amount in a different currency.

Example:

```currency: 'USD'```

#### text

**This parameter is optional. Default value is 'Donate'. Possible values are any string.**

The 'text' parameter specifies the default text displayed on the button.

Example:

```text: 'Purchase'```

#### hover-text

**This parameter is optional. Default value is 'Click to send BCH'. Possible values are any string.**

The 'hover-text' parameter specifies the text displayed on the button on hover.

Example:

```hover-text: 'Send Bitcoin Cash'```


#### theme

**This parameter is optional. Default value is '{ "palette": { "primary": "#4bc846", "secondary": "#f8fdf8", "tertiary": "#374936" } }'. Possible values are any valid pallete object.**

The 'theme' parameter specifies the themeing of the button and dialog.

Example:

```theme: '{ "palette": { "primary": "#ee8b2b", "secondary": "#fefbf8", "tertiary": "#504030"} }'```

#### success-text

**This parameter is optional. Default value is 'Thanks for your support!'. Possible values are any string.**

The 'success-text' parameter specifies the text displayed upon successful payment.

Example:

```success-text: 'Thanks!'```

#### onSuccess

**This parameter is optional. Default value is empty. Possible values are any defined function.**

The 'onSuccess' parameter specifies the callback function that runs upon successful payment.

Example:

```onSuccess: successCallback```

#### onTransaction

**This parameter is optional. Default value is empty. Possible values are any defined function.**

The 'onTransaction' parameter specifies the callback function that runs upon any payment received to the specified address.

Example:

```onTransaction: transactionCallback```

#### random-satoshis

**This parameter is optional. Default value is false. Possible values are true or false.**

The 'random-satoshis' parameter specifies whether to randomize the last few digits of the payment amount so that it's unlikely that a payment made by one person will trigger the onSuccess callback of another who has the payment screen open at the same time.

Example:

```random-satoshis: true```

You can find the source code on [GitHub](http://github.com/PayButton/paybutton).
