'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10); // конвертир. в String и берём последние 10 символов

  constructor(coords, distance, duration) {
    // this.date = ...
    // this.id = ...
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

///////////////////////////////////////////////
// APLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;

  constructor() {
    // constructor немедленно вызовется, когда будет создан класс
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this)); //  this._newWorkout -функция, которая вызовется Эвентлистенером

    inputType.addEventListener('change', this._togleElevationField);
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
    this.#map.on('click', this._showForm.bind(this)); // this - app Object
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _togleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp)); // Цикл проходит по всему массиву и проверяет isFinite() функция определяет, является ли переданное значение конечным числом
    e.preventDefault();
    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value; // конверт в Число
    const duration = +inputDuration.value;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');
    }
    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
    }
    // Add new object to workout array

    // Render workout on map as marker
    // console.log(mapEvent);
    const { lat, lng } = this.#mapEvent.latlng; // lat, lng- переменные из библиотеки Leaflet
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

    // Render workout on list

    // Hide form + clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Display marker
  }
}

const app = new App();
