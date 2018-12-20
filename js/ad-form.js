'use strict';

(function () {

  var SYNC_TIME_SELECTS = ['timein', 'timeout'];
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
  var addressInputElement = adFormElement.querySelector('#address');
  var typeElement = adFormElement.querySelector('#type');
  var priceElement = adFormElement.querySelector('#price');
  var timeFieldsetElement = adFormElement.querySelector('.ad-form__element--time');
  var roomsNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');
  var resetFormCallback = null;
  var avatarInputElement = adFormElement.querySelector('.ad-form__field input[type=file]');
  var adPhotosInputElement = adFormElement.querySelector('.ad-form__upload input[type=file]');
  var avatarPreviewElement = adFormElement.querySelector('.ad-form-header__preview img');
  var adPhotosPreviewElement = adFormElement.querySelector('.ad-form__photo');

  window.form.toggleInputState(adFormElement);
  setPriceParameters();
  checkRoomsAndCapacity();
  window.preview(avatarInputElement, avatarPreviewElement);
  window.preview(adPhotosInputElement, adPhotosPreviewElement);

  typeElement.addEventListener('change', typeSelectChangeHandler);

  timeFieldsetElement.addEventListener('change', function (evt) {
    var target = evt.target;
    var selects = timeFieldsetElement.querySelectorAll('select');
    for (var i = 0; i < selects.length; i++) {
      if (SYNC_TIME_SELECTS.indexOf(selects[i].id) !== -1) {
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

  adFormElement.querySelector('.ad-form__reset').addEventListener('click', function (evt) {
    evt.preventDefault();
    resetFormCallback();
  });

  function setSubmitHandler(formSubmitHandler) {
    adFormElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
      formSubmitHandler(evt);
    });
  }

  function setResetFormCallback(callback) {
    resetFormCallback = callback;
  }

  function setAddress(coords) {
    addressInputElement.value = coords.x + ', ' + coords.y;
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
    var roomsOptionValue = roomsNumberElement.value;
    var capacityOptionValue = +capacityElement.value;
    var errorMessage = '';

    switch (roomsOptionValue) {
      case '1':
        if (capacityOptionValue !== 1) {
          errorMessage = 'Разрешённое количество гостей: 1';
        }
        break;
      case '2':
        if (capacityOptionValue !== 1 && capacityOptionValue !== 2) {
          errorMessage = 'Разрешённое количество гостей: 1 или 2';
        }
        break;
      case '3':
        if (capacityOptionValue !== 1 && capacityOptionValue !== 2 && capacityOptionValue !== 3) {
          errorMessage = 'Разрешённое количество гостей: 1, 2 или 3';
        }
        break;
      case '100':
        if (capacityOptionValue !== 0) {
          errorMessage = 'Приглашение гостей запрещено';
        }
        break;
    }

    capacityElement.setCustomValidity(errorMessage);
  }

  function resetAdForm() {
    adFormElement.reset();
  }

  function toggleAdFormState() {
    window.form.toggleState(adFormElement);
  }

  window.adForm = {
    types: types,
    setAddress: setAddress,
    setResetCallback: setResetFormCallback,
    reset: resetAdForm,
    toggle: toggleAdFormState,
    setSubmitHandler: setSubmitHandler
  };
})();
