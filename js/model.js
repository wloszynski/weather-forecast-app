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

// Get coords from given city name
export const getCoordsFromCityName = async function (cityName) {
  return await fetch(
    `${LIQ_API_URL}/search.php?key=${LIQ_API_KEY}&format=json&q=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Could not find given city, try again.");
        throw new Error("Could not find given city");
      }
      return [data[0].lat, data[0].lon];
    })
    .catch((err) => {
      console.error(err);
    });
};

// Getting location using lat and lng -> Wroclaw, Poland
export const getCityName = async function (lat, lng) {
  return await fetch(
    `${LIQ_API_URL}/reverse.php?key=${LIQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      const country = data.address.country || "";
      const city = data.address.city || data.address.county || "";

      if (city) {
        return `${city}, ${country}`;
      }

      return `${country}`;
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
