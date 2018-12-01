'use strict';

// #13 Личный проект: пока все дома

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
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_HEIGHT = 22;
var CARD_PHOTO_WIDTH = 45;
var CARD_PHOTO_HEIGTH = 40;
var types = {
  palace: {
    translation: 'Дворец',
    minprice: 10000
  },
  flat: {
    translation: 'Квартира',
    minprice: 1000
  },
  house: {
    translation: 'Дом',
    minprice: 5000
  },
  bungalo: {
    translation: 'Бунгало',
    minprice: 0
  }
};
var mapElement = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var pinsContainer = document.querySelector('.map__pins');

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

function getCardCapacityRooms(rooms) {
  var cardCapacityRooms = ' комнаты для ';
  if (rooms === 1) {
    cardCapacityRooms = ' комната для ';
  }
  if (rooms >= 5) {
    cardCapacityRooms = ' комнат для ';
  }
  return cardCapacityRooms;
}

function generateObject(index) {
  var location = {
    x: getRandomInteger(X_MIN, X_MAX),
    y: getRandomInteger(Y_MIN, Y_MAX)
  };
  var object = {
    author: {
      avatar: 'img/avatars/user0' + NUMBERS[index] + '.png'
    },
    offer: {
      title: TITLES[index],
      address: location.x + ', ' + location.y,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: Object.keys(types)[getRandomInteger(0, Object.keys(types).length - 1)],
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

function createPin(infoPin, pinElementClickHandler) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style.left = infoPin.location.x - PIN_WIDTH / 2 + 'px';
  pinElement.style.top = infoPin.location.y - PIN_HEIGHT + 'px';
  var imgElement = pinElement.querySelector('img');
  imgElement.src = infoPin.author.avatar;
  imgElement.alt = infoPin.offer.title;
  pinElement.addEventListener('click', pinElementClickHandler);
  return pinElement;
}

function renderPins(dataArray) {
  var fragment = document.createDocumentFragment();
  dataArray.forEach(function (dataObject) {
    var newPinElement = createPin(dataObject, function () {
      removeExistingPopup();
      var cardElement = createCard(dataObject);
      showCard(cardElement);
    });
    fragment.appendChild(newPinElement);
  });
  pinsContainer.appendChild(fragment);
}

function createFeature(featureName) {
  var cardFeatureElement = document.createElement('li');
  cardFeatureElement.classList.add('popup__feature');
  var cardFeaturesItemClass = 'popup__feature--' + featureName;
  cardFeatureElement.classList.add(cardFeaturesItemClass);
  return cardFeatureElement;
}

function createFeaturesList(featuresArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < featuresArray.length; i++) {
    fragment.appendChild(createFeature(featuresArray[i]));
  }
  return fragment;
}

function createPhoto(photoSrc) {
  var cardPhotoElement = document.createElement('img');
  cardPhotoElement.classList.add('popup__photo');
  cardPhotoElement.width = CARD_PHOTO_WIDTH.toString();
  cardPhotoElement.height = CARD_PHOTO_HEIGTH.toString();
  cardPhotoElement.alt = 'Фотография жилья';
  cardPhotoElement.src = photoSrc;
  return cardPhotoElement;
}

function createPhotosList(photosSrcArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photosSrcArray.length; i++) {
    fragment.appendChild(createPhoto(photosSrcArray[i]));
  }
  return fragment;
}

function createCard(infoCard, callback) {
  var cardElement = cardTemplate.cloneNode(true);
  var avatarElement = cardElement.querySelector('.popup__avatar');
  var titleElement = cardElement.querySelector('.popup__title');
  var addressElement = cardElement.querySelector('.popup__text--address');
  var priceElement = cardElement.querySelector('.popup__text--price');
  var typeElement = cardElement.querySelector('.popup__type');
  var capacityElement = cardElement.querySelector('.popup__text--capacity');
  var timeElement = cardElement.querySelector('.popup__text--time');
  var featuresListElement = cardElement.querySelector('.popup__features');
  var descriptionElement = cardElement.querySelector('.popup__description');
  var photosListElement = cardElement.querySelector('.popup__photos');
  var popupCloseElement = cardElement.querySelector('.popup__close');
  avatarElement.src = infoCard.author.avatar;
  titleElement.textContent = infoCard.offer.title;
  addressElement.textContent = infoCard.offer.address;
  priceElement.innerHTML = infoCard.offer.price + '&#x20bd;<span>/ночь</span>';
  typeElement.textContent = types[infoCard.offer.type].translation;
  capacityElement.textContent = infoCard.offer.rooms + getCardCapacityRooms(infoCard.offer.rooms) + infoCard.offer.guests + (infoCard.offer.guests === 1 ? ' гостя' : ' гостей');
  timeElement.textContent = 'Заезд после ' + infoCard.offer.checkin + ', выезд до ' + infoCard.offer.checkout;
  featuresListElement.innerHTML = '';
  featuresListElement.appendChild(createFeaturesList(infoCard.offer.features));
  descriptionElement.textContent = infoCard.offer.description;
  photosListElement.innerHTML = '';
  photosListElement.appendChild(createPhotosList(infoCard.offer.photos));
  popupCloseElement.addEventListener('click', function () {
    cardElement.remove();
    if (callback) {
      callback();
    }
  });

  return cardElement;
}

