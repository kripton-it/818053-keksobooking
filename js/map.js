'use strict';

(function () {

  var MAIN_PIN_HEIGHT = 22;
  var mapElement = document.querySelector('.map');
  var pinsContainer = document.querySelector('.map__pins');
  var mainPinElement = mapElement.querySelector('.map__pin--main');

  function getMainPinCoordinates() {
    var coords = {
      x: parseInt(mainPinElement.style.left, 10) + mainPinElement.offsetWidth / 2,
      y: parseInt(mainPinElement.style.top, 10) + mainPinElement.offsetHeight + MAIN_PIN_HEIGHT
    };

    if (mapElement.classList.contains('map--faded')) {
      coords.y = parseInt(mainPinElement.style.top, 10) + mainPinElement.offsetHeight / 2;
    }

    return coords;
  }

  function mainPinMouseMoveHandler(evt) {
    evt.preventDefault();

    var shift = {
      x: evt.clientX - startCoords.x,
      y: evt.clientY - startCoords.y
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    if (mainPinElement.offsetTop + shift.y < window.utils.Y_MIN) {
      mainPinElement.style.top = window.utils.Y_MIN + 'px';
    } else if (mainPinElement.offsetTop + shift.y > window.utils.Y_MAX) {
      mainPinElement.style.top = window.utils.Y_MAX + 'px';
    } else {
      mainPinElement.style.top = (mainPinElement.offsetTop + shift.y) + 'px';
    }

    if (mainPinElement.offsetLeft + shift.x < window.utils.X_MIN) {
      mainPinElement.style.left = window.utils.X_MIN + 'px';
    } else if (mainPinElement.offsetLeft + shift.x > window.utils.X_MAX - mainPinElement.offsetWidth) {
      mainPinElement.style.left = (window.utils.X_MAX - mainPinElement.offsetWidth) + 'px';
    } else {
      mainPinElement.style.left = (mainPinElement.offsetLeft + shift.x) + 'px';
    }

    mainPinMouseMoveCallback();

  }

  function renderPins(dataArray) {
    var fragment = document.createDocumentFragment();
    dataArray.forEach(function (dataObject) {
      var newPinElement = window.pin.createPin(dataObject, function () {
        removeExistingPopup();

        var cardElement = window.card.createCard(dataObject, createCardCallback);
        showCard(cardElement);
      });
      fragment.appendChild(newPinElement);
    });
    pinsContainer.appendChild(fragment);
  }

  function createCardCallback() {
    document.removeEventListener('keydown', window.card.cardEscPressHandler);
  }

  function toggleMapState() {
    mapElement.classList.toggle('map--faded');
  }

  function showCard(cardElement) {
    mapElement.insertBefore(cardElement, mapElement.querySelector('.map__filters-container'));
    document.addEventListener('keydown', window.card.cardEscPressHandler);
  }

  function removeExistingPopup() {
    var oldCardElement = mapElement.querySelector('.map__card');
    if (oldCardElement) {
      oldCardElement.remove();
    }
  }

  var activatePage = null;

  function setActivatePage(callback) {
    if (mapElement.classList.contains('map--faded')) {
      activatePage = callback;
    } else {
      activatePage = null;
    }

    window.map.activatePage = activatePage;
  }

  var mainPinMouseUpHandler = null;
  var mainPinMouseMoveCallback = null;
  var startCoords = {};

  function mainPinMouseDownHandler(evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  }

  mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);

  function setPinMouseUpCallback(callback) {
    mainPinMouseUpHandler = callback;
  }

  function setPinMouseMoveCallback(callback) {
    mainPinMouseMoveCallback = callback;
  }

  window.map = {
    activatePage: activatePage,
    setActivatePage: setActivatePage,
    getMainPinCoordinates: getMainPinCoordinates,
    setPinMouseUpCallback: setPinMouseUpCallback,
    setPinMouseMoveCallback: setPinMouseMoveCallback,
    mainPinMouseUpHandler: mainPinMouseUpHandler,
    mainPinMouseMoveHandler: mainPinMouseMoveHandler,
    renderPins: renderPins,
    toggleMapState: toggleMapState
  };
})();
