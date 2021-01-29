"use strict";

import { API_KEY } from "./config.js";

class Weather {
  constructor(location, temp, clouds, chanceOfRain) {}
}
class WeatherWidget extends Weather {
  constructor(
    location,
    temp,
    clouds,
    chanceOfRain,
    feelsLike,
    sunset,
    airQuality
  ) {
    super(location, temp, clouds, chanceOfRain);
  }
}

class App {
  constructor() {
    this.getPosition();
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
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    let airQuality;
    this.getAirQualityData(latitude, longitude).then((quality) => {
      airQuality = quality;
      console.log(airQuality);
    });
  }

  getWeatherInfo(lat, lng) {}

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
}

new App();
