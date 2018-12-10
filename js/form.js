'use strict';

(function () {

  var syncTimeSelects = ['timein', 'timeout'];
  var types = {
    palace: {
      translation: 'Дворец',
      minprice: 10000
    },
    flat: {
      translation: 'Квартира',
      minprice: 1000
    },
    house: {
      translation: 'Дом',
      minprice: 5000
    },
    bungalo: {
      translation: 'Бунгало',
      minprice: 0
    }
  };

  var adFormElement = document.querySelector('.ad-form');
  var filtersFormElement = document.querySelector('.map__filters');
  var addressInputElement = adFormElement.querySelector('#address');
  var typeElement = adFormElement.querySelector('#type');
  var priceElement = adFormElement.querySelector('#price');
  var timeFieldsetElement = adFormElement.querySelector('.ad-form__element--time');
  var roomsNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');
  var startFormState = {
    title: adFormElement.querySelector('#title').value,
    type: typeElement.value,
    price: priceElement.value,
    timein: timeFieldsetElement.querySelector('#timein').value,
    timeout: timeFieldsetElement.querySelector('#timeout').value,
    rooms: roomsNumberElement.value,
    capacity: capacityElement.value,
    description: adFormElement.querySelector('#description').textContent
  };
  var successHandlerCallback = null;
  var resetFormCallback = null;
  // var resetButtonElement = adFormElement.querySelector('.ad-form__reset');

  toggleFormInputState(adFormElement);
  toggleFormInputState(filtersFormElement);
  setPriceParameters();
  checkRoomsAndCapacity();

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

  adFormElement.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(adFormElement), successHandler, errorHandler);
    evt.preventDefault();
  });

  function setSuccessHandlerCallback(callback) {
    successHandlerCallback = callback;
  }

  function setResetFormCallback(callback) {
    resetFormCallback = callback;
  }

  adFormElement.addEventListener('reset', function () {
    resetFormCallback();
  });

  function successHandler() {
    successHandlerCallback();
    window.message.showSuccessMessage();
  }

  function errorHandler() {
    window.message.showErrorMessage();
  }

  function resetAdForm() {
    var features = adFormElement.querySelectorAll('.feature__checkbox');
    for (var i = 0; i < features.length; i++) {
      features[i].checked = false;
    }
    adFormElement.querySelector('#title').value = startFormState.title;
    typeElement.value = startFormState.type;
    priceElement.value = startFormState.price;
    timeFieldsetElement.querySelector('#timein').value = startFormState.timein;
    timeFieldsetElement.querySelector('#timeout').value = startFormState.timeout;
    roomsNumberElement.value = startFormState.rooms;
    capacityElement.value = startFormState.capacity;
    adFormElement.querySelector('#description').textContent = startFormState.description;

    // при необходимости, здесь же будет сброс фотографий автора и фотографий жилья
  }

  function setAddress(coords) {
    addressInputElement.value = coords.x + ', ' + coords.y;
  }

  function toggleFormInputState(formElement) {
    for (var i = 0; i < formElement.children.length; i++) {
      formElement.children[i].disabled = !formElement.children[i].disabled;
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
    var minPrice = types[type].minprice;
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

  function toggleAllForms() {
    toggleFormState(adFormElement);
    toggleFormState(filtersFormElement);
  }

  window.form = {
    types: types,
    setAddress: setAddress,
    toggleAllForms: toggleAllForms,
    setSuccessHandlerCallback: setSuccessHandlerCallback,
    setResetFormCallback: setResetFormCallback,
    resetAdForm: resetAdForm
  };
})();
