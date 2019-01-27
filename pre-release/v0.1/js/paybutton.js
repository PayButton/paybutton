// Create an immediately invoked functional expression to wrap our code
(function() {

// Define our constructor 
this.Modal = function() {

// Create global element references
this.closeButton = null;
this.modal = null;
this.overlay = null;

// Determine proper prefix
this.transitionEnd = transitionSelect();

// Define option defaults 
var defaults = {
autoOpen: false,
className: 'fade-and-drop',
content: "",
maxWidth: 270,
minWidth: 264,
overlay: true
}

// Create options by extending defaults with the passed in arugments
if (arguments[0] && typeof arguments[0] === "object") {
this.options = extendDefaults(defaults, arguments[0]);
}

if(this.options.autoOpen === true) this.open();
}

// Public Methods

Modal.prototype.close = function() {
stopListenForTX();
var _ = this;
this.modal.className = this.modal.className.replace(" paybutton-open", "");
this.overlay.className = this.overlay.className.replace(" paybutton-open",
"");
this.modal.addEventListener(this.transitionEnd, function() {
_.modal.parentNode.removeChild(_.modal);
});
this.overlay.addEventListener(this.transitionEnd, function() {
if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
});
}

Modal.prototype.open = function() {
buildOut.call(this);
initializeEvents.call(this);
window.getComputedStyle(this.modal).height;
this.modal.className = this.modal.className +
(this.modal.offsetHeight > window.innerHeight ? 
" paybutton-open paybutton-anchored" : " paybutton-open");
this.overlay.className = this.overlay.className + " paybutton-open";
}

// Private Methods

function buildOut() {

var content, contentHolder, docFrag;

/*
 * If content is an HTML string, append the HTML string.
 * If content is a domNode, append its content.
 */

if (typeof this.options.content === "string") {
content = this.options.content;
} else {
content = this.options.content.innerHTML;
}

// Create a DocumentFragment to build with
docFrag = document.createDocumentFragment();

// Create modal element
this.modal = document.createElement("div");
this.modal.className = "paybutton-modal " + this.options.className;
this.modal.style.minWidth = this.options.minWidth + "px";
this.modal.style.maxWidth = this.options.maxWidth + "px";

// If overlay is true, add one
if (this.options.overlay === true) {
this.overlay = document.createElement("div");
this.overlay.className = "paybutton-overlay " + this.options.className;
docFrag.appendChild(this.overlay);
}

// Create content area and append to modal
contentHolder = document.createElement("div");
contentHolder.className = "paybutton-content";
contentHolder.id = "modal-content";
contentHolder.innerHTML = content;
this.modal.appendChild(contentHolder);

// Append modal to DocumentFragment
docFrag.appendChild(this.modal);

// Append DocumentFragment to body
document.body.appendChild(docFrag);
}

function extendDefaults(source, properties) {
var property;
for (property in properties) {
if (properties.hasOwnProperty(property)) {
source[property] = properties[property];
}
}
return source;
}

function initializeEvents() {

if (this.closeButton) {
this.closeButton.addEventListener('click', this.close.bind(this));
}

if (this.overlay) {
this.overlay.addEventListener('click', this.close.bind(this));
}

}

 function transitionSelect() {
var el = document.createElement("div");
if (el.style.WebkitTransition) return "webkitTransitionEnd";
if (el.style.OTransition) return "oTransitionEnd";
return 'transitionend';
}

}());


// copy BCH URI to clipboard
function copyBCHURI(that) {
var inp = document.createElement('input');
inp.value = that
document.body.appendChild(inp)
inp.select();
document.execCommand('copy', false);
inp.remove();
alert("Bitcoin Cash address copied!");
}


var listen;

function startListenForTX (toAddress, bchAmount, successField, successMsg) {
var timeStamp = Math.floor(Date.now() / 1000);
listen = setInterval(function(){ listenForTX(toAddress, bchAmount, successField, successMsg, timeStamp); }, 1500);
}

function stopListenForTX () {
clearInterval(listen);
}


