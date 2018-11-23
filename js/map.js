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
var MIN_CHECK_HOUR = 12;
var MAX_CHECK_HOUR = 14;
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
var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;
var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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
  var location = {
    x: getRandomInteger(X_MIN, X_MAX),
    y: getRandomInteger(Y_MIN, Y_MAX)
  };
  var object = {
    author: {
      avatar: 'img/avatars/user0' + NUMBERS[i] + '.png'
    },
    offer: {
      title: TITLES[i],
      address: location.x + ', ' + location.y,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: TYPES[getRandomInteger(0, TYPES.length - 1)],
      rooms: getRandomInteger(MIN_NUMBER_OF_ROOMS, MAX_NUMBER_OF_ROOMS),
      guests: getRandomInteger(MIN_NUMBER_OF_GUESTS, MAX_NUMBER_OF_GUESTS),
      checkin: getRandomInteger(MIN_CHECK_HOUR, MAX_CHECK_HOUR) + ':00',
      checkout: getRandomInteger(MIN_CHECK_HOUR, MAX_CHECK_HOUR) + ':00',
      description: '',
      features: getRandomLengthMixedArray(FEATURES),
      photos: getMixedArray(PHOTOS)
    },
    location: location
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

function createPin(example) {
  var pin = pinTemplate.cloneNode(true);
  pin.style.left = example.location.x - PIN_WIDTH / 2 + 'px';
  pin.style.top = example.location.y - PIN_HEIGHT + 'px';
  var pinImage = pin.querySelector('img');
  pinImage.src = example.author.avatar;
  pinImage.alt = example.offer.title;
  return pin;
}

function renderPin(data) {
  var mapPins = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < data.length; i++) {
    var newPin = createPin(data[i]);
    fragment.appendChild(newPin);
  }
  mapPins.appendChild(fragment);
}

function createCard(example) {
  var card = cardTemplate.cloneNode(true);
  var cardImage = card.querySelector('.popup__avatar');
  cardImage.src = example.author.avatar;
  var cardTitle = card.querySelector('.popup__title');
  cardTitle.textContent = example.offer.title;
  var cardAddress = card.querySelector('.popup__text--address');
  cardAddress.textContent = example.offer.address;
  var cardPrice = card.querySelector('.popup__text--price');
  cardPrice.innerHTML = example.offer.price + '&#x20bd;<span>/ночь</span>';
  var cardType = card.querySelector('.popup__type');
  var cardTypeContent;
  if (example.offer.type === 'flat') {
    cardTypeContent = 'Квартира';
  }
  if (example.offer.type === 'bungalo') {
    cardTypeContent = 'Бунгало';
  }
  if (example.offer.type === 'house') {
    cardTypeContent = 'Дом';
  }
  if (example.offer.type === 'palace') {
    cardTypeContent = 'Дворец';
  }
  cardType.textContent = cardTypeContent;
  var cardCapacity = card.querySelector('.popup__text--capacity');
  var cardCapacityRooms = ' комнаты для ';
  if (example.offer.rooms === 1) {
    cardCapacityRooms = ' комната для ';
  }
  if (example.offer.rooms >= 5) {
    cardCapacityRooms = ' комнат для ';
  }
  var cardCapacityGuests = ' гостей';
  if (example.offer.guests === 1) {
    cardCapacityGuests = ' гостя';
  }
  cardCapacity.textContent = example.offer.rooms + cardCapacityRooms + example.offer.guests + cardCapacityGuests;
  var cardTime = card.querySelector('.popup__text--time');
  cardTime.textContent = 'Заезд после ' + example.offer.checkin + ', выезд до ' + example.offer.checkout;
  var cardFeatures = card.querySelector('.popup__features');
  cardFeatures.innerHTML = '';
  for (var i = 0; i < example.offer.features.length; i++) {
    var cardFeaturesItem = document.createElement('li');
    cardFeaturesItem.classList.add('popup__feature');
    var cardFeaturesItemClass = 'popup__feature--' + example.offer.features[i];
    cardFeaturesItem.classList.add(cardFeaturesItemClass);
    cardFeatures.appendChild(cardFeaturesItem);
  }
  var cardDescription = card.querySelector('.popup__description');
  cardDescription.textContent = example.offer.description;
  var cardPhotos = card.querySelector('.popup__photos');
  cardPhotos.innerHTML = '';
  for (var i = 0; i < example.offer.photos.length; i++) {
    var cardPhoto = document.createElement('img');
    cardPhoto.classList.add('popup__photo');
    cardPhoto.width = '45';
    cardPhoto.height = '40';
    cardPhoto.alt = 'Фотография жилья';
    cardPhoto.src = example.offer.photos[i];
    cardPhotos.appendChild(cardPhoto);
  }

  return card;
}

function renderCard(data) {
  var card = createCard(data[0]);
  map.insertBefore(card, map.querySelector('.map__filters-container'));
}

var data = generateData();
map.classList.remove('map--faded');
renderPin(data);
renderCard(data);

