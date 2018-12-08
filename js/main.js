'use strict';

(function () {

  var activeCard = null;

  // записываем адрес в поле формы
  window.form.setAddress(window.map.getMainPinCoordinates());
  // задаём колбэк для mouseUp после первого перетаскивания пина - активировать страницу
  window.map.setPinMouseUpCallback(activatePage);
  // задаём колбэк для mouseMove пина - переписать адрес в поле формы
  window.map.setPinMouseMoveCallback(function () {
    window.form.setAddress(window.map.getMainPinCoordinates());
  });
  window.form.setDesactivateCallback(function () {
    window.map.setPinMouseUpCallback(activatePage);
  });

  function activatePage() {
    // переключаем состояние карты
    window.map.toggleMapState();
    // переключаем состояние форм
    window.form.toggleFormState(window.form.adFormElement);

    window.backend.load(loadSuccessHandler, loadErrorHandler);
  }

  function loadSuccessHandler(array) {
    var pins = prepareElements(array);
    window.map.fill(pins);
    window.map.setPinMouseUpCallback(null);
    window.form.toggleFormState(window.form.filtersFormElement);
  }

  function loadErrorHandler() {
    window.form.showErrorMessage();
  }

  function createCardCallback() {
    document.removeEventListener('keyup', documentEscPressHandler);
  }

  function prepareElements(dataArray) {
    var fragment = document.createDocumentFragment();
    dataArray.forEach(function (dataObject) {
      var newPinElement = window.pin.createPin(dataObject, function (evt) {
        var target = evt.target.closest('.map__pin');
        var activePin = target.parentNode.querySelector('.map__pin--active');
        if (activePin) {
          activePin.classList.remove('map__pin--active');
        }
        target.classList.add('map__pin--active');
        var cardElement = window.card.createCard(dataObject, createCardCallback);
        if (activeCard) {
          activeCard.remove();
        }
        activeCard = cardElement;
        document.addEventListener('keyup', documentEscPressHandler);
        window.map.fill(cardElement);
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
      if (activeCard) {
        activeCard.remove();
      }
      document.removeEventListener('keyup', documentEscPressHandler);
    }
  }

})();
