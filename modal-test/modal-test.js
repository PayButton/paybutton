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
maxWidth: 260,
minWidth: 262,
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

var content, contentHolder, docFrag, resultHolder;

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
contentHolder.id = "paybutton-test";
contentHolder.innerHTML = content;
this.modal.appendChild(contentHolder);

//resultHolder = document.createElement("div");
//resultHolder.className = "paybutton-content";
//resultHolder.innerHTML = this.options.amountMessage;
//this.modal.appendChild(resultHolder);
 

//// Create content area and append to modal
//resultHolder = document.createElement("div");
//resultHolder.className = "paybutton-content";
//resultHolder.id = "result";
//resultHolder.innerHTML = this.options.amountMessage;
//this.modal.appendChild(resultHolder);


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











// * begin function detect and send data to badger wallet
function sendToBadger (toAddress, bchAmount, successField, successMsg, successCallback, amountMessage) {

bchAmount = bchAmount * 100000000;

if (typeof web4bch !== "undefined") {
web4bch = new Web4Bch(web4bch.currentProvider);

// detect if wallet is locked
if (!web4bch.bch.defaultAccount){
alert("Please unlock BadgerWallet before continuing.");

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
console.log("Confirmed. Transaction ID:", res);


// find success element, display tx success
//if (successField && successMsg) {
//var success = document.getElementById(successField);
//success.innerText = successMsg;

var successFieldExists = document.getElementById(successField);

if (!successMsg) {
successMsg = "Transaction Successful!";
}


if (!successFieldExists) {
var success = document.getElementById("paybutton-test");
success.innerHTML =

' <div> ' +
' <div> ' +
' <div> ' +
' <div class="amountdiv"><span>'+successMsg+'</span></div> ' +
' </div> ' +
' <div> ' +
' <div class="amountdiv"><span>View: </span><a href="https://explorer.bitcoin.com/bch/tx/'+res+'" target="_blank" style="color: orangeRed; text-decoration: none;">Transaction</a></div>' +
' </div> ' +
' </div> ' +
' </div> ';

} else {
document.getElementById(successField).innerText = successMsg;
}


//}

if (successCallback) {
//alert("hi");
window[successCallback](res);
}

}
});
}

} else {

// notify user of wallet
//window.open('https://badgerwallet.cash')
alert("Please install BadgerWallet from https://badger.bitcoin.com to donate.\n\nOur devs are working hard to support more BitcoinCash wallets in the very near future.");
}

}
// * end function detect and send data to badger wallet


function openModal (toAddress, bchAmount, successField, successMsg, successCallback, amountMessage) {

// qr code generation
var qrData = toAddress + "?amount=" + bchAmount;
var qrParams = {
ecclevel: "M",
fillcolor: "#FFFFFF",
textcolor: "#000000",
margin: " ",
modulesize: 8
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

' <div> ' +
' <div> ' +
//' <div> ' +
//' <div><img src="'+qrdecoded+'" height="250" width="250"></div>' +
//' </div> ' +
' <div> ' +
' <div class="qrdiv"><img src="'+qrImage+'" height="260" width="260"></div>' +
' </div> ' +
' <div> ' +
' <div class="amountdiv"><span>'+amountMessage+'</span></div> ' +
' </div> ' +
' <div> ' +
' <div><a href="'+toAddress+'?amount='+bchAmount+'"><button class="pbmodal-button"><span>Send with BitcoinCash Wallet</span></button></a></div>' +
' </div> ' +
' <div> ' +
' <div><button class = "pbmodal-button" onclick="sendToBadger(\''+toAddress+'\', \''+bchAmount+'\', \''+successField+'\', \''+successMsg+'\', \''+successCallback+'\')"><span>Send with Badger Wallet</span></button></div> '+
' </div> ' +
' </div> ' +
' </div> ';


var pbModal = new Modal({
content: pbContent,
amountMessage: ""
});

pbModal.open();

}


// * begin function query to obtain bch price
function getBCHPrice (buttonAmount, amountType, toAddress, successField, successMsg, successCallback, bchAmount, amountMessage) {

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

openModal(toAddress, bchAmount, successField, successMsg, successCallback, amountMessage);


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


// insert info into button on hover
function mouseover() {
buttonText = this.getAttribute("button-text-2");
if (!buttonText){
showAmount = this.getAttribute('amount');
showType = this.getAttribute('amount-type');
buttonText = showAmount + " " + showType;
if (isNaN(showAmount) || !showType) {
buttonText = "Needs Setup!";
}
}
this.innerHTML = ("<span>"+buttonText+"</span>");
this.addEventListener("mouseout", mouseout);
}


// insert info into button on mouseout
function mouseout() {
buttonText = this.getAttribute("button-text");
if (!buttonText){
showAmount = this.getAttribute('amount');
showType = this.getAttribute('amount-type');
buttonText = "Tip Button";
if (isNaN(showAmount) || !showType) {
buttonText = "PayButton";
}
}
this.innerHTML = ("<span>" + buttonText + "</span>");
this.removeEventListener("mouseout", mouseout);
}


document.addEventListener("DOMContentLoaded", function(){

// pull in buttons found
var payButton = document.getElementsByClassName("pay-button");

for (var i = 0; i < payButton.length; i++) {

var payButtons = payButton[i];
var buttonText = payButtons.getAttribute("button-text");

if (!buttonText){
buttonText = "Tip Button";
if (isNaN(payButtons.getAttribute("amount")) || !payButtons.getAttribute("amount-type")) {
buttonText = "PayButton";
}
}

payButtons.innerHTML = "<span>"+buttonText+"</span>";
payButtons.addEventListener("mouseover", mouseover);


// pull in attribute info from button when clicked
payButtons.addEventListener("click", function(pbEvent) {

var buttonAmount = Number(this.getAttribute("amount"));
var amountType = this.getAttribute("amount-type").toUpperCase();
var toAddress = this.getAttribute("address");
var successField = this.getAttribute("success-field");
var successMsg = this.getAttribute("success-msg");
var successCallback = this.getAttribute("success-callback");
var bchAmount;
var amountMessage;

if ( buttonAmount == "" || amountType == "" || toAddress == "" || isNaN(buttonAmount)) {
alert("PayButton Setup Error:\n\nBelow are the minimum button requirements\n\n1. amount (Must be a number)\n2. amount-type (Can be BCH, Satoshi, USD, AUD etc)\n3. address (Bitcoin Cash address)");
return;
}


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
openModal(toAddress, bchAmount, successField, successMsg, successCallback, amountMessage);

} else {
// send fiat tx data to fiat/bch conversion
getBCHPrice (buttonAmount, amountType, toAddress, successField, successMsg, successCallback, bchAmount, amountMessage);
}

});
}

//DOM listen
});

var cssId = 'pbCSS';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://paybutton.cash/modal-test/modal-test.css';
    link.media = 'all';
    head.appendChild(link);
}
