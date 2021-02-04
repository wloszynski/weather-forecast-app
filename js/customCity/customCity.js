import * as util from "../util/utility";
import * as model from "../model";
import customCityAdd from "../../img/add.svg";

// VARIABLES FOR WIDGET
const widget = document.querySelector(".widget");
const widgetLocation = document.querySelector(".widget__location");

// VARIABLES FOR ADDING CURRENT(CUSTOM) CITY
const customCity = document.querySelector(".custom-city");
const customCityImg = document.querySelector(".custom-city__img");
const customCityName = document.querySelector(".custom-city__name");
const customCityRemoveIcon = document.querySelector(
  ".custom-city__remove-city__icon"
);

// Setting custom city
export const setCustomCity = async function () {
  // Setting custom city properties - alt, src, datasets
  setCustomCityProperties();

  // Get location data when clicked on image
  customCity.addEventListener("click", () => {
    if (customCity.dataset?.lat) {
      model.loadData(customCity.dataset.lat, customCity.dataset.lng);
    }
  });

  customCityRemoveIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    clearCustomCityBox();

    customCity.addEventListener("click", setCustomCity);
  });
};

// Setting custom city properties - alt, src, datasets
const setCustomCityProperties = async function () {
  customCityRemoveIcon.style.visibility = "visible";

  customCityName.textContent = widgetLocation.textContent;
  [customCity.dataset.lat, customCity.dataset.lng] = [
    widget.dataset.lat,
    widget.dataset.lng,
  ];
  customCityImg.src = await util.drawRandomImage();
  customCityImg.alt = customCity.textContent;
  customCity.removeEventListener("click", setCustomCity);
};

// Setting custom city box to default values
const clearCustomCityBox = () => {
  customCityRemoveIcon.style.visibility = "hidden";
  util.removeActiveClassFromImages();
  customCityImg.src = customCityAdd;
  customCityName.textContent = "Add current city";

  [customCity.dataset.lat, customCity.dataset.lng] = ["", ""];
};
