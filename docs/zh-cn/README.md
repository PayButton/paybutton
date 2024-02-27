# 什么是PayButton?

> PayButton可以通过在您的网站上添加捐助或购买的按钮，来接收eCash。<br />首先PayButton需要您先设置一个eCash钱包，这样才能开始进行收款。如果您还没有钱包，[目前有很多方案供您选择](https://e.cash/wallets)。

<div class="paybutton" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp" theme='{ "palette": { "primary": "#42b983", "secondary": "#ffffff", "tertiary": "#333333"} }'></div>

>

# 基础用法

只需将以下内容添加到您网站的HTML中，用您的eCash钱包中的地址替换YOUR_ADDRESS_HERE:

<div class="paybutton" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>
<div class="paybutton" to="YOUR_ADDRESS"></div>
```

# 进阶用法

使用JavaScript生成PayButton的示例:

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

# 插件

您还可以创建一个可视性的PayButton插件，不需要点击按钮即可打开:

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

# 参数

使用以下选项来自定义您的PayButton:

## to

> **参数'to'用来定义汇款去向。**

!> 此参数是必需使用的。可用值是一切有效的eCash地址。

**例子:**
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

> **参数'amount'用来定义指定金额。将此参数与可选用的参数"currency"结合使用，可以指定以其他货币来显示特定的金额。**

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

> **参数'currency'用来定义币种。将此参数与可选用的参数"amount"结合使用，可以指定以其他货币来显示特定的金额。**

?> 此参数是可选用的。默认货币为"XEC"。可用币种如下：XEC、BCH、美元、加拿大元

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

> **参数'text'用来定义按钮上显示的默认文字。**

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

> **参数'hover-text'用来定义当鼠标停留时所显示的文字。**

?> 此参数是可选用的。默认文字为"Click to send XEC"。可用内容为任何文字符号。

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

> **参数'goal-amount'指定了需要多少捐款/贡献才能认为资金筹集已完成，由一个进度条指示。**

?> 此参数是可选的。默认值为0（无）。可能的值是任何数字。

**例子:**
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

> **参数'editable'指定是否提供一个输入框，以供用户能够改变付款金额。**

?> 此参数是可选用的。默认值为false。有效值为true或false。

**例子:**
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

> **参数'theme'用来定义按钮和对话框的主题。**

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

> **参数'animation'用来定义当鼠标停留时按钮所产生的改变。**

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

> **参数'success-text'用来定义成功付款后所显示的文字。**

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

> **参数'on-success'用来定义指定地址收款后运行的回调函数。**

?> 此参数是可选用的。默认值为空白。有效值为任何已定义的函数。

#### *回调* 参数
- **transaction** (`object`):
  - **hash** (`string`) - 传输的哈希值
  - **amount** (`number`) - 被请求的金额是多少
  - **paymentId** (`string`) - 付款的唯一标识符

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

> **参数'on-transaction'用来定义收到任何付款到指定地址后运行回调函数。**

?> 此参数是可选用的。默认值为空白。有效值为任何已定义的函数。

#### *回调* 参数
- **transaction** (`object`):
  - **hash** (`string`) - 传输的哈希值
  - **amount** (`number`) - 被请求的金额是多少
  - **paymentId** (`string`) - 付款的唯一标识符

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

## on-open

> **参数'on-open'指定了在按钮被点击、对话框打开之前运行的回调函数。**

?> 这个参数是可选的。默认值为空。可能的值是任何已定义的函数。

#### *回调* 参数

- amount: number - 请求的金额是多少（以加密货币计)
- to: *string* - 资金将汇入的地方
- paymentId: *string* - 付款的唯一标识符

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

> **参数'on-close'指定了对话框关闭时运行的回调函数。**

?> 这个参数是可选的。默认值为空。可能的值是任何已定义的函数。

#### *回调* 参数

- **success**: *boolean* - 付款状态
- **paymentId**: *string* - 付款标识

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

> **参数'op-return'指定将与交易一起发送的自定义消息。**

?> 此参数是可选的。默认值为空。可能的值为任何最多68字节的字符串。

<!-- tabs:start -->

#### ** HTML **

```html
op-return=""
```

#### ** JavaScript **

```javascript
opReturn: ''
```

#### ** React **

```react
opReturn = ""
```

<!-- tabs:end -->


## random-satoshis

> **参数"random-satoshis"用来定义是否将付款金额的最后几位随机化，因此当一个人进行付款时不太可能触发回调 onSuccess的同时另一个人正打开付款屏幕。**

?> 此参数是可选用的。默认值为false。有效值为true、false或0到4的整数，该整数指定应随机化多少个最后的数字。将其设置为true等同于将其设置为3。将其设置为false等同于将其设置为0。

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

## hide-toasts

> **参数'hide-toasts'指定是否让应用程序完全控制在检测到付款时发生的情况。**

?> 此参数是可选用的。默认值为false。有效值为true或false。

**例子:**
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

<!-- tabs:end -->

## disable-enforce-focus

> **参数'disable-enforce-focus'被传递给 Dialog material UI 组件。设置它为 false 可以帮助提高如屏幕阅读器等技术的可访问性，但可能会在运行 Material UI 的网站上引发错误。**

?> 此参数是可选用的。默认值为true。有效值为true或false。

**例子:**
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

> **参数'disabled'指定是否锁定按钮/小工具以防止其被使用。**

?> 此参数是可选用的。默认值为false。有效值为true或false。

**例子:**
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

## disable-payment-id

> **参数‘disable-payment-id’用于移除支付生成的随机ID，该ID用于防止当一个人和另一个人同时打开支付屏幕时触发onSuccess回调。**

?> 此参数是可选的。默认值为false。可能的值为true或false。

**示例:**
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

## ws-base-url

> **参数'wsBaseUrl'指定了用于 websocket 的 URL，新交易的信息将从这里获取。**

?> 该参数是可选的。默认值是 ‘https://socket.paybutton.org’。可能的值是任何有效的 URL。

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
ws-base-url="https://socket.paybutton.org"
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

> **参数'apiBaseUrl'指定了 API 的 URL，新交易、价格和地址的信息将从这里获取。**

?> 该参数是可选的。默认值是 ‘https://paybutton.org’。可能的值是任何有效的 URL。

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
api-base-url="https://paybutton.org"
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

# 贡献

PayButton是一个社群主导的开放源代码促进会。此项目的成功关键在于对社群的贡献。

## 开发人员快速入门

### 构建

1. `git clone https://github.com/PayButton/paybutton.git`
2. `yarn build`

### 启动Storybook

1. `docker-compose up`
2. 如果网站没有自动打开，它将在localhost:6006上运行。

### 启动Rollup

1. `yarn start:rollup`
2. 网站将在localhost:10001上运行。

### 网站/文件

1. `yarn start:docs`
2. 网站将在localhost:3000上运行。

## 捐助

> 所有收到的PayButton捐助都直接用於资助PayButton的开发。

<div class="paybutton-widget" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp" style="max-width:500px"></div>
