"use strict";

import { API_KEY } from "./config.js";

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
    // VARIABLES FOR CITIES LOCATIONS
    const locations = new Array([
      [52.409538, 16.931992],
      [52.229676, 21.012229],
      [60.192059, 24.945831],
      [48.137154, 11.576124],
      [40.73061, -73.935242],
    ]);
    let start = 0;

    this.getPosition();

    // Adding Event Listeners
    document
      .querySelectorAll(".select-place__city")[0]
      .addEventListener("click", () => {
        this.loadData2(52.409538, 16.931992);
      });

    document
      .querySelectorAll(".select-place__city")[1]
      .addEventListener("click", () => {
        this.loadData2(52.229676, 21.012229);
      });

    document
      .querySelectorAll(".select-place__city")[2]
      .addEventListener("click", () => {
        this.loadData2(60.16952, 24.93545);
      });

    document
      .querySelectorAll(".select-place__city")[3]
      .addEventListener("click", () => {
        this.loadData2(48.137154, 11.576124);
      });

    document
      .querySelectorAll(".select-place__city")[4]
      .addEventListener("click", () => {
        this.loadData2(40.7127837, -74.0059413);
      });
  }

  // Getting user position -> lat and lng
  getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this.loadData.bind(this), () => {
        this.loadData2(52.409538, 16.931992);
      });
  }
  // Loading data -> weather, location, forecast,
  async loadData(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    let airQuality = await this.getAirQualityData(lat, lng).then(
      (quality) => quality
    );

    let location = await this.getLocation(lat, lng).then((loc) => loc);

    const weatherData = await this.getWeatherData(lat, lng);

    await this.displayWidget(
      this.getWeatherWidgetObject(weatherData, location, airQuality)
    );

    await this.displayForecasts(weatherData);
  }
  // Loading data -> weather, location, forecast,
  async loadData2(lat, lng) {
    let airQuality = await this.getAirQualityData(lat, lng).then(
      (quality) => quality
    );

    let location = await this.getLocation(lat, lng).then((loc) => loc);

    const weatherData = await this.getWeatherData(lat, lng);

    await this.displayWidget(
      this.getWeatherWidgetObject(weatherData, location, airQuality)
    );

    await this.displayForecasts(weatherData);
  }

  // Getting location using lat and lng -> Wroclaw, PL
  async getLocation(lat, lng) {
    return await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => data[0].name)
      .catch((err) => console.error(err));
  }

  async getWeatherData(lat, lng) {
    return await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
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
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${API_KEY}`
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
    let cloudy = 0;
    if (weatherWidget.clouds < 20) {
      cloudy = 0;
    } else if (weatherWidget.clouds < 40) {
      cloudy = 1;
    } else if (weatherWidget.clouds < 60) {
      cloudy = 2;
    } else if (weatherWidget.clouds < 80) {
      cloudy = 3;
    } else if (weatherWidget.clouds < 100) {
      cloudy = 4;
    }

    widgetTemp.innerHTML = `${weatherWidget.temp}<sup class="selected-weather__temp-sup">&#8451;</sup>`;
    widgetLocation.textContent = weatherWidget.location;
    widgetAirQuality.textContent = weatherWidget.airQuality;
    widgetChanceOfRain.textContent = weatherWidget.chanceOfRain;
    widgetFeelsLike.textContent = weatherWidget.feelsLike.toFixed(1);
    widgetSunset.textContent = weatherWidget.sunset;
    widgetDate.textContent = weatherWidget.date;

    widgetPhoto.src = `../img/${cloudy}.svg`;
  }

  // Displaying weather forecast
  displayForecasts(weatherData) {
    let weatherForecasts = new Array();

    // Deleting 8th array
    weatherData = weatherData.daily.splice(0, 7);
    let cloudy = 0;

    for (const data of weatherData) {
      if (data.clouds < 20) {
        cloudy = 0;
      } else if (data.clouds < 40) {
        cloudy = 1;
      } else if (data.clouds < 60) {
        cloudy = 2;
      } else if (data.clouds < 80) {
        cloudy = 3;
      } else if (data.clouds < 100) {
        cloudy = 4;
      }
      console.log(data);
      const forecast = `
                <div class="weather-information__details">
                  <div class="weather-information-date">${this.getDayOfTheWeek(
                    data.dt
                  )}</div>
                  <div class="weather-information-rain">
                    <img src="../img/humidity.svg" alt="drop">
                    <span class="weather-information-rain__chance">${
                      data.humidity
                    }%</span>
                  </div>
                  <div class="weather-information-sky">
                    <img src="./img/${cloudy}.svg" alt="weather">
                  </div>
                  <div class="weather-information-min">${data.temp.min.toFixed(
                    1
                  )}<sup>℃</sup></div>
                  <div class="weather-information-max">${data.temp.max.toFixed(
                    1
                  )}<sup>℃</sup></div>
                </div>
                `;
      weatherForecasts.push(forecast);
    }

    forecastContainer.innerHTML = weatherForecasts.join(" ");
  }
}

new App();
