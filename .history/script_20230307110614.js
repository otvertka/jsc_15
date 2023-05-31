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

// SYNTAX navigator.geolocation.getCurrentPosition(success[, error[, options]])
if (navigator.geolocation)
  // условие для работы в старых браузерах
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(`https://www.google.de/maps/@${latitude},${longitude}`);
      // скопировали с сайта Леат флет
      const coords = [latitude, longitude];

      const map = L.map('map').setView(coords, 13); // 13 - размер карты на starte
      // console.log(map);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', function (mapEvent) {
      form.classList.remove('hidden');
      inputDistance.focus();

     
     
     
     
        //   console.log(mapEvent);
      //   const { lat, lng } = mapEvent.latlng; // lat, lng- переменные из библиотеки Leaflet
      //   L.marker([lat, lng])
      //     .addTo(map)
      //     .bindPopup(
      //       L.popup({
      //         maxWidth: 250,
      //         minWidth: 100,
      //         autoClose: false,
      //         closeOnClick: false,
      //         className: 'running-popup',
      //       })
      //     )
      //     .setPopupContent('Workout')
      //     .openPopup();
      });
    },
    function () {
      alert('Could not get your position');
    }