function listenForTX (toAddress, bchAmount, successField, successMsg, timeStamp) {

var txRequest = new XMLHttpRequest();
txRequest.open('GET', 'https://rest.bitcoin.com/v1/address/unconfirmed/' + toAddress, true);

txRequest.onload = function() {
if (txRequest.readyState == 4 && txRequest.status == 200) {

console.log("listening for transaction..");

var txData = JSON.parse(txRequest.responseText);

for (var j in txData) {

var getTransactions = txData[j];

//console.log(timeStamp, getTransactions.ts, getTransactions.amount, getTransactions.txid)

if (timeStamp < getTransactions.ts) {
if (getTransactions.amount == bchAmount) {
console.log("Confirmed. Transaction ID:", getTransactions.txid);
stopListenForTX();

new Audio('https://paybutton.cash/pre-release/v0.1/audio/pbding.mp3').play()

var successFieldExists = document.getElementById(successField);

if (!successMsg) {
successMsg = "Transaction Successful!";
}

if (!successFieldExists) {
var success = document.getElementById("modal-content");
success.innerHTML =

'<div>' +
'<div>' +
'<div>' +
'<div class="amountdiv"><span>'+successMsg+'</span></div>' +
'</div>' +
'<div>' +
'<div class="amountdiv"><span>View: </span><a href="https://explorer.bitcoin.com/bch/tx/'+getTransactions.txid+'" target="_blank" style="color: orangeRed; text-decoration: none;">Transaction</a></div>' +
'</div>' +
'</div>' +
'</div>';

} else {
document.getElementById(successField).innerText = successMsg;
}

return;
} // for if amount is equal
} // for timestamp

} // for j


} else {
console.log("Found Server But There Is An Error");
}
}; // for onload

txRequest.onerror = function() {
console.log("Could Not Connect To Server");
};

txRequest.send();

}
// end listen for transaction


// * begin function detect and send data to badger wallet
function sendToBadger (toAddress, bchAmount, successField, successMsg, successCallback, amountMessage, anyAmount) {

if (!anyAmount) {
bchAmount = bchAmount * 100000000;
} else {
bchAmount = "";
}

if (typeof web4bch !== "undefined") {
web4bch = new Web4Bch(web4bch.currentProvider);

// detect if wallet is locked
if (!web4bch.bch.defaultAccount){
alert("Please unlock Badger Wallet before continuing.");

} else {

var txParams = {
to: toAddress,
from: web4bch.bch.defaultAccount,
value: bchAmount
};

// check for errors else proceed with success messages
web4bch.bch.sendTransaction(txParams, (err, res) => {
if (err) {
console.log("Error", err);
} else {

stopListenForTX();

new Audio('https://paybutton.cash/pre-release/v0.1/audio/pbding.mp3').play()

console.log("Confirmed. Transaction ID:", res);

var successFieldExists = document.getElementById(successField);

if (!successMsg) {
successMsg = "Transaction Successful!";
}

if (!successFieldExists) {
var success = document.getElementById("modal-content");
success.innerHTML =

'<div>' +
'<div>' +
'<div>' +
'<div class="amountdiv"><span>'+successMsg+'</span></div>' +
'</div>' +
'<div>' +
'<div class="amountdiv"><span>View: </span><a href="https://explorer.bitcoin.com/bch/tx/'+res+'" target="_blank" style="color: orangeRed; text-decoration: none;">Transaction</a></div>' +
'</div>' +
'</div>' +
'</div>';

} else {
document.getElementById(successField).innerText = successMsg;
}

if (successCallback) {
window[successCallback](res);
}

}
});
}

} else {

//window.open('https://badger.bitcoin.com')
alert("To use Badger Wallet for this transaction, Please visit:\n\nhttps://badger.bitcoin.com for installation instructions.");
}

}
// * end function detect and send data to badger wallet


