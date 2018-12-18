'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  function showFilePreview(file, imageElement) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imageElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }

  function showMultipleFilesPreview(files, previewElement) {
    var previewContainer = previewElement.parentNode;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < files.length; i++) {
      var imageElement = document.createElement('img');
      var currentPreviewElement = previewElement.cloneNode();
      currentPreviewElement.hidden = false;
      var file = files[i];
      imageElement.classList.add('ad-form__photo');
      showFilePreview(file, imageElement);
      currentPreviewElement.appendChild(imageElement);
      fragment.appendChild(currentPreviewElement);
    }
    previewContainer.appendChild(fragment);
    previewElement.hidden = true;
    window.dragAndDropSort(previewContainer);
  }

  function preview(fileChooser, previewElement) {
    fileChooser.addEventListener('change', function () {
      var files = fileChooser.files;

      if (!fileChooser.multiple && files.length !== 0) {
        showFilePreview(files[0], previewElement);
      }

      if (fileChooser.multiple && files.length !== 0) {
        showMultipleFilesPreview(files, previewElement);
      }

    });
  }

  window.preview = preview;
})();
