import { LIQ_API_KEY, LIQ_API_URL, NODE_API_URL } from "./config.js";

import * as weather from "./weather/weather";
import * as view from "./view/view";
import * as util from "./util/utility";

// VARIABLES FOR WEATHER FORECAST
const forecastContainer = document.querySelector(
  ".weather-information__details"
);

// VARIABLES FOR WIDGET
const widget = document.querySelector(".widget");

// Loading Cities' names for search suggestions
export const loadCities = async function () {
  return fetch(`${NODE_API_URL}/cities`, {})
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.cities;
    })
    .catch((err) => console.error(err));
};

// Get weather data for given lat and lng
export const getWeatherData = async function (lat, lng) {
  return await fetch(`${NODE_API_URL}/weather/coords/lat=${lat}&lng=${lng}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

// Get weather data for given lat and lng
export const getWeatherDataFromCityName = async function (cityName) {
  return await fetch(`${NODE_API_URL}/weather/name/${cityName}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

// Loading data -> weather, location, forecast,
export const loadData = async function (lat, lng) {
  util.resetThingForLoadingData(forecastContainer, widget);

  const data = await getWeatherData(lat, lng);

  // Display data in widget
  view.displayWidget(
    weather.getWeatherWidgetObject(
      data.weatherData,
      data.location,
      data.airQuality
    )
  );

  // Display data in forecast information
  view.displayForecasts(data.weatherData);
};

// Loading data from city name
export const loadDataFromCityName = async function (cityName) {
  util.resetThingForLoadingData(forecastContainer, widget);

  const data = await getWeatherDataFromCityName(cityName);

  // Display data in widget
  view.displayWidget(
    weather.getWeatherWidgetObject(
      data.weatherData,
      data.location,
      data.airQuality
    )
  );

  // Display data in forecast information
  view.displayForecasts(data.weatherData);
};
