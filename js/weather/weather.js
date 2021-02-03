import * as util from "../util/utility.js";

import cloudless from "../../img/cloudless.svg";
import few_clouds from "../../img/few-clouds.svg";
import rather_cloudy from "../../img/rather-cloudy.svg";
import very_cloudy from "../../img/cloudy.svg";
import overcast from "../../img/overcast.svg";

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
    airQuality,
    latlng
  ) {
    super(location, temp, clouds, chanceOfRain, date);
    this.feelsLike = feelsLike;
    this.sunset = sunset;
    this.airQuality = airQuality;
    this.latlng = latlng;
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

export function getWeatherWidgetObject(data, location, airQuality) {
  const { temp, clouds, feels_like, sunset, humidity } = data.current;
  return new WeatherWidget(
    location,
    temp.toFixed(1),
    clouds,
    humidity,
    util.shortDateFormat(),
    feels_like,
    util.convertUnixToTime(sunset),
    airQuality,
    [data.lat, data.lon]
  );
}

// Creating WeatherForecast Object
export function getWeatherForecastObject(
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

// Checking the cloud percentage and defining which photo should be selected
export const checkIfCloudy = function (cloudy) {
  const cloudNamesArray = [
    cloudless,
    few_clouds,
    rather_cloudy,
    very_cloudy,
    overcast,
  ];

  if (cloudy < 20) {
    return cloudNamesArray[0];
  } else if (cloudy < 40) {
    return cloudNamesArray[1];
  } else if (cloudy < 60) {
    return cloudNamesArray[2];
  } else if (cloudy < 80) {
    return cloudNamesArray[3];
  } else if (cloudy < 100) {
    return cloudNamesArray[4];
  }

  return cloudNamesArray[0];
};
