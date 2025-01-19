// Tutorial One *****************************

const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const currentWeatherItemsElement = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryElement = document.getElementById("country");
const weatherForecastElement = document.getElementById("weather-forecast");
const currentTempElement = document.getElementById("current-temp");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const API_KEY = "8709e97d627224e82bfc295b95de83ba";

// Tutorial Two *****************************

const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-button");

searchButton.addEventListener("click", getCityCoordinates);

function getCityCoordinates() {
  const cityName = cityInput.value.trim(); // Removes spaces from input
  if (!cityName) return;
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert("No coordinates found");
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occured while fetching the coordinates");
    });
}

function getWeatherDetails(cityName, lan, lon) {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch(() => {
      alert("An error occured while fetching weather forecast");
    });
}

// *************************************
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hours = time.getHours();
  const hoursIn12HrFormat = hours >= 13 ? hours % 12 : hours;
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  timeElement.innerHTML =
    hoursIn12HrFormat + ":" + minutes + " " + `<span id="am-pm">${ampm}</span>`;

  dateElement.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    console.log(success);
  });
}
