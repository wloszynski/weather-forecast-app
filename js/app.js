"use strict";

import * as model from "./model.js";
import * as weather from "./weather/weather.js";
import * as util from "./util/utility.js";
import * as view from "./view/view.js";

import { MAP_ZOOM, DEFAULT_COORDS, SUGGESTIONS_LIMIT } from "./config.js";

import "./eventListeners/eventListeners.js";

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
const cityContainers = document.querySelectorAll(".select-place__city");

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
    Array.from(cityContainers).forEach((element, i) =>
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

    // Setting up Array with cities' names
    this.setupCitiesArray();

    // Load map for Poznan
    this.loadMap(...DEFAULT_COORDS);
  }

  // Getting user position -> lat and lng
  async getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.loadDataFromCurrentPosition.bind(this),
        () => {
          // If failed load data for DEFAULT_COORDS
          this.loadData(...DEFAULT_COORDS);
        }
      );
  }

  // Fetch cities from world-cities API
  async setupCitiesArray() {
    this.citiesArray = await model.loadCities();
  }

  // Success fall back for getPosition()
  loadDataFromCurrentPosition(position) {
    this.loadData(position.coords.latitude, position.coords.longitude);
  }

  // Loading data -> weather, location, forecast,
  async loadData(lat, lng) {
    util.loadingSpinnerInElement(forecastContainer);

    util.hideElementOpacity(widget);

    util.removeActiveClassFromImages();

    const location = await model.getCityName(lat, lng).then((loc) => loc);

    const [airQuality, weatherData] = await Promise.all([
      await model.getAirQualityData(lat, lng).then((quality) => quality),
      await model.getWeatherData(lat, lng),
    ]);

    // Display data in widget
    view.displayWidget(
      weather.getWeatherWidgetObject(weatherData, location, airQuality)
    );

    // Display data in forecast information
    view.displayForecasts(weatherData);
  }

  // Getting location using from city name
  async loadDataFromCityName(cityName) {
    const coords = await model.getCoordsFromCityName(cityName);
    await this.loadData(...coords);
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

      await this.loadDataFromCityName(e.target.value);
      util.clearInput(e.target);
      util.removeActiveClassFromImages();
    }

    // For clearing search suggestions
    if (e.target.value.length < 2) {
      util.removeChildren(searchSuggestion);
    }

    // Searching through cities only when input value length >= 2
    if (e.target.value.length >= 2) {
      util.removeChildren(searchSuggestion);

      // Display search suggestions
      searchSuggestion.appendChild(
        this.createSuggestionContent(e, this.citiesArray)
      );
    }
  }

  // Creating search suggestion li content
  createSuggestionLiElement(data, e) {
    const city = document.createElement("LI");
    city.classList.add("search__suggestions__item");
    city.textContent = `${data.name}, ${data.country} `;
    city.addEventListener("click", () => {
      // Load data from location name
      this.loadDataFromCityName(data.name);

      // Clear input
      util.clearInput(e.target);
    });

    return city;
  }

  createSuggestionContent(e, citiesArray) {
    let cities = citiesArray.filter(
      (el) =>
        util
          .removePolishAccents(el.name)
          .toLowerCase()
          .search(util.removePolishAccents(e.target.value.toLowerCase())) !== -1
    );

    const suggestionsContent = new DocumentFragment();

    // Displaying only 4 first results
    for (let i = 0; i < SUGGESTIONS_LIMIT; i++) {
      // Break if cities[i] does not exist
      if (!cities[i]) break;
      suggestionsContent.appendChild(
        this.createSuggestionLiElement(cities[i], e)
      );
    }
    return suggestionsContent;
  }

  // Load leafty map
  loadMap(lat, lng) {
    const coords = [lat, lng];

    this.map = L.map("map").setView(coords, MAP_ZOOM);

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
