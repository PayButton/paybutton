$(document).ready(function() {

    function getBCHPrice(btn) {
        var buttonAmount = btn.getAttribute('amount')
        var amountType = btn.getAttribute("amount-type")
        var toAddress = btn.getAttribute("address")
        jQuery("#result").html("Converting " + amountType + " to satoshi")




        jQuery.getJSON("https://index-api.bitcoin.com/api/v0/cash/price/" + amountType, function(response) {

            if (response.price != "") {
                var addDecimal = response.price / 100
                var pricePersatoshi = addDecimal / 100000000
                var satoshiAmount = buttonAmount / pricePersatoshi

                jQuery("#result").html("Sending: " + satoshiAmount + " satoshi")


                if (typeof web4bch !== "undefined") {
                    web4bch = new Web4Bch(web4bch.currentProvider);
                    var txParams = {
                        to: toAddress,
                        from: web4bch.bch.defaultAccount,
                        value: satoshiAmount
                    };
                    web4bch.bch.sendTransaction(txParams, (err, res) => {
                        if (err) return;
                        var paywallId = btn.getAttribute("data-paywall-id");
                        if (paywallId) {
                            var paywall = document.getElementById("paywall");
                            paywall.style.display = "block";
                        }
                        var successCallback = btn.getAttribute("data-success-callback");
                        if (successCallback) {
                            window[successCallback](res);
                        }
                    });
                } else {
                
                    alert('Please install Badger Wallet from https://badgerwallet.cash to test');
                }



            } else {
                reject(new Error(response.error))
            }


        })




    }

    window.getBCHPrice = getBCHPrice


})
