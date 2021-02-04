"use strict";

import * as model from "../model";
import * as util from "../util/utility";

import { DEFAULT_COORDS, DRAW_RANDOM_IMG } from "../config";
import { createSuggestionContent } from "../util/search";
import { Map } from "../map/map";

import { setCustomCity } from "../customCity/customCity";

import "../eventListeners/eventListeners.js";

// VARIABLES FOR SEARCH
const searchInputs = document.querySelectorAll(".search");

// VARIABLES FOR WIDGET
const widget = document.querySelector(".widget");
const widgetLocation = document.querySelector(".widget__location");

// VARIABLES FOR IMAGES
const cityContainers = document.querySelectorAll(".select-place__city");

// VARIABLES FOR ADDING CURRENT(CUSTOM) CITY
const customCity = document.querySelector(".custom-city");

export default class App {
  // Cities names' array
  citiesArray;

  constructor() {
    // EVENT LISTENERS

    // Setting load data for images from select-city div
    Array.from(cityContainers).forEach((element, i) =>
      element.addEventListener("click", (e) => {
        if (i !== 4) {
          model.loadData(element.dataset.lat, element.dataset.lng);
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
    customCity.addEventListener("click", setCustomCity);

    // Get user position and print data
    this.getPosition();

    // Setting up Array with cities' names
    this.setupCitiesArray();

    // Load map for Poznan
    new Map(...DEFAULT_COORDS);
  }

  // Getting user position -> lat and lng
  async getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.loadDataFromCurrentPosition.bind(this),
        () => {
          // If failed load data for DEFAULT_COORDS
          model.loadData(...DEFAULT_COORDS);
        }
      );
  }

  // Fetch cities from world-cities API
  async setupCitiesArray() {
    this.citiesArray = await model.loadCities();
  }

  // Success fall back for getPosition()
  loadDataFromCurrentPosition(position) {
    model.loadData(position.coords.latitude, position.coords.longitude);
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

      await model.loadDataFromCityName(e.target.value);
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
        createSuggestionContent(e, this.citiesArray)
      );
    }
  }
}
