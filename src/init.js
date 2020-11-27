// babel dependencies
import "regenerator-runtime/runtime"; // async-await

// loaders
import loadData from "./loadData";
import loadRenderer from "./loadRenderer";

const loadFonts = () => {
  return new Promise((resolve, rej) => {
    const fontsList = [
      new FontFace("Inconsolata", "url(../assets/fonts/Inconsolata-Bold.ttf)", {
        style: "normal",
        weight: 700,
      }),
      new FontFace(
        "Inconsolata",
        "url(../assets/fonts/Inconsolata-Regular.ttf)",
        { style: "normal", weight: 400 }
      ),
    ];
    fontsList.forEach((fonts) => {
      fonts.load().then(function (loadedFontFace) {
        document.fonts.add(loadedFontFace);
        //document.body.style.fontFamily = '"Junction Regular", Arial';
      });
    });
    document.fonts.ready.then(() => {
      resolve();
    });
  });
};

async function init() {
  const universe = await loadData();
  await loadFonts();
  loadRenderer(universe);
}
init();
