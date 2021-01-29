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

// class for the weather-information div
class WeatherInformation extends Weather {
  constructor(location, temp, clouds, chanceOfRain, minTemp, maxTemp) {
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
class App {
  weatherWidget;
  constructor() {
    this.getPosition();
    this.weatherWidget = new WeatherWidget(
      "Warsaw, Poland",
      "24",
      "90",
      "99",
      "Mon, 5 Aug",
      "34",
      "22:22",
      "Very Poor"
    );
    this.displayWidget(this.weatherWidget);
  }

  // getting user position
  getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.loadData.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  loadData(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    let airQuality = null;

    this.getAirQualityData(lat, lng).then((quality) => {
      airQuality = quality;
    });

    this.getWeatherData(lat, lng);
    this.getLocation(lat, lng);
  }

  getLocation(lat, lng) {
    return fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => console.log(data[0].name))
      .catch((err) => console.error(err));
  }

  getWeatherData(lat, lng) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.current);
        const { temp, clouds, feels_like, sunset } = data.current;

        this.displayWidget(
          this.getWeatherWidgetObject(
            "Wroclaw, PL",
            temp,
            clouds,
            "88",
            "Mon, 6 Aug",
            feels_like,
            sunset,
            "Poor"
          )
        );
      })
      .catch((err) => console.error(err));

    location, temp, clouds, chanceOfRain, date, feelsLike, sunset, airQuality;
  }

  getAirQualityData(lat, lng) {
    // fetching air quality
    return fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${API_KEY}`
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

  getWeatherWidgetObject(
    location,
    temp,
    clouds,
    chanceOfRain,
    date,
    feelsLike,
    sunset,
    airQuality
  ) {
    return new WeatherWidget(
      location,
      temp,
      clouds,
      chanceOfRain,
      date,
      feelsLike,
      this.convertUnixToTime(sunset),
      airQuality
    );
  }

  // Converting Unix dt to HH:MM
  convertUnixToTime(dt) {
    const date = new Date(dt * 1000);
    return `${date.getHours()}: ${date.getMinutes()}`;
  }

  displayWidget(weatherWidget) {
    widgetTemp.innerHTML = `${weatherWidget.temp}<sup class="selected-weather__temp-sup">&#8451;</sup>`;
    widgetLocation.textContent = weatherWidget.location;
    widgetAirQuality.textContent = weatherWidget.airQuality;
    widgetChanceOfRain.textContent = weatherWidget.chanceOfRain;
    widgetFeelsLike.textContent = weatherWidget.feelsLike;
    widgetSunset.textContent = weatherWidget.sunset;
    widgetDate.textContent = weatherWidget.date;
  }
}

new App();
