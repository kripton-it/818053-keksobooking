'use strict';

(function () {

  var CARD_PHOTO_WIDTH = 45;
  var CARD_PHOTO_HEIGTH = 40;

  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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
    typeElement.textContent = window.data.types[infoCard.offer.type].translation;
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

  function cardEscPressHandler(evt) {
    var cardElement = document.querySelector('.map__card');
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      cardElement.remove();
    }
  }

  window.card = {
    createCard: createCard,
    cardEscPressHandler: cardEscPressHandler
  };
})();