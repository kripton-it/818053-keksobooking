'use strict';

(function () {

  function toggleFormInputState(formElement) {
    Array.from(formElement.children).forEach(function (child) {
      child.disabled = !child.disabled;
    });
  }

  function toggleFormState(formElement) {
    var disabledClass = formElement.name + '--disabled';
    formElement.classList.toggle(disabledClass);
    toggleFormInputState(formElement);
  }

  window.form = {
    toggleState: toggleFormState,
    toggleInputState: toggleFormInputState
  };
})();
