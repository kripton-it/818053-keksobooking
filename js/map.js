'use strict';

var NUMBER_OF_OBJECTS = 8;
var ORIGINAL_NUMBER_ARRAY = [];
for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
  ORIGINAL_NUMBER_ARRAY[i] = i + 1;
}



function getRandomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  return  Math.round(rand);
}

function getRandomElement (array) {
  var randomIndex = getRandomInteger(1, array.length) - 1;
  return array[randomIndex];
}

function getMixedArray (array) {
  var originalArray = array.slice(0);
  var mixedArray = [];
  for (var i = 0; i < array.length; i++) {
    var randomIndex = getRandomInteger(0, originalArray.length - 1);
    mixedArray[i] = originalArray[randomIndex];
    originalArray.splice(randomIndex, 1);
  }
  return mixedArray;
}

function generateAvatarSrc (avatar) {
  var avatarSrc = 'img/avatars/user0' + avatar + '.png';
  return avatarSrc;
}

function generateObject(avatar) {
  var object = {
    'author': {
      'avatar': generateAvatarSrc(avatar)
    }
  };
  return object;
}

function generateData(amount) {
  var array = [];
  var numberArray = getMixedArray(ORIGINAL_NUMBER_ARRAY);
  for (var i = 0; i < amount; i++) {
    var avatar = numberArray[i];
    array[i] = generateObject(avatar);
    //alert(array[i].author.avatar);
  }
  return array;
}

var data = generateData(NUMBER_OF_OBJECTS);

for (var i = 0; i < data.length; i++) {
  alert(i + ': ' + data[i].author.avatar);
}


