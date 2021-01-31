"use strict";

import { OWM_API_KEY } from "./config.js";

// VARIABLES FOR SEARCH
const widgetSearch = document.querySelector(".search__input");
const searchInputs = document.querySelectorAll(".search");

// VARIABLES FOR WIDGET
const aside = document.querySelector(".aside");
const widget = document.querySelector(".selected-weather");
const widgetTemp = document.querySelector(".selected-weather__temp");
const widgetLocation = document.querySelector(".selected-weather__location");
const widgetFeelsLike = document.querySelector(
  ".selected-weather__additional-feel-temp"
);
const widgetSunset = document.querySelector(".additional-sunset-time");
const widgetAirQuality = document.querySelector(
  ".selected-weather__air-quality"
);
const widgetChanceOfRain = document.querySelector(
  ".chance-of-rain__info-percentage"
);
const widgetDate = document.querySelector(".selected-weather__date-content");
const widgetPhoto = document.querySelector("#widgetPhoto");

// VARIABLES FOR WEATHER FORECAST
const forecastContainer = document.querySelector(
  ".weather-information__details-container"
);

// VARIABLES FOR IMAGES
const cityContainer = document.querySelector(".select-place__cities");
const citiesDiv = document.querySelectorAll(".select-place__city");

// VARIABLE FOR GRADIENT BACKGROUND
const gradientBg = document.querySelector(".gradientBg");

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
      widgetSearch.classList.remove("search__input--open");
    }
    if (!event.target.classList.contains("search__input--open")) {
      document
        .querySelector("#searchCity")
        .classList.remove("search__input--open");
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

class Weather {
  constructor(location, temp, clouds, chanceOfRain, date) {
    this.location = location;
    this.temp = temp;
    this.clouds = clouds;
    this.chanceOfRain = chanceOfRain;
    this.date = date;
  }
}

// Change color theme when later than 6:OOPM
const date = new Date();
const hours = date.getHours();

if (hours < 18) {
  aside.style.backgroundImage = 'url("../img/landscape-light.svg")';
  aside.style.color = "#0008";
  gradientBg.style.background = "linear-gradient(to top,#008cbc,#b1dee8)";
} else {
  aside.style.backgroundImage = 'url("../img/sky.svg")';
  aside.style.color = "white";
  gradientBg.style.background = "linear-gradient(to top,#004e92,#000428)";
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
  weatherWidget;

  constructor() {
    // VARIABLES FOR CITIES LOCATIONS
    const locations = new Array(
      [52.409538, 16.931992],
      [52.229676, 21.012229],
      [60.192059, 24.945831],
      [48.1351253, 11.5819806],
      [40.73061, -73.935242]
    );

    // EVENT LISTENERS
    Array.from(citiesDiv).forEach((element, i) =>
      element.addEventListener("click", (e) => {
        this.loadData(locations[i][0], locations[i][1]);
      })
    );

    Array.from(searchInputs).forEach((element, i) =>
      element.addEventListener("keypress", (e) => {
        this.checkPressedKey(e);
      })
    );

    // Get user position and print data
    this.getPosition();
  }

  // Getting user position -> lat and lng
  getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.convertGeolocationItemToCoords.bind(this),
        () => {
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
    forecastContainer.innerHTML = '<div class="loader">Loading...</div>';
    widget.style.opacity = "0";

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
            alert("Could not find provided city, try again.");
            throw new Error("Could not find provided city");
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
    widgetTemp.innerHTML = `${weatherWidget.temp}<sup class="selected-weather__temp-sup">&#8451;</sup>`;
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
      <div class="weather-information__details">
            <span class="weather-information__details__title">${this.getDayOfTheWeek(
              data.dt
            )}</span>
            <div class="weather-information__details__image">
              <img src="./img/${this.checkIfCloudy(data.clouds)}.svg" alt="" />
            </div>
            <span class="weather-information__details__temp">+20°C</span>
            <div class="weather-information__details__humidity">
              <span>${data.humidity}%</span>
            </div>
            <div class="weather-information__details__wind">
              <span>${data.wind_speed}</span>
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

  //
  async checkPressedKey(e) {
    if (e.keyCode === 13) {
      // Guard
      if (!e.target.value) {
        return;
      }

      await this.getLocationFromName(e.target.value);
      e.target.value = "";
      e.target.blur();

      e.target.classList.remove("search__input--open");

      removeActiveClassFromImages();
    }
  }
}

new App();
