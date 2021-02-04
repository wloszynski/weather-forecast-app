import {
  OWM_API_KEY,
  OWM_API_URL,
  LIQ_API_KEY,
  LIQ_API_URL,
} from "./config.js";

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
  return fetch(
    `https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
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
  return await fetch(
    `${OWM_API_URL}/onecall?lat=${lat}&lon=${lng}&appid=${OWM_API_KEY}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((err) => console.error(err));
};

// Fetching Air Quality from OWM Air Pollution API
// Returns Good / Fair / Moderate / Poor / Very Poor
export const getAirQualityData = async function (lat, lng) {
  return await fetch(
    `${OWM_API_URL}/air_pollution?lat=${lat}&lon=${lng}&appid=${OWM_API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => data.list[0].main.aqi)
    .then((quality) => {
      switch (quality) {
        case 1:
          return "Good";
        case 2:
          return "Fair";
        case 3:
          return "Moderate";
        case 4:
          return "Poor";
        case 5:
          return "Very Poor";

        default:
          return "Moderate";
      }
    })
    .catch((err) => console.error(err));
};

// Loading data -> weather, location, forecast,
export const loadData = async function (lat, lng) {
  util.loadingSpinnerInElement(forecastContainer);

  util.hideElementOpacity(widget);

  util.removeActiveClassFromImages();

  const location = await getCityName(lat, lng).then((loc) => loc);

  const [airQuality, weatherData] = await Promise.all([
    await getAirQualityData(lat, lng).then((quality) => quality),
    await getWeatherData(lat, lng),
  ]);

  // Display data in widget
  view.displayWidget(
    weather.getWeatherWidgetObject(weatherData, location, airQuality)
  );

  // Display data in forecast information
  view.displayForecasts(weatherData);
};

// Getting location using from city name
export const loadDataFromCityName = async function (cityName) {
  const coords = await getCoordsFromCityName(cityName);
  await loadData(...coords);
};
