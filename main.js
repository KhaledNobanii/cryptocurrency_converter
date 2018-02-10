var MAX_XHR_WAITING_TIME = 5000;// in ms

var sendAjax = function (params) {
  var xhr = new XMLHttpRequest(),
    url = params.cache ? params.url + '?' + new Date().getTime() : params.url,
    timer = setTimeout(function () {// if xhr won't finish after timeout-> trigger fail
      xhr.abort();
      params.error && params.error();
      params.complete && params.complete();
    }, MAX_XHR_WAITING_TIME);
  xhr.open(params.type, url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      clearTimeout(timer);
      if (xhr.status === 200 || xhr.status === 0) {
        params.success && params.success(xhr.responseText);
        params.complete && params.complete();
      } else {
        params.error && params.error(xhr.responseText);
        params.complete && params.complete();
      }
    }
  };
  params.beforeSend && params.beforeSend(xhr);
  xhr.send();
};

var getJSON = function (params) {
  sendAjax({
    type: 'get',
    url: params.url,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Accept', 'application/json, text/javascript');
    },
    success: function (res) {
      params.success && params.success(JSON.parse(res));
    },
    error: params.error,
    complete: params.complete,
    cache: true
  });
};


var currencyConv = {};

currencyConv.configure = function currencyConvConfigure(opt) {

}

currencyConv.init = function currencyConvInit(currentCurrency, targetedCurrency, currenciesURL = "http://www.getsaascoin.com/api/v1/currencies") {
  currencyConv.currentCurrency = currentCurrency;
  currencyConv.targetedCurrency = targetedCurrency;
  getJSON({
    url: currenciesURL,
    success: function(resp) {
      currencyConv.currenciesJSON = resp;
    },
  });
};

currencyConv._ = function convertCurrency(amount, from = null, to = null) {
  if (from == null) { from = currencyConv.currentCurrency}
  if (to == null) { to = currencyConv.targetedCurrency}
  return (amount * currencyConv.currenciesJSON[from]) / currencyConv.currenciesJSON[to];
};
