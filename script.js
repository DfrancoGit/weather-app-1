// Tutorial One *****************************

// const timeElement = document.getElementById("time");
// const dateElement = document.getElementById("date");
// const currentWeatherItemsElement = document.getElementById("current-weather-items");
// const timezone = document.getElementById("time-zone");
// const countryElement = document.getElementById("country");
// const weatherForecastElement = document.getElementById("weather-forecast");
// const currentTempElement = document.getElementById("current-temp");

// const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// setInterval(() => {
//   const time = new Date();
//   const month = time.getMonth();
//   const date = time.getDate();
//   const day = time.getDay();
//   const hours = time.getHours();
//   const hoursIn12HrFormat = hours >= 13 ? hours % 12 : hours;
//   const minutes = time.getMinutes();
//   const ampm = hours >= 12 ? "PM" : "AM";

//   timeElement.innerHTML =
//     hoursIn12HrFormat + ":" + minutes + " " + `<span id="am-pm">${ampm}</span>`;

//   dateElement.innerHTML = days[day] + ", " + date + " " + months[month];
// }, 1000);

// getWeatherData();

// function getWeatherData() {
//   navigator.geolocation.getCurrentPosition((success) => {
//     console.log(success);
//   });
// }

// const API_KEY = "8709e97d627224e82bfc295b95de83ba";
// ***
// ***
// ***
// ***
// ***
// ***

// Tutorial Two *****************************

const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-button");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const timeElement = document.querySelector(".time");

const API_KEY = "8709e97d627224e82bfc295b95de83ba";

setInterval(() => {
  const time = new Date();
  const hours = String(time.getHours()).padStart(2, "0");
  const hoursIn12HrFormat = hours >= 13 ? hours % 12 : hours;
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  timeElement.innerHTML = hoursIn12HrFormat + ":" + minutes + `<span id="am-pm"> ${ampm}</span>`;
}, 1000);

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", (e) => {
  e.key === "Enter" && getCityCoordinates();
});

function getCityCoordinates() {
  const cityName = cityInput.value.trim(); // Removes spaces from input
  if (!cityName) return;
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert("No coordinates found");
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch((e) => {
      alert(e);
    });
}

function getWeatherDetails(cityName, lat, lon) {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      // filter forecasts to get only one forecast per day
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Clear data in the search and card html

      cityInput.value = "";
      weatherCardsDiv.innerHTML = "";
      currentWeatherDiv.innerHTML = "";

      // Creating weather cards and adding them to the DOM

      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        } else {
          weatherCardsDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch((e) => {
      alert(e);
    });
}

function createWeatherCard(cityName, weatherItem, index) {
  if (index === 0) {
    // HTML for main weather card
    return `<div class="details">
              <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
              <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} &#176;C</h4>
              <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
              <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </div>
            <div class="icon">
              <img src="https://openweathermap.org/img/wn/${
                weatherItem.weather[0].icon
              }@4x.png" alt="Weather icon" />
              <h4>${weatherItem.weather[0].description}</h4>
            </div>`;
  } else {
    // HTML for 5 day forecast cards
    return `<li class="card">
                <div>(${weatherItem.dt_txt.split(" ")[0]})</div>
                <img src="https://openweathermap.org/img/wn/${
                  weatherItem.weather[0].icon
                }@2x.png" alt="Weather icon" />
                <div>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} &#176;C</div>
                <div>Wind: ${weatherItem.wind.speed} M/S</div>
                <div>Humidity: ${weatherItem.main.humidity}%</div>
              </li>`;
  }
}

// *************************************
