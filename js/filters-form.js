'use strict';

(function () {

  var SIMILAR_ADS_MAX_NUMBER = 5;
  var filtersFormElement = document.querySelector('.map__filters');
  var typeSelectElement = filtersFormElement.querySelector('#housing-type');
  var priceSelectElement = filtersFormElement.querySelector('#housing-price');
  var roomsSelectElement = filtersFormElement.querySelector('#housing-rooms');
  var guestsSelectElement = filtersFormElement.querySelector('#housing-guests');
  var featuresFieldsetElement = filtersFormElement.querySelector('#housing-features');
  var checkedFeaturesCollection;

  var PriceLimit = {
    low: 10000,
    high: 50000
  };

  window.form.toggleInputState(filtersFormElement);

  function setFilterChangeHandler(callback) {
    var filterChangeHandler = callback;
    typeSelectElement.addEventListener('change', filterChangeHandler);
    priceSelectElement.addEventListener('change', filterChangeHandler);
    roomsSelectElement.addEventListener('change', filterChangeHandler);
    guestsSelectElement.addEventListener('change', filterChangeHandler);
    featuresFieldsetElement.addEventListener('change', filterChangeHandler);
  }

  function resetFiltersForm() {
    filtersFormElement.reset();
  }

  function toggleFiltersFormState() {
    window.form.toggleState(filtersFormElement);
  }

  function isTypeMatch(item) {
    return item.offer.type === typeSelectElement.value || typeSelectElement.value === 'any';
  }

  function isPriceMatch(item) {
    var isPriceSuited;
    switch (priceSelectElement.value) {
      case 'any':
        isPriceSuited = true;
        break;
      case 'low':
        isPriceSuited = item.offer.price < PriceLimit.low;
        break;
      case 'middle':
        isPriceSuited = item.offer.price >= PriceLimit.low && item.offer.price <= PriceLimit.high;
        break;
      case 'high':
        isPriceSuited = item.offer.price > PriceLimit.high;
        break;
    }
    return isPriceSuited;
  }

  function isRoomsMatch(item) {
    return item.offer.rooms === +roomsSelectElement.value || roomsSelectElement.value === 'any';
  }

  function isGuestsMatch(item) {
    return item.offer.guests === +guestsSelectElement.value || guestsSelectElement.value === 'any';
  }

  function isFeaturesMatch(item) {
    var store = {};
    var checkedFeatures = [];

    item.offer.features.forEach(function (feature) {
      store[feature] = true;
    });

    Array.from(checkedFeaturesCollection).forEach(function (checkedFeature) {
      checkedFeatures.push(checkedFeature);
    });

    return checkedFeatures.every(function (feature) {
      return store[feature.value];
    });
  }

  function filterAds(ads) {
    checkedFeaturesCollection = featuresFieldsetElement.querySelectorAll('.map__checkbox:checked');
    var filteredAds = ads.filter(function (ad) {
      return isTypeMatch(ad) && isPriceMatch(ad) && isRoomsMatch(ad) && isGuestsMatch(ad) && isFeaturesMatch(ad);
    });

    if (filteredAds.length > SIMILAR_ADS_MAX_NUMBER) {
      filteredAds.length = SIMILAR_ADS_MAX_NUMBER;
    }

    return filteredAds;
  }

  window.filtersForm = {
    reset: resetFiltersForm,
    toggle: toggleFiltersFormState,
    setFilterChangeHandler: setFilterChangeHandler,
    filter: filterAds
  };
})();
