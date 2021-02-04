import * as util from "./utility";
import { SUGGESTIONS_LIMIT } from "../config";
import { loadDataFromCityName } from "../model";

// Creating search suggestion li content
const createSuggestionLiElement = function (data, e) {
  const city = document.createElement("LI");
  city.classList.add("search__suggestions__item");
  city.textContent = `${data.name}, ${data.country} `;
  city.addEventListener("click", () => {
    // Load data from location name
    loadDataFromCityName(data.name);

    // Clear input
    util.clearInput(e.target);
  });

  return city;
};

export const createSuggestionContent = function (e, citiesArray) {
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
    suggestionsContent.appendChild(createSuggestionLiElement(cities[i], e));
  }
  return suggestionsContent;
};
