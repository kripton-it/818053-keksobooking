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

  function activatePage() {
    // переключаем состояние карты
    window.map.toggleMapState();
    // переключаем состояние форм
    window.form.toggleFormState(window.form.adFormElement);
    window.form.toggleFormState(window.form.filtersFormElement);
    //
    // var pins = prepareElements(window.data.mock);
    window.backend.load(loadSuccessHandler, onError);
  }

  function loadSuccessHandler(array) {
    var pins = prepareElements(array);
    window.map.fill(pins);
    window.map.setPinMouseUpCallback(null);
  }

  function onError(message) {
    alert(message);
  }

  function createCardCallback() {
    document.removeEventListener('keyup', documentEscPressHandler);
  }

  function prepareElements(dataArray) {
    var fragment = document.createDocumentFragment();
    dataArray.forEach(function (dataObject) {
      var newPinElement = window.pin.createPin(dataObject, function () {
        var cardElement = window.card.createCard(dataObject, createCardCallback);
        if (activeCard) {
          activeCard.remove();
        }
        activeCard = cardElement;
        document.addEventListener('keyup', documentEscPressHandler);
        window.map.fill(cardElement);
      });
      fragment.appendChild(newPinElement);
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
