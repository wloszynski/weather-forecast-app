import { loadData } from "../model";
import { MAP_ZOOM } from "../config.js";

// VARIABLES FOR MAP
const mapContainer = document.querySelector(".map");

// Load leafty map
// Load leafty map
export class Map {
  constructor(lat, lng) {
    const coords = [lat, lng];

    this.map = L.map("map").setView(coords, MAP_ZOOM);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Handling clicks on map
    this.map.on("click", (event) => {
      mapContainer.classList.add("map--hidden");
      ({ lat, lng } = event.latlng);
      loadData(lat, lng);
    });
  }
}