function openModal (toAddress, bchAmount, successField, successMsg, successCallback, amountMessage, anyAmount) {

// qr code generation
if (anyAmount) {
amountMessage = "Send any amount of Bitcoin Cash";
qrData = toAddress;
URI = toAddress;
bchAmount = "";
} else {
qrData = toAddress + "?amount=" + bchAmount;
URI = toAddress + "?amount=" + bchAmount;
startListenForTX(toAddress, bchAmount, successField, successMsg);
}
var qrParams = {
ecclevel: "Q",
fillcolor: "#FFFFFF",
textcolor: "#000000",
margin: "0.5",
modulesize: 12
};

if (document.implementation.hasFeature("http://www.w3.org/2000/svg","1.1")) {
genQR = QRCode.generateSVG(qrData, qrParams);
var XMLS = new XMLSerializer();
genQR = XMLS.serializeToString(genQR);
genQR = "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(genQR)));
qrImage = genQR;
	
} else {
genQR = QRCode.generatePNG(qrData, qrParams);
qrImage = genQR;
}

var pbContent =

'<div>' +
'<div>' +
'<div>' +
'<div class="qrparent" onclick=copyBCHURI(\''+URI+'\')>' +
'<img class="qrcode" src="'+qrImage+'"  width="256" />' +
'<img class="qricon" src="https://i.imgur.com/fpxx8mp.png" width="70" />' +
'<div class="qrctc">Click to Copy</div>'+
'</div>' +
'</div>' +
'<div>' +
'<div class="amountdiv"><span>'+amountMessage+'</span></div> ' +
'</div>' +
'<div>' +
'<div><a href="'+URI+'"><button class="pay-button modal"><span>Send with Bitcoin Cash Wallet</span></button></a></div>' +
'</div>' +
'<div>' +
'<div><button class = "pay-button modal" onclick="sendToBadger(\''+toAddress+'\', \''+bchAmount+'\', \''+successField+'\', \''+successMsg+'\', \''+successCallback+'\')"><span>Send with Badger Wallet</span></button></div> ' +
'</div>' +
'</div>' +
'</div>';

var pbModal = new Modal({
content: pbContent
});

pbModal.open();

}


// * begin function query to obtain bch price
function getBCHPrice (buttonAmount, amountType, toAddress, successField, successMsg, successCallback, bchAmount, amountMessage, anyAmount) {

var fiatRequest = new XMLHttpRequest();
fiatRequest.open('GET', 'https://index-api.bitcoin.com/api/v0/cash/price/' + amountType, true);

fiatRequest.onload = function() {
if (fiatRequest.readyState == 4 && fiatRequest.status == 200) {

var fiatData = JSON.parse(fiatRequest.responseText);

if (fiatData.price != "") {

// determine amount of satoshi based on button value
var addDecimal = fiatData.price / 100;
bchAmount = (1 / addDecimal) * buttonAmount;
bchAmount = bchAmount.toFixed(8);

amountMessage = (buttonAmount + " " + amountType + " = " + bchAmount + " BCH");

openModal(toAddress, bchAmount, successField, successMsg, successCallback, amountMessage, anyAmount);

} else {
console.log("Error Price Not Found");
}

} else {
console.log("Found Server But There Is An Error");
}
};

fiatRequest.onerror = function() {
console.log("Could Not Connect To Server");
};

fiatRequest.send();

}
// * end function query to obtain bch price


// insert info into button on mouseover
function mouseOver() {
buttonText2 = this.getAttribute("button-text-2") || ""; buttonText2 = buttonText2.trim();
if (!buttonText2) {
showAmount = this.getAttribute('amount') || ""; showAmount = Number(showAmount.trim());
showType = this.getAttribute('amount-type') || ""; showType = showType.trim().toUpperCase();
buttonText2 = showAmount + " " + showType;
if (!showAmount || !showType) {
buttonText2 = "Click to send BCH";
}
}
this.innerHTML = ("<span>"+buttonText2+"</span>");
if (!('ontouchend' in window))this.addEventListener('mouseout', mouseOut, false);
if ('ontouchend' in window)this.addEventListener('touchend', mouseOut, false);
}


