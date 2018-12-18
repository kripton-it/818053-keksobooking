'use strict';

(function () {
  var dragEl;
  var rootEl;

  function sortable(element) {
    rootEl = element;
    // console.log('sortable');
    [].slice.call(rootEl.children).forEach(function (item) {
      item.draggable = true;
    });

    element.addEventListener('dragstart', function (evt) {
      // console.log('dragstart');
      elementDragStartHandler(evt);
    });
  }

  function elementDragStartHandler(evt) {
    dragEl = evt.target.closest('div.ad-form__photo');
    // console.log(dragEl);
    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('text/html', dragEl.innerHTML);

    rootEl.addEventListener('dragover', elementDragOverHandler, false);
    rootEl.addEventListener('dragend', elementDragEndHandler, false);

  }

  function elementDragOverHandler(evt) {
    // console.log('dragover');
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';

    var target = evt.target;
    if (target && target !== dragEl && target.tagName.toLowerCase() === 'div') {
      // Сортируем
      rootEl.insertBefore(dragEl, target.nextSibling || target);
    }
  }

  function elementDragEndHandler(evt) {
    // console.log('dragend');
    evt.preventDefault();

    dragEl.classList.remove('ghost');
    rootEl.removeEventListener('dragover', elementDragOverHandler, false);
    rootEl.removeEventListener('dragend', elementDragEndHandler, false);
  }

  window.dragAndDropSort = sortable;
})();
