'use strict';

(function () {

  var activeCard = null;

  function activatePage() {
    // переключаем состояние карты
    window.map.toggleMapState();
    // переключаем состояние форм
    window.form.toggleFormState(window.form.adFormElement);
    window.form.toggleFormState(window.form.filtersFormElement);
    //
    var pins = prepareElements(window.data.mock);
    //
    window.map.fill(pins);
    // отменяем колбэк
    window.map.setPinMouseUpCallback(null);
  }

  function createCardCallback() {
    document.addEventListener('keydown', documentEscPressHandler);
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
        // ??? document.addEventListener('keydown', documentEscPressHandler);
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
      document.removeEventListener('keypress', documentEscPressHandler);
    }
  }

  // записываем адрес в поле формы
  window.form.setAddress(window.map.getMainPinCoordinates());
  // задаём колбэк для mouseUp после первого перетаскивания пина - активировать страницу
  window.map.setPinMouseUpCallback(activatePage);
  // задаём колбэк для mouseMove пина - переписать адрес в поле формы
  window.map.setPinMouseMoveCallback(function () {
    window.form.setAddress(window.map.getMainPinCoordinates());
  });
})();
