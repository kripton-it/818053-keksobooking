'use strict';

var NUMBER_OF_OBJECTS = 8;
var ORIGINAL_NUMBER_ARRAY = [];
for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
  ORIGINAL_NUMBER_ARRAY[i] = i + 1;
}
var ORIGINAL_TITLE_ARRAY = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TYPE_ARRAY = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var MIN_NUMBER_OF_ROOMS = 1;
var MAX_NUMBER_OF_ROOMS = 5;


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

function generateObject(avatar, title, type) {
  var object = {
    'author': {
      'avatar': generateAvatarSrc(avatar)
    },
    'offer': {
      'title': title,
      'price': getRandomInteger(MIN_PRICE, MAX_PRICE),
      'type': type,
      'rooms': getRandomInteger(MIN_NUMBER_OF_ROOMS, MAX_NUMBER_OF_ROOMS)
    }
  };
  return object;
}

function generateData(amount) {
  var array = [];
  var numberArray = getMixedArray(ORIGINAL_NUMBER_ARRAY);
  var titleArray = getMixedArray(ORIGINAL_TITLE_ARRAY);
  for (var i = 0; i < amount; i++) {
    var avatar = numberArray[i];
    var title = titleArray[i];
    var type = TYPE_ARRAY[getRandomInteger(0, TYPE_ARRAY.length - 1)];
    array[i] = generateObject(avatar, title, type);
  }
  return array;
}

var data = generateData(NUMBER_OF_OBJECTS);

for (var i = 0; i < data.length; i++) {
  alert(i + ': ' + data[i].offer.rooms);
}


