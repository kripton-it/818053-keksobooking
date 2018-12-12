'use strict';

(function () {

  var activeCard = null;
  var adInfoObjects = [];

  // записываем адрес в поле формы
  window.adForm.setAddress(window.map.getMainPinCoordinates());
  // задаём колбэк для mouseUp после первого перетаскивания пина - активировать страницу
  window.map.setPinMouseUpCallback(activatePage);
  // задаём колбэк для mouseMove пина - переписать адрес в поле формы
  window.map.setPinMouseMoveCallback(function () {
    window.adForm.setAddress(window.map.getMainPinCoordinates());
  });
  window.filtersForm.setfilterChangeHandler(function () {
    window.utils.debounce(function () {
      updatePins(adInfoObjects);
    });
  });
  // задаём колбэк для успешной отправки формы - деактивировать страницу
  window.adForm.setSuccessHandlerCallback(function () {
    desactivatePage();
  });
  // задаём колбэк для сброса формы - деактивировать страницу
  window.adForm.setResetFormCallback(function () {
    desactivatePage();
  });

  function activatePage() {
    window.backend.load(loadSuccessHandler, loadErrorHandler);
  }

  function desactivatePage() {
    window.map.toggleState();
    window.map.clear();
    window.adForm.reset();
    window.adForm.toggle();
    window.filtersForm.toggle();
    window.map.setPinMouseUpCallback(activatePage);
    // при деактивации страницы после ресета нужно заполнить поле адреса
    window.adForm.setAddress(window.map.getMainPinCoordinates());
  }

  function updatePins(dataArray) {
    var filteredPins = window.filter(dataArray);
    var pinsFragment = prepareElements(filteredPins);
    window.map.clear();
    window.map.fill(pinsFragment);
  }

  function loadSuccessHandler(dataArray) {
    adInfoObjects = dataArray;
    window.map.toggleState();
    window.adForm.toggle();
    window.filtersForm.toggle();
    window.filtersForm.listen();
    updatePins(dataArray);
    window.map.setPinMouseUpCallback(null);
  }

  function loadErrorHandler() {
    window.message.showErrorMessage();
  }

  function removeCardCallback() {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }

    document.removeEventListener('keyup', documentEscPressHandler);
  }

  function prepareElements(dataArray) {
    var fragment = document.createDocumentFragment();
    dataArray.forEach(function (dataObject) {
      var newPinElement = window.pin.create(dataObject, function (evt) {
        var target = evt.target.closest('.map__pin');
        if (activeCard) {
          activeCard.remove();
          removeCardCallback();
        }
        target.classList.add('map__pin--active');
        activeCard = window.card.create(dataObject, removeCardCallback);
        document.addEventListener('keyup', documentEscPressHandler);
        window.map.fill(activeCard);
      });
      if (newPinElement) {
        fragment.appendChild(newPinElement);
      }
    });
    return fragment;
  }

  // закрытие открытой карточки по Esc
  function documentEscPressHandler(evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      activeCard.remove();
      removeCardCallback();
    }
  }

})();
