'use strict';

(function () {

  var adFormElement = document.querySelector('.ad-form');
  var filtersFormElement = document.querySelector('.map__filters');
  var addressInputElement = adFormElement.querySelector('#address');
  var typeElement = adFormElement.querySelector('#type');
  var priceElement = adFormElement.querySelector('#price');
  var timeFieldsetElement = adFormElement.querySelector('.ad-form__element--time');
  var roomsNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');
  var syncTimeSelects = ['timein', 'timeout'];

  function setAddress(coords) {
    addressInputElement.value = coords.x + ', ' + coords.y;
  }

  function changeAddressValue() {
    setAddress(window.map.getMainPinCoordinates());
  }

  function toggleFormInputState(formElement) {
    var formInputs = formElement.querySelectorAll('input');
    var formSelects = formElement.querySelectorAll('select');
    for (var i = 0; i < formInputs.length; i++) {
      formInputs[i].disabled = !formInputs[i].disabled;
      if (formInputs[i].id === 'address') {
        formInputs[i].disabled = true;
      }
    }
    for (i = 0; i < formSelects.length; i++) {
      formSelects[i].disabled = !formSelects[i].disabled;
    }
  }

  function toggleFormState(formElement) {
    var disabledClass = formElement.name + '--disabled';
    formElement.classList.toggle(disabledClass);
    toggleFormInputState(formElement);
  }

  function typeSelectChangeHandler() {
    setPriceParameters();
  }

  function setPriceParameters() {
    var type = typeElement.value;
    var minPrice = window.data.types[type].minprice;
    priceElement.placeholder = minPrice;
    priceElement.min = minPrice;
  }

  function checkRoomsAndCapacity() {
    var roomsOptionValueLastDigit = +roomsNumberElement.value % 100;
    var capacityOptionValue = +capacityElement.value;
    var errorMessage = '';

    if (roomsOptionValueLastDigit < 2 && roomsOptionValueLastDigit !== capacityOptionValue) {
      errorMessage = 'Введите допустимое количество гостей';
    } else if (roomsOptionValueLastDigit >= 2 && (roomsOptionValueLastDigit < capacityOptionValue || capacityOptionValue === 0)) {
      errorMessage = 'Введите допустимое количество гостей';
    }

    capacityElement.setCustomValidity(errorMessage);
  }

  typeElement.addEventListener('change', typeSelectChangeHandler);

  timeFieldsetElement.addEventListener('change', function (evt) {
    var target = evt.target;
    var selects = timeFieldsetElement.querySelectorAll('select');
    for (var i = 0; i < selects.length; i++) {
      if (syncTimeSelects.indexOf(selects[i].id) !== -1) {
        selects[i].value = target.value;
      }
    }
  });

  roomsNumberElement.addEventListener('change', function () {
    checkRoomsAndCapacity();
  });

  capacityElement.addEventListener('change', function () {
    checkRoomsAndCapacity();
  });

  window.form = {
    adFormElement: adFormElement,
    filtersFormElement: filtersFormElement,
    setAddress: setAddress,
    setPriceParameters: setPriceParameters,
    changeAddressValue: changeAddressValue,
    toggleFormState: toggleFormState,
    checkRoomsAndCapacity: checkRoomsAndCapacity,
    toggleFormInputState: toggleFormInputState
  };
})();
