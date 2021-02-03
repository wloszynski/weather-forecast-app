"use strict";

import * as model from "./model.js";
import * as weather from "./weather/weather.js";
import * as util from "./util/utility.js";
import * as search from "./util/search.js";
import * as view from "./view/view.js";

import { LIQ_API_KEY, LIQ_API_URL } from "./config.js";

import "./eventListeners/eventListeners.js";

import { removePolishAccents } from "./util/utility.js";

// VARIABLES FOR SEARCH
const searchInputs = document.querySelectorAll(".search");

// VARIABLES FOR WIDGET
const widget = document.querySelector(".widget");
const widgetLocation = document.querySelector(".widget__location");

// VARIABLES FOR WEATHER FORECAST
const forecastContainer = document.querySelector(
  ".weather-information__details"
);

// VARIABLES FOR IMAGES
const citiesDiv = document.querySelectorAll(".select-place__city");

// VARIABLES FOR MAP
const mapContainer = document.querySelector(".map");

// VARIABLES FOR ADDING CURRENT(CUSTOM) CITY
const customCity = document.querySelector(".custom-city");
const customCityImg = document.querySelector(".custom-city__img");
const customCityName = document.querySelector(".custom-city__name");

export default class App {
  // weather variables
  citiesArray;

  // variable for map
  map;

  constructor() {
    // EVENT LISTENERS

    // Setting load data for images from select-city div
    Array.from(citiesDiv).forEach((element, i) =>
      element.addEventListener("click", (e) => {
        if (i !== 4) {
          this.loadData(element.dataset.lat, element.dataset.lng);
        }
      })
    );

    // Adding keyup listener for ng user input
    Array.from(searchInputs).forEach((element, i) =>
      element.addEventListener("keyup", (e) => {
        this.checkPressedKey(e);
      })
    );

    // Adding event listener of click on custom city
    customCity.addEventListener("click", this.setCustomCity);

    // Get user position and print data
    this.getPosition();

    // Fetch cities from world-cities API
    this.loadCities();

    // Load map for Poznan
    this.loadMap(52.409538, 16.931992);
  }

  async loadCities() {
    this.citiesArray = await fetch(
      `https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json`
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => console.error(err));
  }

  // Getting user position -> lat and lng
  getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.convertGeolocationItemToCoords.bind(this),
        () => {
          // If failed load data for Poznan
          this.loadData(52.409538, 16.931992);
        }
      );
  }

  // Success fall back for getPosition()
  convertGeolocationItemToCoords(position) {
    this.loadData(position.coords.latitude, position.coords.longitude);
  }

  // Loading data -> weather, location, forecast,
  async loadData(lat, lng) {
    util.removeChildren(forecastContainer);
    forecastContainer.insertAdjacentHTML(
      "afterbegin",
      '<div class="loader"></div>'
    );
    widget.style.opacity = "0";

    util.removeActiveClassFromImages();

    let location = await model.getCityName(lat, lng).then((loc) => loc);

    let airQuality = await model
      .getAirQualityData(lat, lng)
      .then((quality) => quality);

    const weatherData = await model.getWeatherData(lat, lng);

    view.displayWidget(
      weather.getWeatherWidgetObject(weatherData, location, airQuality)
    );

    view.displayForecasts(weatherData);
  }

  // Getting location using from city name
  async getLocationFromName(cityName) {
    return await fetch(
      `${LIQ_API_URL}/search.php?key=${LIQ_API_KEY}&format=json&q=${cityName}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Could not find given city, try again.");
          throw new Error("Could not find given city");
        }
        this.loadData(data[0].lat, data[0].lon);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // If input is target and enter was pressed search for input value
  async checkPressedKey(e) {
    const searchSuggestion = e.target
      .closest("div")
      .querySelector(".search__suggestions");

    searchSuggestion.classList.remove("search__suggestions--hidden");

    if (e.keyCode === 13) {
      // Guard
      if (!e.target.value) {
        return;
      }

      await this.getLocationFromName(e.target.value);
      util.clearInput(e.target);
      util.removeActiveClassFromImages();
    }

    // Searching through cities only when input value length >= 2
    if (e.target.value.length >= 2) {
      util.removeChildren(searchSuggestion);

      searchSuggestion.appendChild(
        this.createSuggestionContent(e, this.citiesArray)
      );
    }

    if (e.target.value.length < 2) {
      util.removeChildren(searchSuggestion);
    }
  }

  // Creating search suggestion li content
  createSuggestionLiElement = function (data, e) {
    const city = document.createElement("LI");
    city.classList.add("search__suggestions__item");
    city.textContent = `${data.name}, ${data.country} `;
    city.addEventListener("click", () => {
      this.getLocationFromName(data.name);
      util.clearInput(e.target);
    });

    return city;
  };

  createSuggestionContent = function (e, citiesArray) {
    let cities = citiesArray.filter(
      (el) =>
        removePolishAccents(el.name)
          .toLowerCase()
          .search(removePolishAccents(e.target.value.toLowerCase())) !== -1
    );

    const suggestionsContent = new DocumentFragment();

    // Displaying only 4 first results
    for (let i = 0; i < 4; i++) {
      // Break if cities[i] does not exist
      if (!cities[i]) break;
      suggestionsContent.appendChild(
        this.createSuggestionLiElement(cities[i], e)
      );
    }
    return suggestionsContent;
  };

  // Load leafty map
  loadMap(lat, lng) {
    const coords = [lat, lng];

    this.map = L.map("map").setView(coords, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Handling clicks on map
    this.map.on("click", (event) => {
      mapContainer.classList.add("map--hidden");
      ({ lat, lng } = event.latlng);
      this.loadData(lat, lng);
    });
  }

  // Setting custom city
  setCustomCity = () => {
    customCityName.textContent = widgetLocation.textContent;
    [customCity.dataset.lat, customCity.dataset.lng] = [
      widget.dataset.lat,
      widget.dataset.lng,
    ];
    customCityImg.src =
      "https://source.unsplash.com/random/1920x1080?city,village";
    customCityImg.alt = customCity.textContent;
    customCity.removeEventListener("click", this.setCustomCity);

    // Get location data when clicked on image
    customCity.addEventListener("click", () => {
      this.loadData(customCity.dataset.lat, customCity.dataset.lng);
    });
  };
}
