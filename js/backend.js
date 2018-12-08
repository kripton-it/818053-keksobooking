'use strict';

var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
var LOAD_URL = 'https://js.dump.academy/keksobooking/data';

(function () {

  // загрузка данных на сервер
  function upload(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  }

  // получение данных с сервер
  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        return onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open('GET', LOAD_URL);
    xhr.send();
  }

  window.backend = {
    load: load,
    upload: upload
  };
})();
