'use strict';

(function () {

  var activeCard = null;
  var pins = [];

  // записываем адрес в поле формы
  window.adForm.setAddress(window.map.getMainPinCoordinates());
  // задаём колбэк для mouseUp после первого перетаскивания пина - активировать страницу
  window.map.setPinMouseUpCallback(activatePage);
  // задаём колбэк для mouseMove пина - переписать адрес в поле формы
  window.map.setPinMouseMoveCallback(function () {
    window.adForm.setAddress(window.map.getMainPinCoordinates());
  });
  window.filtersForm.setfilterChangeHandler(updatePins);
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
    setTimeout(function () {
      window.adForm.setAddress(window.map.getMainPinCoordinates());
    }, 0);
  }

  function updatePins() {
    var filteredPins = window.filter(pins);
    var pinsFragment = prepareElements(filteredPins);
    window.map.clear();
    window.map.fill(pinsFragment);
  }

  function loadSuccessHandler(array) {
    pins = array;
    window.map.toggleState();
    window.adForm.toggle();
    window.filtersForm.toggle();
    window.filtersForm.listen();
    updatePins();
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
    var dataArrayLength = dataArray.length > 5 ? 5 : dataArray.length;
    var dataArrayCopy = dataArray.slice(0, dataArrayLength);
    var fragment = document.createDocumentFragment();
    dataArrayCopy.forEach(function (dataObject) {
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
