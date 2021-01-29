const logo = document.querySelector("#logo");
const aside = document.querySelector(".aside");

console.log(aside);

logo.addEventListener("click", () => {
  // background-image: url("../img/windows_wallpaper.jpg");

  if (aside.style.backgroundImage === 'url("../img/windows_wallpaper.jpg")') {
    aside.style.backgroundImage = 'url("../img/sky.svg")';
  } else {
    aside.style.backgroundImage = 'url("../img/windows_wallpaper.jpg")';
  }
});
