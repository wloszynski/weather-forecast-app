"use strict";

import { OWM_API_KEY } from "./config.js";

// VARIABLES FOR SEARCH
const searchInputs = document.querySelectorAll(".search");
const widgetSearch = document.querySelector(".search__input");
const searchIcons = document.querySelectorAll(".search__icon");
const searchSuggestions = document.querySelectorAll(".search__suggestions");

// VARIABLES FOR WIDGET
const aside = document.querySelector(".aside");
const widget = document.querySelector(".widget");
const widgetTemp = document.querySelector(".widget__temp");
const widgetLocation = document.querySelector(".widget__location");
const widgetFeelsLike = document.querySelector(".widget__additional-feel-temp");
const widgetSunset = document.querySelector(".additional-sunset-time");
const widgetAirQuality = document.querySelector(".widget__air-quality");
const widgetChanceOfRain = document.querySelector(
  ".widget__humidity-percentage"
);
const widgetDate = document.querySelector(".widget__date-content");
const widgetPhoto = document.querySelector("#widgetPhoto");

// VARIABLES FOR WEATHER FORECAST
const forecastContainer = document.querySelector(
  ".weather-information__details"
);

// VARIABLES FOR IMAGES
const cityContainer = document.querySelector(".select-place__cities");
const citiesDiv = document.querySelectorAll(".select-place__city");

// VARIABLE FOR GRADIENT BACKGROUND
const gradientBg = document.querySelector(".gradientBg");

// VARIABLES FOR MAP
const mapContainer = document.querySelector(".map");
const mapIcon = document.querySelector(".map__icon");

// VARIABLES FOR ADDING CURRENT(CUSTOM) CITY
const customCity = document.querySelector(".custom-city");
const customCityImg = document.querySelector(".custom-city__img");
const customCityName = document.querySelector(".custom-city__name");

// EVENT LISTENERS

// Logo as theme switch
document.querySelector("#logo").addEventListener("click", () => {
  // background-image: url("../img/windows_wallpaper.jpg");
  if (aside.style.backgroundImage === 'url("../img/landscape-light.svg")') {
    aside.style.backgroundImage = 'url("../img/sky.svg")';
    aside.style.color = "white";
    gradientBg.style.background = "linear-gradient(to top,#004e92,#000428)";
  } else {
    aside.style.backgroundImage = 'url("../img/landscape-light.svg")';
    aside.style.color = "#0008";
    gradientBg.style.background = "linear-gradient(to top,#008cbc,#b1dee8)";
  }
});

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
          clearInput(searchInput);
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

// Remove active from images
const removeActiveClassFromImages = () => {
  Array.from(citiesDiv).forEach((el) => {
    el.querySelector(".select-place__city-image").classList.remove("active");
  });
};

// Showing activated image
cityContainer.addEventListener("click", (e) => {
  if (!e.target.closest(".select-place__city")) {
    return;
  }

  removeActiveClassFromImages();

  e.target
    .closest(".select-place__city")
    .querySelector(".select-place__city-image")
    .classList.add("active");
});

// Showing map on map__icon click
mapIcon.addEventListener("click", () => {
  mapContainer.classList.remove("map--hidden");
});

// FUNCTIONS

// Clear input element and blur
const clearInput = (inputElement) => {
  inputElement.value = "";
  inputElement.blur();
  inputElement.classList.remove("search__input--open");
  inputElement
    .closest("div")
    .querySelector(".search__suggestions")
    .classList.add("search__suggestions--hidden");
};

// Remove all children from parent element
const removeChildren = (parentElement) => {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
};

// Change color theme when later than 6:OOPM
const date = new Date();
const hours = date.getHours();

if (hours > 8 && hours < 18) {
  aside.style.backgroundImage = 'url("../img/landscape-light.svg")';
  aside.style.color = "#0008";
  gradientBg.style.background = "linear-gradient(to top,#008cbc,#b1dee8)";
} else {
  aside.style.backgroundImage = 'url("../img/sky.svg")';
  aside.style.color = "white";
  gradientBg.style.background = "linear-gradient(to top,#004e92,#000428)";
}

