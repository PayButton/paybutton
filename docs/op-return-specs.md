## OpReturn

OP_RETURN is a [script opcode](https://wiki.bitcoinsv.io/index.php/OP_RETURN) that allows adding extra information to transactions beyond standard inputs and outputs. This can be useful for applications that want to include:

* Different transaction categories related e.g. to gameplay events;

* Invoice numbers;

* Nonces to differentiate payments of the same amount;

* Other data.

### General OpReturn structure

Hex-encoded bytes representing:

    <OP_RETURN opcode><pushdata for protocol identifier><protocol identifier><version><pushdata for data payload><data payload><pushdata for nonce><nonce>

### General Syntax Rules:

The data is composed by the following hex-encoded components:

1. **OP_RETURN opcode**: `6a`.

2. Pushdata indicating the size (in bytes) of the protocol identifier. Always 4 (`04` in hex) in the case of the PayButton protocol.

3. **Protocol identifier**: `50415900` for PayButton (ASCII `PAY` + `0x00`).

4. **Version**: A byte allowing future updates (currently `00`).

5. Pushdata indicating the size (in bytes) of data payload identifier.

6.  **Data Payload**: Custom information in UTF-8 format. The maximum size is 213 bytes (UTF-8 encoded) if there is no **payment ID** (nonce). If a **payment ID** is present, the limit is 205 bytes, as the **payment ID** occupies 8 bytes. Can be empty.

7. Pushdata indicating the size (in bytes) of nonce identifier.

8.  **Nonce**: Eight random bytes to differentiate payments (can be empty).

If the **data payload** or **nonce** is empty, the pushdata for each will be `00`.


  
### How to send data using the OP_RETURN opcode in PayButton

To send data using the OP_RETURN opcode in PayButton, you can use the `op-return` prop. The content of the `op-return` prop will be encoded and will correspond to the **data payload**, mentioned above. Additionally, you may use the **payment ID** as a nonce. To disable sending the **payment ID**, use the `disable-payment-id` prop — PayButton will automatically encode the message according to the rules specified bellow.


### PayButton OpReturn encoding examples:


#### 1. OpReturn message with 12 bytes of data and no nonce
  

    6a0450415900000c0102030405060708090a0b0c00

  

Breaking this down:

  

-  `6a` → OP_RETURN opcode

-  `04` → Pushdata indicating the size of the protocol identifier

-  `50415900` → PayButton identifier (ASCII `PAY` + `0x00`)

-  `00` → Version 0

-  `0c` → Pushdata indicating the size of data payload identifier

-  `0102030405060708090a0b0c` → Data payload

-  `00` → Pushdata for payment ID (nonce), indicating there will be none

  

#### 2. OpReturn message with 12 bytes of data and an 8-byte nonce

    6a0450415900000c0102030405060708090a0b0c080102030405060708



-  `6a` → OP_RETURN opcode

-  `04` → Pushdata indicating the size of the protocol identifier

-  `50415900` → PayButton identifier (ASCII `PAY` + `0x00`)

-  `00` → Version 0

-  `0c` → Pushdata indicating the size of data payload identifier

-  `0102030405060708090a0b0c` → Data payload

-  `08` → Pushdata indicating that this transaction has an 8-byte payment ID

-  `0102030405060708` → Payment ID

  

#### 3. OpReturn message with no data but an 8-byte payment ID (nonce)

    6a04504159000000080102030405060708
  

-  `6a` → OP_RETURN opcode

-  `04` → Pushdata indicating the size of the protocol identifier

-  `50415900` → PayButton identifier (ASCII `PAY` + `0x00`)

-  `00` → Version 0

-  `00` → No data payload

-  `08` → Pushdata indicating that this transaction has an 8-byte payment ID

-  `0102030405060708` → Payment ID

#### 4. Transaction with no data and no payment ID

    6a0450415900000000

-  `6a` → OP_RETURN opcode

-  `04` → Pushdata indicating the size of the protocol identifier

-  `50415900` → PayButton identifier (ASCII `PAY` + `0x00`)

-  `00` → Version 0

-  `00` → Pushdata for data payload, indicating there will be none

-  `00` → Pushdata for payment ID, indicating there will be none

 