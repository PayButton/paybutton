window.addEventListener('load', function () {
var badgerButtons = document.body.getElementsByClassName("badger-button");
  for (var i = 0; i < badgerButtons.length; i++) {
    var badgerButton = badgerButtons[i];
    var buttonAmount = badgerButton.getAttribute("amount");
    var amountType = badgerButton.getAttribute("amount-type");
  }
});

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


  jQuery(window).on("load", function() {
    getBCHPrice().then(function(res) {




      badgerButton.addEventListener("click", function(event) {
        if (typeof web4bch !== "undefined") {
          web4bch = new Web4Bch(web4bch.currentProvider);

          var txParams = {
            to: badgerButton.getAttribute("data-to"),
            from: web4bch.bch.defaultAccount,
            value: res
          };


          web4bch.bch.sendTransaction(txParams, (err, res) => {
            if (err) return;
            var paywallId = badgerButton.getAttribute("data-paywall-id");
            if (paywallId) {
              var paywall = document.getElementById("paywall");
              paywall.style.display = "block";
            }
            var successCallback = badgerButton.getAttribute("data-success-callback");
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
