'use strict';

var NUMBER_OF_OBJECTS = 8;
var NUMBERS = getMixedArray([1, 2, 3, 4, 5, 6, 7, 8]);
var TITLES = getMixedArray([
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
]);
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var MIN_NUMBER_OF_ROOMS = 1;
var MAX_NUMBER_OF_ROOMS = 5;
var MIN_NUMBER_OF_GUESTS = 1;
var MAX_NUMBER_OF_GUESTS = 3;
var CHECK_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
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
  return array.slice(0, randomLength);
}

function getRandomLengthMixedArray(array) {
  return getRandomLengthArray(getMixedArray(array));
}

function generateObject(i) {
  var object = {
    'author': {
      'avatar': 'img/avatars/user0' + NUMBERS[i] + '.png'
    },
    'offer': {
      'title': TITLES[i],
      'address': getRandomInteger(X_MIN, X_MAX) + ', ' + getRandomInteger(Y_MIN, Y_MAX),
      'price': getRandomInteger(MIN_PRICE, MAX_PRICE),
      'type': TYPES[getRandomInteger(0, TYPES.length - 1)],
      'rooms': getRandomInteger(MIN_NUMBER_OF_ROOMS, MAX_NUMBER_OF_ROOMS),
      'guests': getRandomInteger(MIN_NUMBER_OF_GUESTS, MAX_NUMBER_OF_GUESTS),
      'checkin': CHECK_TIMES[getRandomInteger(0, CHECK_TIMES.length - 1)],
      'checkout': CHECK_TIMES[getRandomInteger(0, CHECK_TIMES.length - 1)],
      'description': '',
      'features': getRandomLengthMixedArray(FEATURES),
      'photos': getMixedArray(PHOTOS)
    },
    'location': {
      x: getRandomInteger(X_MIN, X_MAX),
      y: getRandomInteger(Y_MIN, Y_MAX)
    }
  };
  return object;
}

function generateData() {
  var array = [];

  for (var i = 0; i < NUMBER_OF_OBJECTS; i++) {
    array[i] = generateObject(i);
  }
  return array;
}

var data = generateData();

console.log(data);


