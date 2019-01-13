// * begin function detect and send data to badger wallet
function sendToBadger (toAddress, successField, successMsg, successCallback, bchAmount) {

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
if (successField && successMsg) {
var success = document.getElementById(successField);
success.innerText = successMsg;

}

if (successCallback) {
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


// * begin function query to obtain bch price
function getBCHPrice (buttonAmount, amountType, toAddress, successField, successMsg, successCallback, bchAmount) {

var fiatRequest = new XMLHttpRequest();
fiatRequest.open('GET', 'https://index-api.bitcoin.com/api/v0/cash/price/' + amountType, true);

fiatRequest.onload = function() {
if (fiatRequest.readyState == 4 && fiatRequest.status == 200) {

var fiatData = JSON.parse(fiatRequest.responseText);

if (fiatData.price != "")
{

// determine amount of satoshi based on button value
var addDecimal = fiatData.price / 100;
bchAmount = (100000000 / addDecimal) * buttonAmount;

// send bch tx data to badger
sendToBadger(toAddress, successField, successMsg, successCallback, bchAmount);

// format for site dialogue satoshi in 0.00000000 format
var showSatoshi = bchAmount / 100000000;
showSatoshi = showSatoshi.toPrecision(7);

document.getElementById("result").innerHTML = (buttonAmount + " " + amountType + " = " + showSatoshi + " BCH");

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


document.addEventListener("DOMContentLoaded", function(){


// pull in buttons found
var payButton = document.body.getElementsByClassName("pay-button");
for (var i = 0; i < payButton.length; i++)
{
var payButtons = payButton[i];

// pull in attribute info from button when clicked
payButtons.addEventListener("click", function(event)
{
var buttonAmount = this.getAttribute("amount");
var amountType = this.getAttribute("amount-type");
var toAddress = this.getAttribute("address");
var successField = this.getAttribute("success-field");
var successMsg = this.getAttribute("success-msg");
var successCallback = this.getAttribute("data-success-callback");
var bchAmount;

// check if amount type is set to bch or fiat
if (amountType == "BCH" || amountType == "Satoshi") {

if (amountType == "BCH") {
bchAmount = 100000000 * buttonAmount;
}

else if (amountType == "Satoshi") {
bchAmount = buttonAmount;
document.getElementById("result").innerHTML = (buttonAmount + " " + amountType + " = " + bchAmount/100000000 + " BCH");
}

// send bch tx data to badger
sendToBadger(toAddress, successField, successMsg, successCallback, bchAmount);

} else {

// send fiat tx data to fiat/bch conversion
getBCHPrice (buttonAmount, amountType, toAddress, successField, successMsg, successCallback, bchAmount);

}

});
}

});

var cssId = 'pbCSS';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://paybutton.cash/donate/donate.css';
    link.media = 'all';
    head.appendChild(link);
}
