---
layout: default
title: Documentation
permalink: /docs/
---

## Summary

PayButton makes it easy to accept Bitcoin Cash by adding a donation or buy button to your website. PayButton requires that you have setup a wallet already so you can begin receiving money. If you don't have one, [there are plenty to choose from](https://www.bitcoincash.org/wallets.html). 

## Basic Usage

Simply add the following to your website's HTML:

```
<script src="https://paybutton.cash/release/v1.0/js/paybutton.min.js"></script>

<button class="pay-button" address="bitcoincash:bch_address_here"></button>
```

## Advanced Usage

### Generate using JavaScript

Example using JavaScript to generate a PayButton.

```
<script src="https://paybutton.cash/release/v1.0/js/paybutton.min.js"></script>

<button id="button_element_id" class="pay-button"></button>

<script>
var config = {
  button_text: 'Donate',
  amount: 100,
  amount_type: 'USD',
  address: 'bitcoincash:qzqh7ej3rdrw6r32guzdg0x4a275hqwjkgtmjazc64',
  success_callback: '',
  type: 'button'
};

Paybutton.render('button_element_id', config);
</script>
```

### Parameters

#### address

**This parameter is required.**

The 'address' parameter specifies where the money will be sent to.

Example

```address: 'bitcoincash:qzqh7ej3rdrw6r32guzdg0x4a275hqwjkgtmjazc64'```

#### amount

**This parameter is optional. Default value is 0.**

The 'amount' parameter specifies how much money to request. Use this in conjunction with the optional 'amount_type' paramter to specify a specific amount in a different currency.

Example

```amount: 100```

#### amount-type

**This parameter is optional. Default value is 'BCH'.**

The 'amount-type' parameter specifies what currency the amount will be denominated in. Use this in conjunction with the optional 'amount' paramter to specify an specific amount in a different currency.

Example

```amount-type: USD```

You can find the source code on [GitHub](http://github.com/PayButton/paybutton).
