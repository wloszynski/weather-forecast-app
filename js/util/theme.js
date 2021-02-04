import light_sky from "../../img/landscape-light.svg";
import dark_sky from "../../img/sky.svg";

// VARIABLE FOR ASIDE
const aside = document.querySelector(".aside");

// VARIABLE FOR GRADIENT BACKGROUND
const gradientBg = document.querySelector(".gradientBg");

// Logo as theme switch
document.querySelector("#logo").addEventListener("click", () => {
  if (aside.style.backgroundImage === `url("${light_sky}")`) {
    aside.style.backgroundImage = `url(${dark_sky})`;

    aside.style.color = "white";
    gradientBg.style.background = "linear-gradient(to top,#004e92,#000428)";
  } else {
    aside.style.backgroundImage = `url("${light_sky}")`;

    aside.style.color = "#0008";
    gradientBg.style.background = "linear-gradient(to top,#008cbc,#b1dee8)";
  }
});

// Change color theme when later than 6:OOPM
const date = new Date();
const hours = date.getHours();

if (hours > 8 && hours < 18) {
  aside.style.backgroundImage = `url(${light_sky})`;
  aside.style.color = "#0008";
  gradientBg.style.background = "linear-gradient(to top,#008cbc,#b1dee8)";
} else {
  aside.style.backgroundImage = `url(${dark_sky})`;
  aside.style.color = "white";
  gradientBg.style.background = "linear-gradient(to top,#004e92,#000428)";
}
