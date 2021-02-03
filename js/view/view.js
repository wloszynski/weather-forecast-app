import { checkIfCloudy } from "../weather/weather.js";
import * as util from "../util/utility.js";
import { createForecastElement } from "../weather/forecast.js";

const forecastContainer = document.querySelector(
  ".weather-information__details"
);

// VARIABLES FOR WIDGET
const widget = document.querySelector(".widget");
const widgetTemp = document.querySelector(".widget__temp");
const widgetLocation = document.querySelector(".widget__location");
const widgetFeelsLike = document.querySelector(".widget__additional-feel-temp");
const widgetSunset = document.querySelector(".additional-sunset-time");
const widgetAirQuality = document.querySelector(".widget__air-quality");
const widgetChanceOfRain = document.querySelector(
  ".widget__humidity-percentage"
);
const widgetDate = document.querySelector(".widget__date-content");
const widgetPhoto = document.querySelector("#widgetPhoto");

// Displaying data in widget section
export const displayWidget = function (weatherWidget) {
  widgetTemp.innerHTML = `${weatherWidget.temp}<sup class="widget__temp-sup">&#8451;</sup>`;
  widgetLocation.textContent = weatherWidget.location;
  widgetAirQuality.textContent = weatherWidget.airQuality;
  widgetChanceOfRain.textContent = weatherWidget.chanceOfRain;
  widgetFeelsLike.textContent = weatherWidget.feelsLike.toFixed(1);
  widgetSunset.textContent = weatherWidget.sunset;
  widgetDate.textContent = weatherWidget.date;

  widget.dataset.lat = weatherWidget.latlng[0];
  widget.dataset.lng = weatherWidget.latlng[1];

  widgetPhoto.src = `${checkIfCloudy(weatherWidget.clouds)}`;
};

// Displaying weather forecast
export const displayForecasts = function (weatherData) {
  // Remove cloud loading screen
  util.removeChildren(forecastContainer);

  // Creating Document Fragment for more efficient DOM usage
  let weatherForecasts = new DocumentFragment();

  // Deleting 8th array
  weatherData = weatherData.daily.splice(1, 5);

  for (const data of weatherData) {
    // Creating forecast element and appending  it to weatherForecasts DocumentFragment
    weatherForecasts.appendChild(createForecastElement(data));
  }

  // Displaying widget and forecast information container
  widget.style.opacity = "1";
  forecastContainer.appendChild(weatherForecasts);
};
