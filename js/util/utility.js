import { NODE_API_URL } from "../config";

const citiesDiv = document.querySelectorAll(".select-place__city");

// UTILITY FUNCTIONS

// Replacing polish characters to latin
export const removePolishAccents = (string) => {
  const accents =
    "ÀÁÂÃÄÅĄàáâãäåąßÒÓÔÕÕÖØÓòóôõöøóÈÉÊËĘèéêëęðÇĆçćÐÌÍÎÏìíîïÙÚÛÜùúûüÑŃñńŠŚšśŸÿýŽŻŹžżź";
  const accentsOut =
    "AAAAAAAaaaaaaaBOOOOOOOOoooooooEEEEEeeeeeeCCccDIIIIiiiiUUUUuuuuNNnnSSssYyyZZZzzz";
  return string
    .split("")
    .map((letter, index) => {
      const accentIndex = accents.indexOf(letter);
      return accentIndex !== -1 ? accentsOut[accentIndex] : letter;
    })
    .join("");
};

// Converting Unix dt to HH:MM
export const convertUnixToTime = (dt) => {
  const date = new Date(dt * 1000);
  return `${date.getHours()}:${date.getMinutes()}`;
};

// Convert date to Fri, Jan 29
export const getDayOfTheWeek = (dt) => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayNum = new Date(dt * 1000).getDay();

  return weekdays[dayNum];
};

// Convert dt to weekday
export const shortDateFormat = () => {
  const fullDate = Date();
  const fullDateArray = fullDate.split(" ");
  return `${fullDateArray[0]}, ${fullDateArray[1]} ${fullDateArray[2]}`;
};

// Remove all children from parent element
export const removeChildren = (parentElement) => {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
};

// Clear input element and blur
export const clearInput = (inputElement) => {
  inputElement.value = "";
  inputElement.blur();
  inputElement.classList.remove("search__input--open");
  inputElement
    .closest("div")
    .querySelector(".search__suggestions")
    .classList.add("search__suggestions--hidden");
};

export const removeActiveClassFromImages = () => {
  Array.from(citiesDiv).forEach((el) => {
    el.querySelector(".select-place__city-image").classList.remove("active");
  });
};

export const loadingSpinnerInElement = function (element) {
  removeChildren(element);
  element.insertAdjacentHTML("afterbegin", '<div class="loader"></div>');
};

export const hideElementOpacity = function (element) {
  element.style.opacity = 0;
};

export const drawRandomImage = async function () {
  const randomImageUrl = await fetch(`${NODE_API_URL}/randomImageUrl`);
  return randomImageUrl.url;
};

export const resetThingForLoadingData = (forecastContainer, widget) => {
  loadingSpinnerInElement(forecastContainer);

  hideElementOpacity(widget);

  removeActiveClassFromImages();
};
