'use strict';

var NUMBER_OF_OBJECTS = 8;
var ORIGINAL_NUMBER_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8];
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
var MIN_NUMBER_OF_GUESTS = 1;
var MAX_NUMBER_OF_GUESTS = 3;
var CHECK_TIMES_ARRAY = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES_ARRAY = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS_ARRAY = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var X_MIN = 0;
var X_MAX = 1200;
var Y_MIN = 130;
var Y_MAX = 630;


function getRandomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function getMixedArray(array) {
  var originalArray = array.slice(0);
  var mixedArray = [];
  for (var i = 0; i < array.length; i++) {
    var randomIndex = getRandomInteger(0, originalArray.length - 1);
    mixedArray[i] = originalArray[randomIndex];
    originalArray.splice(randomIndex, 1);
  }
  return mixedArray;
}

function getRandomLengthArray(array) {
  var randomLength = getRandomInteger(1, array.length);
  var newArray = array.slice(0, randomLength);
  return newArray;
}

function getRandomLengthMixedArray(array) {
  return getRandomLengthArray(getMixedArray(array));
}

function generateAvatarSrc(avatar) {
  var avatarSrc = 'img/avatars/user0' + avatar + '.png';
  return avatarSrc;
}

function generateFeatures() {
  return getRandomLengthMixedArray(FEATURES_ARRAY);
}

function generateObject(avatar, title, type, checkin, checkout, x, y) {
  var object = {
    'author': {
      'avatar': generateAvatarSrc(avatar)
    },
    'offer': {
      'title': title,
      'address': x + ', ' + y,
      'price': getRandomInteger(MIN_PRICE, MAX_PRICE),
      'type': type,
      'rooms': getRandomInteger(MIN_NUMBER_OF_ROOMS, MAX_NUMBER_OF_ROOMS),
      'guests': getRandomInteger(MIN_NUMBER_OF_GUESTS, MAX_NUMBER_OF_GUESTS),
      'checkin': checkin,
      'checkout': checkout,
      'description': '',
      'features': generateFeatures(),
      'photos': getMixedArray(PHOTOS_ARRAY)
    },
    'location': {
      x: x,
      y: y
    }
  };
  return object;
}

function generateData() {
  var array = [];
  var numberArray = getMixedArray(ORIGINAL_NUMBER_ARRAY);
  var titleArray = getMixedArray(ORIGINAL_TITLE_ARRAY);
  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    var avatar = numberArray[i];
    var title = titleArray[i];
    var type = TYPE_ARRAY[getRandomInteger(0, TYPE_ARRAY.length - 1)];
    var checkin = CHECK_TIMES_ARRAY[getRandomInteger(0, CHECK_TIMES_ARRAY.length - 1)];
    var checkout = CHECK_TIMES_ARRAY[getRandomInteger(0, CHECK_TIMES_ARRAY.length - 1)];
    var locationX = getRandomInteger(X_MIN, X_MAX);
    var locationY = getRandomInteger(Y_MIN, Y_MAX);
    array[i] = generateObject(avatar, title, type, checkin, checkout, locationX, locationY);
  }
  return array;
}

generateData();

// var data = generateData();