// Replacing polish characters to latin
const removePolishAccents = (string) => {
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

// basic class for weather

class Weather {
  constructor(location, temp, clouds, chanceOfRain, date) {
    this.location = location;
    this.temp = temp;
    this.clouds = clouds;
    this.chanceOfRain = chanceOfRain;
    this.date = date;
  }
}

// class for the weather-widget div
class WeatherWidget extends Weather {
  constructor(
    location,
    temp,
    clouds,
    chanceOfRain,
    date,
    feelsLike,
    sunset,
    airQuality
  ) {
    super(location, temp, clouds, chanceOfRain, date);
    this.feelsLike = feelsLike;
    this.sunset = sunset;
    this.airQuality = airQuality;
  }
}

// class for the weather-forecast div
class WeatherForecast extends Weather {
  constructor(location, temp, clouds, date, chanceOfRain, minTemp, maxTemp) {
    super(location, temp, clouds, chanceOfRain, date);
    this.minTemp = minTemp;
    this.maxTemp = maxTemp;
  }
}

class App {
  // weather variables
  weatherWidget;
  citiesArray;

  // map variables
  map;
  mapZoomLevel = 13;
  mapEvent;

  constructor() {
    // VARIABLES FOR CITIES LOCATIONS
    const locations = new Array(
      [52.409538, 16.931992],
      [52.229676, 21.012229],
      [60.192059, 24.945831],
      [48.1351253, 11.5819806]
    );

    // EVENT LISTENERS
    Array.from(citiesDiv).forEach((element, i) =>
      element.addEventListener("click", (e) => {
        if (i !== 4) {
          this.loadData(locations[i][0], locations[i][1]);
        }
      })
    );

    // Adding keyup listener for checking user input
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
    forecastContainer.innerHTML = '<div class="loader"></div>';
    widget.style.opacity = "0";
    removeActiveClassFromImages();

    let airQuality = await this.getAirQualityData(lat, lng).then(
      (quality) => quality
    );

    let location = await this.getCityName(lat, lng).then((loc) => loc);

    const weatherData = await this.getWeatherData(lat, lng);

    this.displayWidget(
      this.getWeatherWidgetObject(weatherData, location, airQuality)
    );

    this.displayForecasts(weatherData);
  }

  // Getting location using lat and lng -> Wroclaw, PL
  async getCityName(lat, lng) {
    return await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
      .then((response) => response.json())
      .then((data) => {
        return `${data.city}, ${data.country}`;
      })
      .catch((err) => console.error(err));
  }

  // Getting location using from city name
  async getLocationFromName(cityName) {
    return await fetch(`https://geocode.xyz/${cityName}?json=1`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.latt) {
          if (data.error.code === "018") {
            alert("Could not find given city, try again.");
            throw new Error("Could not find given city");
          }
          if (data.error.code === ("006" || "008")) {
            alert("Request Throttled. Over Rate limit: up to 2 per sec.");
            throw new Error(
              "Request Throttled. Over Rate limit: up to 2 per sec."
            );
          }
        }
        this.loadData(data.latt, data.longt);
      })
      .catch((err) => {});
  }

  async getWeatherData(lat, lng) {
    return await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${OWM_API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((err) => console.error(err));
  }

  // Fetching Air Quality from OWM Air Pollution API
  // Returns Good / Fair / Moderate / Poor / Very Poor
  async getAirQualityData(lat, lng) {
    return await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${OWM_API_KEY}`
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
  }

  // Creating WeatherWidgetObject
  getWeatherWidgetObject(data, location, airQuality) {
    const { temp, clouds, feels_like, sunset, humidity } = data.current;
    return new WeatherWidget(
      location,
      temp.toFixed(1),
      clouds,
      humidity,
      this.shortDateFormat(),
      feels_like,
      this.convertUnixToTime(sunset),
      airQuality
    );
  }

  // Creating WeatherForecast Object
  getWeatherForecastObject(
    location,
    temp,
    clouds,
    date,
    chanceOfRain,
    minTemp,
    maxTemp
  ) {
    return new WeatherForecast(
      location,
      temp,
      clouds,
      date,
      chanceOfRain,
      minTemp,
      maxTemp
    );
  }

  // Creating WeatherForecast Array
  getWeatherForecastArray() {}

  // Converting Unix dt to HH:MM
  convertUnixToTime(dt) {
    const date = new Date(dt * 1000);
    return `${date.getHours()}:${date.getMinutes()}`;
  }

  // Convert date to Fri, Jan 29
  getDayOfTheWeek(dt) {
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
  }

  // Convert dt to weekday
  shortDateFormat() {
    const fullDate = Date();
    const fullDateArray = fullDate.split(" ");
    return `${fullDateArray[0]}, ${fullDateArray[1]} ${fullDateArray[2]}`;
  }

  // Displaying data in widget section
  displayWidget(weatherWidget) {
    widgetTemp.innerHTML = `${weatherWidget.temp}<sup class="widget__temp-sup">&#8451;</sup>`;
    widgetLocation.textContent = weatherWidget.location;
    widgetAirQuality.textContent = weatherWidget.airQuality;
    widgetChanceOfRain.textContent = weatherWidget.chanceOfRain;
    widgetFeelsLike.textContent = weatherWidget.feelsLike.toFixed(1);
    widgetSunset.textContent = weatherWidget.sunset;
    widgetDate.textContent = weatherWidget.date;

    widgetPhoto.src = `../img/${this.checkIfCloudy(weatherWidget.clouds)}.svg`;
  }

  // Displaying weather forecast
  displayForecasts(weatherData) {
    let weatherForecasts = new Array();

    // Deleting 8th array
    weatherData = weatherData.daily.splice(1, 5);

    for (const data of weatherData) {
      const forecast = `
      <div class="weather-information__details__item">
            <span class="weather-information__details__item__title">${this.getDayOfTheWeek(
              data.dt
            )}</span>
            <div class="weather-information__details__item__image">
            <img src="./img/${this.checkIfCloudy(data.clouds)}.svg" alt="" />
            </div>
            <span class="weather-information__details__item__temp">${
              data.temp.day > 0 ? "+" + data.temp.day : data.temp.day
            }°C</span>
            <div class="weather-information__details__item__humidity">
              <span><i class="fas fa-tint"></i> ${data.humidity}%</span>
            </div>
            <div class="weather-information__details__item__wind">
              <span><i class="fas fa-wind"></i> ${data.wind_speed} m/s</span>
            </div>
          </div>`;

      weatherForecasts.push(forecast);
    }

    widget.style.opacity = "1";
    forecastContainer.innerHTML = weatherForecasts.join(" ");
  }

  // Checking the cloud percentage and defining which photo should be selected
  checkIfCloudy(cloudy) {
    if (cloudy < 20) {
      return 0;
    } else if (cloudy < 40) {
      return 1;
    } else if (cloudy < 60) {
      return 2;
    } else if (cloudy < 80) {
      return 3;
    } else if (cloudy < 100) {
      return 4;
    }

    return 0;
  }

  // If input is target and enter was pressed search for input value
  async checkPressedKey(e) {
    const searchSuggestion = e.target
      .closest("div")
      .querySelector(".search__suggestions");

    searchSuggestion.classList.remove("search__suggestions--hidden");

    let cities = [];

    if (e.keyCode === 13) {
      // Guard
      if (!e.target.value) {
        return;
      }

      await this.getLocationFromName(e.target.value);
      clearInput(e.target);
      removeActiveClassFromImages();
    } else if (e.target.value.length >= 2) {
      removeChildren(searchSuggestion);

      cities = this.citiesArray.filter(
        (el) =>
          removePolishAccents(el.name)
            .toLowerCase()
            .search(removePolishAccents(e.target.value.toLowerCase())) !== -1
      );

      const suggestionsContent = new DocumentFragment();

      // Displaying only 4 first results
      for (let i = 0; i < 4; i++) {
        // Guard if cities[i] does not exist
        if (!cities[i]) break;
        suggestionsContent.appendChild(
          this.createSuggestionLiElement(cities[i], e)
        );
      }
      searchSuggestion.appendChild(suggestionsContent);
    } else {
      removeChildren(searchSuggestion);
    }
  }

  // Creating search suggestion li content
  createSuggestionLiElement(data, e) {
    const city = document.createElement("LI");
    city.classList.add("search__suggestions__item");
    city.textContent = `${data.name}, ${data.country} `;
    city.addEventListener("click", () => {
      this.getLocationFromName(data.name);
      clearInput(e.target);
    });

    return city;
  }

  // Load map
  loadMap(lat, lng) {
    // console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);

    const coords = [lat, lng];

    this.map = L.map("map").setView(coords, this.mapZoomLevel);

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
  setCustomCity = (e) => {
    customCityName.textContent = widgetLocation.textContent;
    customCityImg.src =
      "https://source.unsplash.com/random/1920x1080?city,village";
    customCityImg.alt = customCity.textContent;
    customCity.removeEventListener("click", this.setCustomCity);

    customCity.addEventListener("click", () => {
      this.getLocationFromName(customCityName.textContent);
    });
  };
}

new App();
