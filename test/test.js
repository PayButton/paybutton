$(document).ready(function() {
    var payButtons = document.body.getElementsByClassName("pay-button");
    for (var i = 0; i < payButtons.length; i++) {
        var payButton = payButtons[i]
        var buttonAmount = payButton.getAttribute("amount");
        var amountType = payButton.getAttribute("amount-type");
        var toAddress = payButton.getAttribute("address");
      alert(buttonAmount + ' ' + amountType + ' ' + toAddress);
    }

    function getBCHPrice() {
        return new Promise((resolve, reject) => {
            jQuery.getJSON("https://index-api.bitcoin.com/api/v0/cash/price/" + amountType, function(result) {
                if (result.price != "") {
                    var addDecimal = result.price / 100;
                    var pricePersatoshi = addDecimal / 100000000;
                    var satoshiAmount = buttonAmount / pricePersatoshi;
                    resolve(satoshiAmount);
                } else {
                    reject(new Error(result.error));
                }
            });
        });
    }

    getBCHPrice().then(function(res) {

        payButton.addEventListener("click", function(event) {
            if (typeof web4bch !== "undefined") {
                web4bch = new Web4Bch(web4bch.currentProvider);
                var txParams = {
                    to: toAddress,
                    from: web4bch.bch.defaultAccount,
                    value: res
                };
                web4bch.bch.sendTransaction(txParams, (err, res) => {
                    if (err) return;
                    var paywallId = payButton.getAttribute("data-paywall-id");
                    if (paywallId) {
                        var paywall = document.getElementById("paywall");
                        paywall.style.display = "block";
                    }
                    var successCallback = payButton.getAttribute("data-success-callback");
                    if (successCallback) {
                        window[successCallback](res);
                    }
                });
            } else {
                window.open('https://badgerwallet.cash');
            }
        });

    });

});
