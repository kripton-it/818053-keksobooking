'use strict';

(function () {

  var filterChangeHandler = null;
  var filtersFormElement = document.querySelector('.map__filters');
  var typeSelectElement = filtersFormElement.querySelector('#housing-type');
  var priceSelectElement = filtersFormElement.querySelector('#housing-price');
  var roomsSelectElement = filtersFormElement.querySelector('#housing-rooms');
  var guestsSelectElement = filtersFormElement.querySelector('#housing-guests');
  var featuresFieldsetElement = filtersFormElement.querySelector('#housing-features');

  var priceLimits = {
    low: 10000,
    high: 50000
  };

  window.form.toggleInputState(filtersFormElement);

  function listenFiltersForm() {
    typeSelectElement.addEventListener('change', filterChangeHandler);
    priceSelectElement.addEventListener('change', filterChangeHandler);
    roomsSelectElement.addEventListener('change', filterChangeHandler);
    guestsSelectElement.addEventListener('change', filterChangeHandler);
    featuresFieldsetElement.addEventListener('change', filterChangeHandler);
  }

  function setfilterChangeHandler(callback) {
    filterChangeHandler = callback;
  }

  function resetFiltersForm() {
    filtersFormElement.reset();
  }

  function toggleFiltersFormState() {
    window.form.toggleState(filtersFormElement);
  }

  function filterArray(array) {
    var checkedFeaturesCollection = featuresFieldsetElement.querySelectorAll('.map__checkbox:checked');
    var filteredArray = array.filter(function (item) {
      return item.offer.type === typeSelectElement.value || typeSelectElement.value === 'any';
    }).filter(function (item) {
      var isPriceSuited;
      switch (priceSelectElement.value) {
        case 'any':
          isPriceSuited = true;
          break;
        case 'low':
          isPriceSuited = item.offer.price < priceLimits.low;
          break;
        case 'middle':
          isPriceSuited = item.offer.price >= priceLimits.low && item.offer.price <= priceLimits.high;
          break;
        case 'high':
          isPriceSuited = item.offer.price > priceLimits.high;
          break;
      }
      return isPriceSuited;
    }).filter(function (item) {
      return item.offer.rooms === +roomsSelectElement.value || roomsSelectElement.value === 'any';
    }).filter(function (item) {
      return item.offer.guests === +guestsSelectElement.value || guestsSelectElement.value === 'any';
    }).filter(function (item) {
      var store = {};
      var checkedFeatures = [];
      for (var i = 0; i < item.offer.features.length; i++) {
        var key = item.offer.features[i];
        store[key] = true;
      }
      for (i = 0; i < checkedFeaturesCollection.length; i++) {
        checkedFeatures.push(checkedFeaturesCollection[i]);
      }
      return checkedFeatures.every(function (feature) {
        return store[feature.value];
      });
    });

    if (filteredArray.length > 5) {
      filteredArray.length = 5;
    }

    return filteredArray;
  }

  window.filtersForm = {
    reset: resetFiltersForm,
    toggle: toggleFiltersFormState,
    setfilterChangeHandler: setfilterChangeHandler,
    listen: listenFiltersForm,
    filter: filterArray
  };
})();