var data = generateData();

// #16 Личный проект: подробности

var mainPinElement = mapElement.querySelector('.map__pin--main');
var adFormElement = document.querySelector('.ad-form');
var filtersFormElement = document.querySelector('.map__filters');
var addressInputElement = adFormElement.querySelector('#address');
var mainPinCenterCoords = {
  x: parseInt(mainPinElement.style.left, 10) + mainPinElement.offsetWidth / 2,
  y: parseInt(mainPinElement.style.top, 10) + mainPinElement.offsetHeight / 2
};

function toggleMapState() {
  mapElement.classList.toggle('map--faded');
}

function setAddress(coords) {
  addressInputElement.value = coords.x + ', ' + coords.y;
}

function changeAddressValue() {
  var mainPinCoords = {
    x: parseInt(mainPinElement.style.left, 10) + mainPinElement.offsetWidth / 2,
    y: parseInt(mainPinElement.style.top, 10) + mainPinElement.offsetHeight + MAIN_PIN_HEIGHT
  };
  setAddress(mainPinCoords);
}

function toggleFormState(formElement) {
  var disabledClass = formElement.name + '--disabled';
  formElement.classList.toggle(disabledClass);
  toggleFormInputState(formElement);
}

function toggleFormInputState(formElement) {
  var formInputs = formElement.querySelectorAll('input');
  var formSelects = formElement.querySelectorAll('select');
  for (var i = 0; i < formInputs.length; i++) {
    formInputs[i].disabled = !formInputs[i].disabled;
    if (formInputs[i].id === 'address') {
      formInputs[i].disabled = true;
    }
  }
  for (i = 0; i < formSelects.length; i++) {
    formSelects[i].disabled = !formSelects[i].disabled;
  }
}

function mainPinMouseupHandler() {
  toggleMapState();
  toggleFormState(adFormElement);
  toggleFormState(filtersFormElement);
  changeAddressValue();
  renderPins(data);
  mainPinElement.removeEventListener('mouseup', mainPinMouseupHandler);
}

function removeExistingPopup() {
  var oldCardElement = mapElement.querySelector('.map__card');
  if (oldCardElement) {
    oldCardElement.remove();
  }
}

function showCard(cardElement) {
  mapElement.insertBefore(cardElement, mapElement.querySelector('.map__filters-container'));
}

mainPinElement.addEventListener('mouseup', mainPinMouseupHandler);

setAddress(mainPinCenterCoords);


// #17 Личный проект: доверяй, но проверяй

var typeElement = adFormElement.querySelector('#type');
var priceElement = adFormElement.querySelector('#price');
var timeFieldsetElement = adFormElement.querySelector('.ad-form__element--time');
var roomsNumberElement = adFormElement.querySelector('#room_number');
var capacityElement = adFormElement.querySelector('#capacity');
var syncTimeSelects = ['timein', 'timeout'];

function typeSelectChangeHandler() {
  setPriceParameters();
}

function setPriceParameters() {
  var type = typeElement.value;
  var minPrice = types[type].minprice;
  priceElement.placeholder = minPrice;
  priceElement.min = minPrice;
}

function checkRoomsAndCapacity() {
  var roomsOptionValueLastDigit = +roomsNumberElement.value % 100;
  var capacityOptionValue = +capacityElement.value;
  var isValid = false;
  if (roomsOptionValueLastDigit < 2 && roomsOptionValueLastDigit !== capacityOptionValue) {
    capacityElement.setCustomValidity('Введите допустимое количество гостей');
  } else if (roomsOptionValueLastDigit >= 2 && (roomsOptionValueLastDigit < capacityOptionValue || capacityOptionValue === 0)) {
    capacityElement.setCustomValidity('Введите допустимое количество гостей');
  } else {
    capacityElement.setCustomValidity('');
    isValid = true;
  }
  return isValid;
}

toggleFormInputState(adFormElement);
toggleFormInputState(filtersFormElement);
setPriceParameters();
checkRoomsAndCapacity();

typeElement.addEventListener('change', typeSelectChangeHandler);

timeFieldsetElement.addEventListener('change', function (evt) {
  var target = evt.target;
  var selects = timeFieldsetElement.querySelectorAll('select');
  for (var i = 0; i < selects.length; i++) {
    if (syncTimeSelects.indexOf(selects[i].id) !== -1) {
      selects[i].value = target.value;
    }
  }
});

roomsNumberElement.addEventListener('change', function () {
  checkRoomsAndCapacity();
});

capacityElement.addEventListener('change', function () {
  checkRoomsAndCapacity();
});

