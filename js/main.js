'use strict';

(function () {

  window.form.setAddress(window.map.getMainPinCoordinates());
  window.form.toggleFormInputState(window.form.adFormElement);
  window.form.toggleFormInputState(window.form.filtersFormElement);
  window.form.setPriceParameters();
  window.form.checkRoomsAndCapacity();
  window.map.setActivatePage(function () {
    window.map.toggleMapState();
    window.form.toggleFormState(window.form.adFormElement);
    window.form.toggleFormState(window.form.filtersFormElement);
    window.map.renderPins(window.data.mock);
  });
  window.map.setPinMouseMoveCallback(function () {
    window.form.changeAddressValue();
  });
  window.map.setPinMouseUpCallback(function (evt) {

    evt.preventDefault();

    document.removeEventListener('mousemove', window.map.mainPinMouseMoveHandler);
    document.removeEventListener('mouseup', window.map.mainPinMouseUpHandler);

    if (window.map.activatePage) {
      window.map.activatePage();
    }

    window.form.changeAddressValue();
    window.map.setActivatePage();
  });

})();
