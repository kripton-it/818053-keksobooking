'use strict';

(function () {

  var priceLimits = {
    low: 10000,
    high: 50000
  };

  var filtersFormElement = document.querySelector('.map__filters');

  function getRank(pin) {
    var rank = 0;
    var type = filtersFormElement.querySelector('#housing-type').value;
    var price = filtersFormElement.querySelector('#housing-price').value;
    var rooms = filtersFormElement.querySelector('#housing-rooms').value;
    var guests = filtersFormElement.querySelector('#housing-guests').value;
    var features = filtersFormElement.querySelectorAll('.map__checkbox');

    if (pin.offer.type === type || type === 'any') {
      rank++;
    }

    switch (price) {
      case 'any':
        rank++;
        break;
      case 'low':
        if (pin.offer.price < priceLimits.low) {
          rank++;
        }
        break;
      case 'middle':
        if (pin.offer.price >= priceLimits.low && pin.offer.price <= priceLimits.high) {
          rank++;
        }
        break;
      case 'high':
        if (pin.offer.price > priceLimits.high) {
          rank++;
        }
        break;
    }

    if (pin.offer.rooms === +rooms || rooms === 'any') {
      rank++;
    }

    if (pin.offer.guests === +guests || guests === 'any') {
      rank++;
    }

    for (var i = 0; i < features.length; i++) {
      if (features[i].checked === (pin.offer.features.indexOf(features[i].value) > -1)) {
        rank++;
      }
    }

    return rank;
  }

  window.filter = function (array) {
    return array.sort(function (left, right) {
      var rankDiff = getRank(right) - getRank(left);
      // Если ранги равны - сортировка по адресу аватара ("img/avatars/user03.png")
      if (rankDiff === 0) {
        rankDiff = right.author.avatar - left.author.avatar;
      }
      return rankDiff;
    }).filter(function (item) {
      return getRank(item) >= 5;
    });
  };
})();
