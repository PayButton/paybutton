# 什么是PayButton?

> PayButton可以通过在您的网站上添加捐助或购买的按钮，来接收比特币现金。<br />首先PayButton需要您先设置一个比特币现金钱包，这样才能开始进行收款。如果您还没有钱包，[目前有很多方案供您选择](https://bitcoincash.org/zh-CN/wallets/)。

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" theme='{ "palette": { "primary": "#42b983", "secondary": "#ffffff", "tertiary": "#333333"} }'></div>

>

# 基础用法

只需将以下内容添加到您网站的HTML中，用您的比特币现金钱包中的地址替换YOUR_ADDRESS_HERE:

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton@^1.0/dist/paybutton.js"></script>
<div class="paybutton" to="bch_address_here"></div>
```

# 进阶用法

使用JavaScript生成PayButton的示例:

<div id="advanced-usage-example"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton@^1.0/dist/paybutton.js"></script>

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

// render JS button
render( '#advanced-usage-example', {
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

使用React生成PayButton的示例:

<div id="react-usage-example"></div>

!> 需要React v16.3或更高版本.

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

# 插件

您还可以创建一个可视性的PayButton插件，不需要点击按钮即可打开:

<div class="paybutton-widget" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>

<!-- tabs:start -->

#### ** HTML **

```html
<script src="https://unpkg.com/@paybutton/paybutton@^1.0/dist/paybutton.js"></script>
<div class="paybutton-widget" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>
```

#### ** JavaScript **

```javascript
<script src="https://unpkg.com/@paybutton/paybutton@^1.0/dist/paybutton.js"></script>

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

# 参数

使用以下选项来自定义您的PayButton:

## to

> **参数"to"用来定义汇款去向。**

!> 此参数是必需使用的。可用值是一切有效的比特币现金地址。

**例子:**
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

> **参数"amount"用来定义指定金额。将此参数与可选用的参数"currency"结合使用，可以指定以其他货币来显示特定的金额。**

?> 此参数是可选用的。默认值为0。有效值为任何十进制。

**例子:**
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

> **参数"currency"用来定义币种。将此参数与可选用的参数"amount"结合使用，可以指定以其他货币来显示特定的金额。**

?> 此参数是可选用的。默认货币为"BCH"。可用币种如下：BCH、SAT、美元、加拿大元、欧元、英镑、澳大利亚元

**例子:**
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

> **参数"text"用来定义按钮上显示的默认文字。**

?> 此参数是可选用的。默认文字为"Donate"。可用内容为任何文字符号。

**例子:**
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

> **参数"hover-text"用来定义当鼠标停留时所显示的文字。**

?> 此参数是可选用的。默认文字为"Click to send BCH"。可用内容为任何文字符号。

**例子:**
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

## theme

> **参数"theme"用来定义按钮和对话框的主题。**

?> 此参数是可选用的。默认值为{ "palette": { "primary": "#4bc846", "secondary": "#f8fdf8", "tertiary": "#374936" } }。可用值为任何有效的调色板代码值。

**例子:**
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

> **参数"animation"用来定义当鼠标停留时按钮所产生的改变。**

?> 此参数是可选用的。默认值为slide。可用值为slide、invert、none。

**例子:**
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

> **参数"success-text"用来定义成功付款后所显示的文字。**

?> 此参数是可选用的。默认文字为"Thank for your support!"。可用内容为任何文字符号。

**例子:**
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

> **参数"on-success"用来定义指定地址收款后运行的回调函数。**

?> 此参数是可选用的。默认值为空白。有效值为任何已定义的函数。

**例子:**
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

> **参数"on-transaction"用来定义收到任何付款到指定地址后运行回调函数。**

?> 此参数是可选用的。默认值为空白。有效值为任何已定义的函数。

**例子:**
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

> **参数"random-satoshis"用来定义是否将付款金额的最后几位随机化，因此当一个人进行付款时不太可能触发回调 onSuccess的同时另一个人正打开付款屏幕。**

?> 此参数是可选用的。默认值为false。有效值为true或false 。

**例子:**
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

## disableEnforceFocus

> **The ‘disableEnforceFocus’ parameter is passed to the Dialog material UI component. The ‘disableEnforceFocus’ parameter is passed to the Dialog material UI component. Setting it to false can help with accessibility with technology such as screen readers but may throw errors on sites running Material UI.**

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

# 贡献

PayButton是一个社群主导的开放源代码促进会。此项目的成功关键在于对社群的贡献。

## 开发人员快速入门

### 构建

1. `git clone https://github.com/PayButton/paybutton.git`
2. `cd paybutton/react && npm i && npm run build && cd ../paybutton && npm i && npm run build`

### 启动Storybook

1. `cd react && npm i`
2. `npm start`
3. 如果网站没有自动打开，它将在localhost:6006上运行。

### 启动Rollup

1. `cd paybutton && npm i`
2. `npm start`
3. 网站将在localhost:10001上运行。

### 网站/文件

1. `cd docs && npm i`
2. `npm run serve`
3. 网站将在localhost:3000上运行。

## 捐助

> 所有收到的PayButton捐助都直接用於资助PayButton的开发。

<div class="paybutton-widget" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>