# 什麼是PayButton?

> PayButton可以通過在您的網站上添加捐款或購買的按鈕，來接收比特幣現金。<br />首先PayButton需要您先設置一個比特幣現金錢包，這樣才能開始進行收款。如果您還沒有錢包，[目前有很多方案供您選擇](https://bitcoincash.org/zh-CN/wallets/)。

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp" theme='{ "palette": { "primary": "#42b983", "secondary": "#ffffff", "tertiary": "#333333"} }'></div>

>

# 基礎用法

只需將以下內容添加到您網站的HTML中，用您的比特幣現金錢包中的地址替換YOUR_ADDRESS_HERE:

<div class="paybutton" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton@^1.0/dist/paybutton.js"></script>
<div class="paybutton" to="bch_address_here"></div>
```

# 進階用法

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

您還可以創建一個可視性的PayButton插件，不需要點擊按鈕即可打開:

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

# 參數

使用以下選項來自定義您的PayButton:

## to

> **參數"to"用來定義匯款去向。**

!> 此參數是必需使用的。可用值是一切有效的比特幣現金地址。

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

> **參數"amount"用來定義指定金額。將此參數與可選用的參數"currency"結合使用，可以指定以其他貨幣來顯示特定的金額。**

?> 此參數是可選用的。默認值為0。有效值為任何十進制。

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

> **參數"currency"用來定義幣種。將此參數與可選用的參數"currency"結合使用，可以指定以其他貨幣來顯示特定的金額。**

?> 此參數是可選用的。替代貨幣為"BCH"。可用幣種如下：BCH、SAT、美元、加幣、歐元、英鎊、澳元。

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

> **參數"text"用來定義按鈕上顯示的默認文字。**

?> 此參數是可選用的。默認文字為"Donate"。可用內容為任何文字符號。

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

> **參數"hover-text"用來定義當滑鼠懸停留時所顯示的文字。**

?> 此參數是可選用的。默認文字為"Click to send BCH"。可用內容為任何文字符號。

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

> **參數"theme"用來定義按鈕和對話框的主題。**

?> 此參數是可選用的。默認值為{ "palette": { "primary": "#4bc846", "secondary": "#f8fdf8", "tertiary": "#374936" } }。可用值為任何有效的調色板代碼值。

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

> **參數"animation"用來定義當滑鼠停留時按鈕所產生的改變。**

?> 此參數是可選用的。默認值為slide。可用值為slide、invert、none。

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

> **參數"success-text"用來定義成功付款後所顯示的文字。**

?> 此參數是可選用的。默認文字為"Thank for your support!"。可用內容為任何文字符號。

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

> **參數"on-success"用來定義指定地址收款後運行的回呼函式。**

?> 此參數是可選用的。默認值為空白。有效值為任何已定義的函式。

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

> **參數"on-transaction"用來定義收到任何付款到指定地址後運行回呼函式。**

?> 此參數是可選用的。默認值為空白。有效值為任何已定義的函式。

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

> **參數"random-satoshis"用來定義是否將付款金額的最後幾位隨機化，因此當一個人進行付款時不太可能觸發回呼onSuccess的同時另一個人正打開付款螢幕。**

?> 此參數是可選用的。默認值為false。有效值為true或false 。

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

# 貢獻

PayButton是一個社區主導的開放源代碼促進會。此項目的成功關鍵在於對社區的貢獻。

## 開發人員快速入門

### 构建

1. `git clone https://github.com/PayButton/paybutton.git`
2. `cd paybutton/react && npm i && npm run build && cd ../paybutton && npm i && npm run build`

### 启动Storybook

1. `cd react && npm i`
2. `npm start`
3. 如果網站沒有自動打開，它將在localhost:6006上運行。

### 启动Rollup

1. `cd paybutton && npm i`
2. `npm start`
3. 網站將在localhost:10001上運行。

### 网站/文件

1. `cd docs && npm i`
2. `npm run serve`
3. 網站將在localhost:3000上運行。

## 捐款

> 所有收到的PayButton捐款都直接用於資助PayButton的開發。

<div class="paybutton-widget" to="bitcoincash:qrmm7edwuj4jf7tnvygjyztyy0a0qxvl7q9ayphulp"></div>