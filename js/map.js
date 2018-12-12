'use strict';

(function () {

  var MAIN_PIN_HEIGHT = 22;

  var mapElement = document.querySelector('.map');
  var pinsContainer = document.querySelector('.map__pins');
  var mainPinElement = mapElement.querySelector('.map__pin--main');
  var mainPinMouseUpCallback = null;
  var mainPinMouseMoveCallback = null;
  var startCoords = {};
  var mainPinStartCoords = {
    left: mainPinElement.style.left,
    top: mainPinElement.style.top
  };

  mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);

  function fillMap(element) {
    pinsContainer.appendChild(element);
  }

  function returnMainPinToStartPosition() {
    mainPinElement.style.left = mainPinStartCoords.left;
    mainPinElement.style.top = mainPinStartCoords.top;
  }

  function removePins() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  }

  function removeCard() {
    var activeCard = document.querySelector('.map__card');
    if (activeCard) {
      activeCard.remove();
    }
  }

  function clearMap() {
    removePins();
    removeCard();
    returnMainPinToStartPosition();
  }

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

    if (getMainPinCoordinates().y < window.utils.Y_MIN) {
      mainPinElement.style.top = (window.utils.Y_MIN - mainPinElement.offsetHeight - MAIN_PIN_HEIGHT) + 'px';
    } else if (getMainPinCoordinates().y > window.utils.Y_MAX) {
      mainPinElement.style.top = (window.utils.Y_MAX - mainPinElement.offsetHeight - MAIN_PIN_HEIGHT) + 'px';
    } else {
      mainPinElement.style.top = (mainPinElement.offsetTop + shift.y) + 'px';
    }

    if (getMainPinCoordinates().x < window.utils.X_MIN) {
      mainPinElement.style.left = (window.utils.X_MIN - mainPinElement.offsetWidth / 2) + 'px';
    } else if (getMainPinCoordinates().x > window.utils.X_MAX) {
      mainPinElement.style.left = (window.utils.X_MAX - mainPinElement.offsetWidth / 2) + 'px';
    } else {
      mainPinElement.style.left = (mainPinElement.offsetLeft + shift.x) + 'px';
    }

    if (mainPinMouseMoveCallback) {
      mainPinMouseMoveCallback();
    }

  }

  function toggleMapState() {
    mapElement.classList.toggle('map--faded');
  }

  function mainPinMouseDownHandler(evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  }

  function mainPinMouseUpHandler(evt) {
    evt.preventDefault();

    document.removeEventListener('mousemove', mainPinMouseMoveHandler);
    document.removeEventListener('mouseup', mainPinMouseUpHandler);

    if (mainPinMouseUpCallback) {
      mainPinMouseUpCallback();
    }
  }

  function setPinMouseUpCallback(callback) {
    mainPinMouseUpCallback = callback;
  }

  function setPinMouseMoveCallback(callback) {
    mainPinMouseMoveCallback = callback;
  }

  window.map = {
    fill: fillMap,
    clear: clearMap,
    getMainPinCoordinates: getMainPinCoordinates,
    setPinMouseUpCallback: setPinMouseUpCallback,
    setPinMouseMoveCallback: setPinMouseMoveCallback,
    toggleState: toggleMapState
  };
})();
