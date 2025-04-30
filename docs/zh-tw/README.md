# 什麼是PayButton?

> PayButton可以通過在您的網站上添加捐款或購買的按鈕，來接收eCash。<br />首先PayButton需要您先設置一個eCash錢包，這樣才能開始進行收款。如果您還沒有錢包，[目前有很多方案供您選擇](https://e.cash/wallets)。

<div class="paybutton" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp" theme='{ "palette": { "primary": "#42b983", "secondary": "#ffffff", "tertiary": "#333333"} }'></div>

>

# 基礎用法

只需將以下內容添加到您網站的HTML中，用您的eCash錢包中的地址替換YOUR_ADDRESS_HERE:

<div class="paybutton" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>
<div class="paybutton" to="YOUR_ADDRESS"></div>
```

# 進階用法

使用JavaScript生成PayButton的示例:

<div id="advanced-usage-example"></div>

```html
<script src="https://unpkg.com/@paybutton/paybutton/dist/paybutton.js"></script>

<div id="my_button"></div>

<script>
  function mySuccessFunction(transaction) {
    const transactionAttrs = { 
      hash, 
      amount, 
      paymentId, 
      confirmed, 
      message, 
      timestamp, 
      address, 
      rawMessage, 
      inputAddresses 
    } = transaction;

    console.log(transactionAttrs);
  }

  function myTransactionFunction(transaction) {
    const transactionAttrs = { 
      hash, 
      amount, 
      paymentId, 
      confirmed, 
      message, 
      timestamp, 
      address, 
      rawMessage, 
      inputAddresses 
    } = transaction;

    console.log(transactionAttrs);
    console.log( 'Received: ' + transactionAttrs.amount );
  }

  function myCloseFunction(success, paymentId) {
    console.log('Closed!')
    console.log('Payment successful?: ' + success)
    console.log('Payment ID: ' + paymentId)
  }

  function myOpenFunction(amount, to, paymentId) {
    console.log('Opened to: ' + to + ' for ' + amount + ' XEC')
    console.log('Payment ID: ' + paymentId)
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
    randomSatoshis: true,
    opReturn:"ABC",
    disablePaymentId: true,
    disabled: false,
    wsBaseUrl: 'http://localhost:5000',
    apiBaseUrl: 'http://localhost:3000'
    disableAltpayment: true,
    contributionOffset: 10
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

您還可以創建一個可視性的PayButton插件，不需要點擊按鈕即可打開:

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

# 參數

使用以下選項來自定義您的PayButton:

## to

> **參數"to"用來定義匯款去向。**

!> 此參數是必需使用的。可用值是一切有效的eCash地址。

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

?> 此參數是可選用的。替代貨幣為"XEC"。可用幣種如下：XEC、BCH、美元、加幣。

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

?> 此參數是可選用的。默認文字為"Donate"。可用內容為任何文字符號。它对小部件没有任何影响。

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

?> 此參數是可選用的。默認文字為"Click to send XEC"。可用內容為任何文字符號。

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

> **參數'goal-amount'指定了需要多少捐款/貢獻才能認為資金籌集已完成，由一個進度條指示。**

?> 此參數是可選的。預設值為0（無）。可能的值是任何數字。

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

> **參數'editable'指定是否提供一個輸入框，以供用戶能夠改變付款金額。**

?> 此參數是可選用的。默認值為false。有效值為true或false。

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

## transaction-text

> **"transaction-text"  參數指定當發生新交易但金額或 OP_RETURN 代碼不正確時顯示的文字。**

?> 此參數為選填，預設值為空。可用值為任何字串。

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
transaction-text="New transaction!"
```

#### ** JavaScript **

```javascript
transactionText: 'New transaction!'
```

#### ** React **

```react
transactionText = "New transaction!"
```

<!-- tabs:end -->


## on-success

> **參數"on-success"用來定義指定地址收款後運行的回呼函式。**

?> 此參數是可選用的。默認值為空白。有效值為任何已定義的函式。

#### *回撥* 參數
- **transaction** (`object`): 
  - **hash** (`string`) - 傳輸的雜湊值
  - **amount**: (`number`) - 被請求的金額是多少
  - **paymentId** (`string`) - 资金将汇入的地方

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

#### *回撥* 參數
- **transaction** (`object`):
  - **hash** (`string`) - 傳輸的雜湊值
  - **amount**: (`number`) - 被請求的金額是多少
  - **paymentId** (`string`) - 资金将汇入的地方
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

> **參數"on-open"指定了在按鈕被點擊、對話框打開之前運行的回呼函數。**

?> 這個參數是可選的。默認值為空。可能的值是任何已定義的函數。

#### *回撥* 參數

- amount: number - 請求的金額是多少（以加密貨幣計)
- **to**: *string* - 付款的唯一标识符
- **paymentId**: *string* - 资金将汇入的地方

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

> **參數"on-close"指定了對話框關閉時運行的回呼函數。**

?> 這個參數是可選的。默認值為空。可能的值是任何已定義的函數。

#### *回撥* 參數

- **success**: *boolean* - 付款狀態
- **paymentId**: *string* - 付款標識

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

> **‘op-return’參數指定將與交易一起發送的自定義消息。**

?> 此參數是可選的。默認值為空。可能的值為任何最多68字節的字符串。

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

> **參數'random-satoshis'用來定義是否將付款金額的最後幾位隨機化，因此當一個人進行付款時不太可能觸發回呼onSuccess的同時另一個人正打開付款螢幕。**

?> 此參數是可選用的。默認值為false。有效值為true、false或0到4的整數，該整數指定應隨機化多少個最後的數字。將其設置為true等同於將其設置為3。將其設置為false等同於將其設置為0。

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

## hide-toasts

> **參數'hide-toasts'指定是否讓應用程式完全控制在檢測到付款時發生的情況。**

?> 此參數是可選用的。默認值為false。有效值為true或false。

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

## disable-enforce-focus

> **參數'disable-enforce-focus'被傳遞給 Dialog material UI 組件。將其設定為 false 可以幫助提高如螢幕閱讀器等技術的可訪問性，但可能會在運行 Material UI 的網站上引發錯誤。**

?> 此參數是可選用的。默認值為true。有效值為true或false。

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

> **參數'disabled'指定是否鎖定按鈕/小工具以防止其被使用。**

?> 此參數是可選用的。默認值為false。有效值為true或false。

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

> **參數‘disable-payment-id’用於移除支付生成的隨機ID，該ID用於防止當一個人和另一個人同時打開支付屏幕時觸發onSuccess回調。**

?> 此參數是可選的。默認值為false。可能的值為true或false。

**範例:**
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

> **參數'wsBaseUrl'指定了用於 websocket 的 URL，新交易的資訊將從這裡獲取。**

?> 該參數是可選的。預設值是‘https://socket.paybutton.org’。可能的值是任何有效的 URL。

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

> **參數'apiBaseUrl'指定了 API 的 URL，新交易、價格和地址的資訊將從這裡獲取。**

?> 該參數是可選的。預設值是‘https://paybutton.org’。可能的值是任何有效的 URL。

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

## disable-altpayment

> **“disableAltpayment” 參數用於禁用備用支付邏輯。**

?> 該參數為可選項，預設值為 false。可選值為 true 或 false。

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
disable-altpayment="true"
```

#### ** JavaScript **

```javascript
disableAltpayment: 'true'
```

#### ** React **

```react
disableAltpayment = "true"
```
<!-- tabs:end -->

## contribution-offset

> **"contributionOffset" 參數用於調整顯示的總貢獻額，可用於模擬先前的貢獻或減少總額。**

?> 此參數為可選（預設值：0）。接受正數或負數整數，且總貢獻額上限為 goalAmount。

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
contribution-offset="10"
```

#### ** JavaScript **

```javascript
contribution-offset: 10
```

#### ** React **

```react
contributionOffset = 10
```
<!-- tabs:end -->

## auto-close

> **‘autoClose’ 收到付款後，參數會自動關閉付款對話框.**

?> 此參數是可選的。預設值為 true。可能的值是真或假。
**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
auto-close="false"
```

#### ** JavaScript **

```javascript
autoClose: false
```

#### ** React **

```react
autoClose = false
```
<!-- tabs:end -->
## size

> **「size」參數用於調整按鈕的大小。**

?> size 參數為選填，支援以下預設的字串值：'xs'（特小）、'sm'（小）、'md'（中）、'lg'（大）以及 'xl'（特大）。若未指定，預設值為 'md'。你也可以使用別名 'extrasmall'、'small'、'medium'、'large' 和 'extralarge'，這些別名會分別對應到 'xs'、'sm'、'md'、'lg' 和 'xl'。



**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
size="sm"
```

#### ** JavaScript **

```javascript
size: "sm"
```

#### ** React **

```react
size = "sm"
```
<!-- tabs:end -->


## disable-sound

> **「disableSound」參數會在交易成功時靜音原本播放的聲音。**

?>此參數為選填。預設值為 false。可接受的值為 true 或 false。

**Example:**
<!-- tabs:start -->

#### ** HTML **

```html
disable-sound="false"
```

#### ** JavaScript **

```javascript
disableSound: false
```

#### ** React **

```react
disableSound = false
```
<!-- tabs:end -->

# 貢獻

PayButton是一個社區主導的開放源代碼促進會。此項目的成功關鍵在於對社區的貢獻。

## 開發人員快速入門

### 入門

1.克隆倉庫

```
git clone https://github.com/PayButton/paybutton.git

```
2. 導航至項目文件夾並構建項目

```
yarn build

```
3. 你現在可以將在 `paybutton/dist/paybutton.js` 找到的 bundle 集成到你的本地網站中。

### 設置開發環境


1. 啟動開發服務器

```
yarn dev
```

2. 在此查看網站 `localhost:10001`

3. 你可以在 `paybutton/dev/demo/index.html` 中修改示範頁面


4. 示範頁面的更改應該會自動反映在服務器上

### 用 Storybook 測試 UI 組件

1. 運行 docker 容器以啟動 storybook

```
docker-compose up

```

2. 等待 `storybook` 初始化
3. 打開 `http://localhost:6006` 你應該能夠在 storybook 中測試組件

### 啟動文檔網站

1. 啟動文檔網站本地伺服器
```
  yarn start:docs
```
2. 網站將在 `localhost:3001` 上可用
3. 你可以通過修改文件 `docs/README.md` 來更新文檔



## OpReturn

`op-return` 屬性用於以結構化字串的形式傳遞附加的元資料。這個內容可以在回呼函式（`onSuccess` 和 `onTransaction`）返回的訊息中作為參數看到。此字串可以是：

- 一般字串，例如簡單的訊息或片語。
- 字串化的 JSON。
- 使用 `|`分隔的值陣列
- 鍵值格式的字串，鍵與值之間用 = 分隔，同一鍵的多個值用 `|` 分隔。

### 範例：

#### 一般字串
```html
op-return="hello world"
```
- 一個普通字串，沒有解析行為。

#### 鍵值格式字串
```html
op-return="classOf=2013 bullYears=2013|2017|2021"
```
- 此格式會被解析成一個物件：
```json
{
  "classOf": 2013,
  "bullYears": [2013, 2017, 2021]
}
```

#### JSON 字串

```html
op-return="{'foo': 'bar'}"
```
- 此格式會被解析成一個物件：
```json
{
  "foo": "bar"
}
```

#### 使用管線符分隔的值
```html
op-return="item1|item2|item3"
```
- 此格式會被解析成一個陣列：
```json
["item1", "item2", "item3"]
```


## 捐款

> 所有收到的PayButton捐款都直接用於資助PayButton的開發。

<div class="paybutton-widget" to="ecash:qrmm7ed0px8tydrlhgvu3putwpwzlfyr0uzfc0slxp" style="max-width:500px"></div>