// insert info into button on mouseout
function mouseOut() {
buttonText = this.getAttribute("button-text") || ""; buttonText = buttonText.trim();
if (!buttonText) {
showAmount = this.getAttribute('amount') || ""; showAmount = Number(showAmount.trim());
showType = this.getAttribute('amount-type') || ""; showType = showType.trim().toUpperCase();
buttonText = "Pay with Bitcoin Cash";
if (!showAmount || !showType) {
buttonText = "Pay with Bitcoin Cash";
}
}
this.innerHTML = ("<span>" + buttonText + "</span>");
}


// DOM listen
document.addEventListener("DOMContentLoaded", function(){

// pull in buttons found
var payButton = document.getElementsByClassName("pay-button");

for (var i = 0; i < payButton.length; i++) {

var payButtons = payButton[i];
var buttonText = payButtons.getAttribute("button-text") || ""; buttonText = buttonText.trim();
buttonAmount = payButtons.getAttribute("amount") || ""; buttonAmount = Number(buttonAmount.trim());
amountType = payButtons.getAttribute("amount-type") || ""; amountType = amountType.trim().toUpperCase();

//console.log(buttonText, buttonAmount, amountType);

if (!buttonText){
buttonText = "Pay with Bitcoin Cash";
if (!buttonAmount || !amountType) {
buttonText = "Pay with Bitcoin Cash";
}
}
payButtons.innerHTML = "<span>"+buttonText+"</span>";

if (!('ontouchstart' in window))payButtons.addEventListener('mouseover', mouseOver.bind(payButtons), false);
if ('ontouchstart' in window)payButtons.addEventListener('touchstart', mouseOver.bind(payButtons), false);

// pull in attribute info from button when clicked
payButtons.addEventListener("click", function(pbEvent) {
var buttonAmount = this.getAttribute("amount") || ""; buttonAmount = Number(buttonAmount.trim());
var amountType = this.getAttribute("amount-type") || ""; amountType = amountType.trim().toUpperCase();
var toAddress = this.getAttribute("address") || ""; toAddress = toAddress.trim();
var successField = this.getAttribute("success-field") || ""; successField = successField.trim();
var successMsg = this.getAttribute("success-msg") || ""; successMsg = successMsg.trim();
var successCallback = this.getAttribute("success-callback") || ""; successCallback = successCallback.trim();

var bchAmount; var amountMessage; var anyAmount;

// bch address attribute missing
if (!toAddress) {
alert("PayButton Error:\n\nBelow are the minimum button requirements\n\n1. address (Bitcoin Cash address)");
return;
}

// missing one of two amount attributes, alert
if (buttonAmount || amountType) {
if (!buttonAmount || !amountType) {
alert ("PayButton Error:\n\nFor specific PayButton amounts, BOTH of the following MUST be set:\n\n1. amount (Must be a number)\n2. amount-type (Can be BCH, Satoshi, USD, AUD etc)\n\nTo allow \"Any\" amount, BOTH must be blank.");
return;
}
} else {
anyAmount = true;
}

// check for "any" amount allowed else convert
if (anyAmount) {

openModal(toAddress, bchAmount, successField, successMsg, successCallback, amountMessage, anyAmount);

} else {
// check if amount type is set to bch or fiat
if (amountType == "BCH" || amountType == "SATOSHI") {
bchAmount = buttonAmount;

if (amountType == "SATOSHI") {
bchAmount = bchAmount / 100000000;
}
bchAmount = bchAmount.toFixed(8);

// display bch amount in modal
amountMessage = (bchAmount + " BCH");

// send bch tx data to modal
openModal(toAddress, bchAmount, successField, successMsg, successCallback, amountMessage, anyAmount);

} else {
// send fiat tx data to fiat/bch conversion
getBCHPrice (buttonAmount, amountType, toAddress, successField, successMsg, successCallback, bchAmount, amountMessage, anyAmount);
}
}

});
}

});


var cssButtonId = 'pbButtonCSS';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssButtonId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://paybutton.cash/pre-release/v0.1/css/buttons.css';
    link.media = 'all';
    head.appendChild(link);
}


var cssModalId = 'pbModalCSS';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssModalId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://paybutton.cash/pre-release/v0.1/css/modal.css';
    link.media = 'all';
    head.appendChild(link);
}