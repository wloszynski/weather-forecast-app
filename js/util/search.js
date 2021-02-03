import { removePolishAccents } from "./utility.js";

// Creating search suggestion li content
const createSuggestionLiElement = function (data, e) {
  const city = document.createElement("LI");
  city.classList.add("search__suggestions__item");
  city.textContent = `${data.name}, ${data.country} `;
  city.addEventListener("click", () => {
    this.getLocationFromName(data.name);
    util.clearInput(e.target);
  });

  return city;
};

export const createSuggestionContent = function (e, citiesArray) {
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
    suggestionsContent.appendChild(createSuggestionLiElement(cities[i], e));
  }
  return suggestionsContent;
};
