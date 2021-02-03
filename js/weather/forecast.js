import * as util from "../util/utility.js";
import { checkIfCloudy } from "../weather/weather.js";

// Create forecast Element
export const createForecastElement = function (data) {
  const forecastElement = document.createElement("div");
  forecastElement.classList.add("weather-information__details__item");

  const forecastTemplate = `
            <span class="weather-information__details__item__title">${util.getDayOfTheWeek(
              data.dt
            )}</span>
            <div class="weather-information__details__item__image">
            <img src=${checkIfCloudy(data.clouds)} alt="clouds percentage" />
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
          `;

  forecastElement.insertAdjacentHTML("afterbegin", forecastTemplate);

  return forecastElement;
};
