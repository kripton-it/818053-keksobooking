'use strict';

var NUMBER_OF_OBJECTS = 8;

function generateAvatarSrc () {
  var avatarSrc = 'img/avatars/user.png';
  return avatarSrc;
}

function generateObject() {
  var object = {
    'author': {
      'avatar': generateAvatarSrc()
    }
  };
  return object;
}

function generateData(amount) {
  var array = [];
  for (var i = 0; i < amount; i++) {
    array[i] = generateObject();
    alert(array[i].author.avatar);
  }
  return array;
}

var data = generateData(NUMBER_OF_OBJECTS);


