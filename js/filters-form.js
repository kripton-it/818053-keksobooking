'use strict';

(function () {

  var filterChangeHandler = null;

  var filtersFormElement = document.querySelector('.map__filters');


  window.form.toggleInputState(filtersFormElement);

  function listenFiltersForm() {
    var typeSelectElement = filtersFormElement.querySelector('#housing-type');
    typeSelectElement.addEventListener('change', filterChangeHandler);
    var priceSelectElement = filtersFormElement.querySelector('#housing-price');
    priceSelectElement.addEventListener('change', filterChangeHandler);
    var roomsSelectElement = filtersFormElement.querySelector('#housing-rooms');
    roomsSelectElement.addEventListener('change', filterChangeHandler);
    var guestsSelectElement = filtersFormElement.querySelector('#housing-guests');
    guestsSelectElement.addEventListener('change', filterChangeHandler);
    var featuresFieldsetElement = filtersFormElement.querySelector('#housing-features');
    featuresFieldsetElement.addEventListener('change', filterChangeHandler);
  }

  function setfilterChangeHandler(callback) {
    filterChangeHandler = callback;
  }

  function resetFiltersForm() {
    window.form.reset(filtersFormElement);
  }

  function toggleFiltersFormState() {
    window.form.toggleState(filtersFormElement);
  }

  window.filtersForm = {
    reset: resetFiltersForm,
    toggle: toggleFiltersFormState,
    setfilterChangeHandler: setfilterChangeHandler,
    listen: listenFiltersForm
  };
})();
