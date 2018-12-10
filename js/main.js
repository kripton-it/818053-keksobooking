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
  // задаём колбэк для успешной отправки формы - деактивировать страницу
  window.form.setSuccessHandlerCallback(function () {
    desactivatePage();
  });
  // задаём колбэк для сброса формы - деактивировать страницу
  window.form.setResetFormCallback(function () {
    desactivatePage();
  });

  function activatePage() {
    window.backend.load(loadSuccessHandler, loadErrorHandler);
  }

  function desactivatePage() {
    window.map.clear();
    window.map.toggleState();
    window.form.setAddress(window.map.getMainPinCoordinates());
    window.form.reset();
    window.form.toggleAll();
    window.map.setPinMouseUpCallback(activatePage);
  }

  function loadSuccessHandler(array) {
    window.map.toggleState();
    window.form.toggleAll();
    var pins = prepareElements(array);
    window.map.fill(pins);
    window.map.setPinMouseUpCallback(null);
  }

  function loadErrorHandler() {
    window.message.showErrorMessage();
  }

  function removeCardCallback() {
    var activePin = document.querySelector('.map__pin--active');
    activePin.classList.remove('map__pin--active');
    document.removeEventListener('keyup', documentEscPressHandler);
  }

  function prepareElements(dataArray) {
    var fragment = document.createDocumentFragment();
    dataArray.forEach(function (dataObject) {
      var newPinElement = window.pin.create(dataObject, function (evt) {
        var target = evt.target.closest('.map__pin');
        var activePin = target.parentNode.querySelector('.map__pin--active');
        if (activePin) {
          activePin.classList.remove('map__pin--active');
        }
        target.classList.add('map__pin--active');
        var cardElement = window.card.create(dataObject, removeCardCallback);
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
      window.card.remove(activeCard, removeCardCallback);
    }
  }

})();
