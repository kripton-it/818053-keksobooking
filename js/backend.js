'use strict';

(function () {

  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var SUCCESS_CODE = 200;
  var LIMIT_TIMEOUT = 10000;

  function createRequest(loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = LIMIT_TIMEOUT;

    return xhr;
  }

  // загрузка данных на сервер
  function upload(data, loadHandler, errorHandler) {
    var xhr = createRequest(loadHandler, errorHandler);
    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  }

  // получение данных с сервера
  function load(loadHandler, errorHandler) {
    var xhr = createRequest(loadHandler, errorHandler);
    xhr.open('GET', LOAD_URL);
    xhr.send();
  }

  window.backend = {
    load: load,
    upload: upload
  };
})();
