## OpReturn

OP_RETURN 是一[script opcode](https://wiki.bitcoinsv.io/index.php/OP_RETURN)，允许在交易中添加额外信息，超出标准的输入和输出范围。这对于希望包含以下内容的应用程序来说可能很有用：

与事件相关的不同交易类型（例如，游戏）；

发票号码；

用于区分相同金额支付的随机数（Nonce）；

其他数据。
### 一般 OpReturn 结构

    <OP_RETURN 操作码><协议标识符的 pushdata><协议标识符><版本><数据负载的 pushdata><数据负载><随机数的 pushdata><随机数>

### 通用语法规则:

数据由以下十六进制编码的组件组成：


1. **OP_RETURN opcode**: `6a`.

2.Pushdata 指示协议标识符的大小（以字节为单位）。在 PayButton 协议的情况下，始终为 4（十六进制为 `04`）。

3. **协议标识符**: `50415900` 对于 PayButton (ASCII `PAY` + `0x00`).

4. **版本**: 一个字节，允许未来更新（当前为 `00`）。

5. Pushdata 指示数据有效负载标识符的大小（以字节为单位）。

6.  **数据有效负载**: 自定义信息采用 UTF-8 编码格式。若无 payment ID（nonce），最大大小为 213 字节（UTF-8 编码）。若包含 payment ID，则限制为 205 字节，因为 payment ID 占用 8 字节。（可为空）。

7. Pushdata 指示 nonce 标识符的大小（以字节为单位）。

8.  **随机数**: 八个随机字节用于区分支付（可以为空）。

如果 **数据有效负载** 或 **随机数** 为空，则每个对应的 pushdata 将为 `00`。

  
### 如何在 PayButton 中使用 OP_RETURN 操作码发送数据

要在 PayButton 中使用 OP_RETURN 操作码发送数据，您可以使用 `op-return` 属性。op-return 属性的内容将被编码，并对应于上述提到的 **数据有效负载**。 此外，您可以将 **支付 ID** 用作随机数（nonce）。要禁用发送 **支付 ID**，请使用 `disable-payment-id` 属性 — PayButton 将根据下面指定的规则自动编码消息。


### PayButton OP_RETURN 编码示例：

#### 1. 没有随机数且数据为 12 字节的 OP_RETURN 消息：
  

    6a0450415900000c0102030405060708090a0b0c00


-  `6a` → OP_RETURN opcode

-  `04` → Pushdata 指示协议标识符的大小

-  `50415900` → 协议标识符 (ASCII `PAY` + `0x00`)

-  `00` → 版本 0

-  `0c` → Pushdata 指示数据有效负载标识符的大小

-  `0102030405060708090a0b0c` → 数据有效负载

-  `00` → **支付 ID**（随机数）的 Pushdata，表示将没有随机数

  

#### 2. 具有 12 字节数据和 8 字节随机数（nonce）的 OP_RETURN 消息

    6a0450415900000c0102030405060708090a0b0c080102030405060708



-  `6a` → OP_RETURN opcode

-  `04` → Pushdata 指示协议标识符的大小

-  `50415900` → 协议标识符 (ASCII `PAY` + `0x00`)

-  `00` → 版本 0

-  `0c` → Pushdata 指示数据有效负载标识符的大小

-  `0102030405060708090a0b0c` → 数据有效负载

-  `08` → Pushdata 指示此交易具有 8 字节的 payment ID

-  `0102030405060708` → 支付 ID

  

#### 3. 没有数据但有 8 字节支付 ID（随机数）的 OP_RETURN 消息

    6a04504159000000080102030405060708
  

-  `6a` → OP_RETURN opcode

-  `04` → Pushdata 指示协议标识符的大小

-  `50415900` → 协议标识符 (ASCII `PAY` + `0x00`)

-  `00` → 版本 0

-  `00` → 没有数据有效负载

-  `08` → Pushdata 指示此交易具有 8 字节的 payment ID。

-  `0102030405060708` → 支付 ID

#### 4. 没有数据和没有支付 ID 的交易

    6a0450415900000000

-  `6a` → OP_RETURN opcode

-  `04` → Pushdata 指示协议标识符的大小

-  `50415900` → 协议标识符 (ASCII `PAY` + `0x00`)

-  `00` → 版本 0

-  `00` → Pushdata for data payload, indicating there will be none

-  `00` → 支付 ID 的 Pushdata，表示将没有支付 ID

  
