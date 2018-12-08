'use strict';

(function () {

  var MAIN_PIN_HEIGHT = 22;

  var mapElement = document.querySelector('.map');
  var pinsContainer = document.querySelector('.map__pins');
  var mainPinElement = mapElement.querySelector('.map__pin--main');
  var mainPinMouseUpCallback = null;
  var mainPinMouseMoveCallback = null;
  var startCoords = {};

  mainPinElement.addEventListener('mousedown', mainPinMouseDownHandler);

  function fillMap(element) {
    pinsContainer.appendChild(element);
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
    getMainPinCoordinates: getMainPinCoordinates,
    setPinMouseUpCallback: setPinMouseUpCallback,
    setPinMouseMoveCallback: setPinMouseMoveCallback,
    toggleMapState: toggleMapState
  };
})();
