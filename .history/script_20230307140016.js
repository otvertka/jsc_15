'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// global scope
let map, mapEvent;
class App {
  #map;
  #mapEvent;

  constructor() {
    // constructor немедленно вызовется, когда будет создан класс
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this)); //  this._newWorkout -функция, которая вызовется Эвентлистенером

    inputType.addEventListener('change', function () {
      inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    });
  }
  _getPosition() {
    // SYNTAX navigator.geolocation.getCurrentPosition(success[, error[, options]])
    if (navigator.geolocation)
      // условие для работы в старых браузерах
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.de/maps/@${latitude},${longitude}`);
    // скопировали с сайта Леат флет
    const coords = [latitude, longitude];
    console.log(this);

    this.#map = L.map('map').setView(coords, 13); // 13 - размер карты на starte
    // console.log(map);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling click on map
    this.#map.on('click', function (mapE) {});
  }

  _showForm() {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _togleElevationField() {}

  _newWorkout(e) {
    e.preventDefault();

    // Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Display marker
    // console.log(mapEvent);
    const { lat, lng } = mapEvent.latlng; // lat, lng- переменные из библиотеки Leaflet
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();
