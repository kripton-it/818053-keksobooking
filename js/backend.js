'use strict';

(function () {

  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';

  function createRequest(errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    return xhr;
  }

  // загрузка данных на сервер
  function upload(data, loadHandler, errorHandler) {
    var xhr = createRequest(errorHandler);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  }

  // получение данных с сервера
  function load(loadHandler, errorHandler) {
    var xhr = createRequest(errorHandler);

    xhr.addEventListener('load', function () {
      var result = null;
      if (xhr.status === 200) {
        result = loadHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
      return result;
    });

    xhr.open('GET', LOAD_URL);
    xhr.send();
  }

  window.backend = {
    load: load,
    upload: upload
  };
})();
