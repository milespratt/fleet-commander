export default () => {
  return new Promise((resolve, rej) => {
    const fontsList = [
      new FontFace("Inconsolata", "url(./assets/fonts/Inconsolata-Bold.ttf)", {
        style: "normal",
        weight: 700,
      }),
      new FontFace(
        "Inconsolata",
        "url(./assets/fonts/Inconsolata-Regular.ttf)",
        { style: "normal", weight: 400 }
      ),
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
