import * as util from "../util/utility.js";

const cityContainer = document.querySelector(".select-place__cities");

const mapContainer = document.querySelector(".map");
const mapIcon = document.querySelector(".map__icon");

// VARIABLES FOR SEARCH
const searchInputs = document.querySelectorAll(".search");
const searchSuggestions = document.querySelectorAll(".search__suggestions");

// EVENT LISTENERS

// Showing input when search icon clicked
Array.from(document.querySelectorAll(".search__icon")).forEach((element) =>
  element.addEventListener("click", (e) => {
    if (e.target.id === "desktopSearch") {
      document
        .querySelector("#searchCity")
        .classList.toggle("search__input--open");

      document.querySelector("#searchCity").focus();
    } else {
      document
        .querySelector("#searchCityMob")
        .classList.toggle("search__input--open");

      document.querySelector("#searchCityMob").focus();
    }
  })
);

// Hiding input if clicked outside of search
document.addEventListener(
  "click",
  (event) => {
    if (!event.target.classList.contains("search__input--open")) {
      searchInputs.forEach((input) => {
        {
          const searchInput = input.querySelector(".search__input");
          util.clearInput(searchInput);
          searchInput.classList.remove("search__input--open");
        }
      });

      searchSuggestions.forEach((searchSuggestion) => {
        {
          searchSuggestion.classList.add("search__suggestions--hidden");
        }
      });
    }
  },
  true
);

// Showing activated image
cityContainer.addEventListener("click", (e) => {
  if (!e.target.closest(".select-place__city")) {
    return;
  }

  util.removeActiveClassFromImages();

  e.target
    .closest(".select-place__city")
    .querySelector(".select-place__city-image")
    .classList.add("active");
});

// Showing map on map__icon click
mapIcon.addEventListener("click", () => {
  mapContainer.classList.remove("map--hidden");
});
