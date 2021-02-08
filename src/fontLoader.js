import boldFont from "./assets/fonts/Inconsolata-Bold.ttf";
import normalFont from "./assets/fonts/Inconsolata-Regular.ttf";

export default () => {
  return new Promise((resolve, rej) => {
    const fontsList = [
      new FontFace("Inconsolata", `url(${boldFont})`, {
        style: "normal",
        weight: 700,
      }),
      new FontFace("Inconsolata", `url(${normalFont})`, {
        style: "normal",
        weight: 400,
      }),
    ];
    fontsList.forEach((fonts) => {
      fonts.load().then(function (loadedFontFace) {
        document.fonts.add(loadedFontFace);
      });
    });
    document.fonts.ready.then(() => {
      resolve();
    });
  });
};
