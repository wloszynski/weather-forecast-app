"use strict";

import { OWM_API_KEY, GC_API_KEY } from "./config.js";

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

// VARIABLES FOR SEARCH
const searchCity = document.querySelector("#searchCity");

// VARIABLES FOR WIDGET
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
const citiesDiv = document.querySelectorAll(".select-place__city");

class App {
  weatherWidget;

  constructor() {
    this.getPosition();

    // Adding Event Listeners
    document
      .querySelectorAll(".select-place__city")[0]
      .addEventListener("click", () => {
        this.loadData(52.409538, 16.931992);
      });

    document
      .querySelectorAll(".select-place__city")[1]
      .addEventListener("click", () => {
        this.loadData(52.229676, 21.012229);
      });

    document
      .querySelectorAll(".select-place__city")[2]
      .addEventListener("click", () => {
        this.loadData(60.16952, 24.93545);
      });

    document
      .querySelectorAll(".select-place__city")[3]
      .addEventListener("click", () => {
        this.loadData(48.137154, 11.576124);
      });

    document
      .querySelectorAll(".select-place__city")[4]
      .addEventListener("click", () => {
        this.loadData(40.7127837, -74.0059413);
      });

    document.querySelector("#searchCity").addEventListener("keypress", (e) => {
      this.searchQuery(e);
    });

    document
      .querySelector("#searchCityMob")
      .addEventListener("keypress", (e) => {
        this.searchQuery(e);
      });
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
    let airQuality = await this.getAirQualityData(lat, lng).then(
      (quality) => quality
    );

    let location = await this.getLocation(lat, lng).then((loc) => loc);

    const weatherData = await this.getWeatherData(lat, lng);

    this.displayWidget(
      this.getWeatherWidgetObject(weatherData, location, airQuality)
    );

    this.displayForecasts(weatherData);
  }

  // Getting location using lat and lng -> Wroclaw, PL
  async getLocation(lat, lng) {
    return await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
      .then((response) => response.json())
      .then((data) => data.city)
      .catch((err) => console.error(err));
  }

  // Getting location using from city name
  async getLocationFromName(cityName) {
    return await fetch(
      `https://geocode.xyz/${cityName}?json=1$auth=${GC_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.latt) {
          if (data.error.code === "018") {
            alert("Could not find provided city, try again.");
            throw new Error("Could not find provided city");
          }
          if (data.error.code === "006") {
            alert("Request Throttled. Over Rate limit: up to 2 per sec.");
            throw new Error(
              "Request Throttled. Over Rate limit: up to 2 per sec."
            );
          }
        }
        console.log(data);
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

    widgetPhoto.src = `../img/${this.checkIfCloudy(weatherWidget.cloud)}.svg`;
  }

  // Displaying weather forecast
  displayForecasts(weatherData) {
    let weatherForecasts = new Array();

    // Deleting 8th array
    weatherData = weatherData.daily.splice(0, 7);

    for (const data of weatherData) {
      const forecast = `
                <div class="weather-information__details">
                  <div class="weather-information-date">${this.getDayOfTheWeek(
                    data.dt
                  )}</div>
                  <div class="weather-information-rain">

                    <span class="weather-information-rain__chance">${
                      data.humidity
                    }% </span>
                     <img src="../img/001-drop.svg" alt="drop">
                  </div>
                  <div class="weather-information-sky">
                    <img src="./img/${this.checkIfCloudy(
                      data.clouds
                    )}.svg" alt="weather">
                  </div>
                  <div class="weather-information-min">${data.temp.min.toFixed(
                    1
                  )}<sup>℃</sup>
                    <img src="../img/minTemp.svg" alt="drop">
                  </div>
                  <div class="weather-information-max">${data.temp.max.toFixed(
                    1
                  )}<sup>℃</sup>
                    <img src="../img/maxTemp.svg" alt="drop">
                  </div>
                </div>
                `;
      weatherForecasts.push(forecast);
    }

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

  async searchQuery(e) {
    if (e.keyCode === 13) {
      await this.getLocationFromName(e.target.value);
      e.target.value = "";
      e.target.blur();
    }
  }
}

new App();

// VARIABLES
const aside = document.querySelector(".aside");

// EVENT LISTENERS
document.querySelector("#logo").addEventListener("click", () => {
  // background-image: url("../img/windows_wallpaper.jpg");
  if (aside.style.backgroundImage === 'url("../img/landscape-light.svg")') {
    aside.style.backgroundImage = 'url("../img/sky.svg")';
    aside.style.color = "white";
  } else {
    aside.style.backgroundImage = 'url("../img/landscape-light.svg")';
    aside.style.color = "#0008";
  }
});
