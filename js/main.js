'use strict';

(function () {

  var activeCardElement = null;
  var activePinElement = null;

  // записываем адрес в поле формы
  window.adForm.setAddress(window.map.getMainPinCoordinates());
  // задаём колбэк для mouseUp после первого перетаскивания пина - активировать страницу
  window.map.setPinMouseUpCallback(activatePage);
  // задаём колбэк для mouseMove пина - переписать адрес в поле формы
  window.map.setPinMouseMoveCallback(function () {
    window.adForm.setAddress(window.map.getMainPinCoordinates());
  });
  // передаём обработчик отправки формы
  window.adForm.setSubmitHandler(adFormSubmitHandler);
  // задаём колбэк для сброса формы - деактивировать страницу
  window.adForm.setResetCallback(function () {
    deactivatePage();
  });

  // обработчик отправки формы
  function adFormSubmitHandler(evt) {
    window.backend.upload(new FormData(evt.currentTarget), function () {
      deactivatePage();
      window.message.showSuccess();
    }, function () {
      window.message.showError();
    });
  }

  function activatePage() {
    window.backend.load(loadSuccessHandler, loadErrorHandler);
  }

  function deactivatePage() {
    window.map.toggleState();
    window.map.clear();
    window.adForm.reset();
    window.filtersForm.reset();
    window.adForm.setAddress(window.map.getMainPinCoordinates());
    window.adForm.toggle();
    window.filtersForm.toggle();
    window.map.setPinMouseUpCallback(activatePage);
  }

  function updatePins(ads) {
    var filteredAds = window.filtersForm.filter(ads);
    var pinsFragment = prepareElements(filteredAds);
    window.map.clear();
    window.map.fill(pinsFragment);
  }

  function loadSuccessHandler(ads) {
    window.map.toggleState();
    window.adForm.toggle();
    window.filtersForm.toggle();
    // передаём обработчик для изменения фильтров
    window.filtersForm.setFilterChangeHandler(function () {
      window.utils.debounce(function () {
        updatePins(ads);
      });
    });
    updatePins(ads);
    window.map.setPinMouseUpCallback(null);
  }

  function loadErrorHandler() {
    window.message.showError();
  }

  function removeCardCallback() {
    if (activePinElement) {
      activePinElement.classList.remove('map__pin--active');
    }

    document.removeEventListener('keyup', documentEscPressHandler);
  }

  function prepareElements(ads) {
    var fragment = document.createDocumentFragment();
    ads.forEach(function (ad) {
      var newPinElement = window.pin.create(ad, function (evt) {
        if (activeCardElement) {
          activeCardElement.remove();
          removeCardCallback();
        }
        activePinElement = evt.target.closest('.map__pin');
        activePinElement.classList.add('map__pin--active');
        activeCardElement = window.card.create(ad, removeCardCallback);
        document.addEventListener('keyup', documentEscPressHandler);
        window.map.fill(activeCardElement);
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
      activeCardElement.remove();
      removeCardCallback();
    }
  }

})();
