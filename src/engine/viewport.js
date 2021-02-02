// DEPENDENCIES
import { Viewport } from "pixi-viewport";

// CONFIG
import { screenHeight, screenWidth, generationParameters } from "../config";

const storedGenerationParameters = localStorage.getItem(
  "generation_parameters"
);
if (storedGenerationParameters) {
  const parsedGenerationParameters = JSON.parse(storedGenerationParameters);
  generationParameters.size = parsedGenerationParameters.size;
  generationParameters.maxStars = parsedGenerationParameters.maxStars;
  generationParameters.minimumStarDistance =
    parsedGenerationParameters.minimumStarDistance;
  generationParameters.edgeDistance = parsedGenerationParameters.edgeDistance;
  generationParameters.radial = parsedGenerationParameters.radial;
}

// create viewport
export function createViewport(app, options, clamps) {
  const viewportOptions = options || {
    worldHeight: generationParameters.size,
    worldWidth: generationParameters.size,
    screenHeight,
    screenWidth,
    divWheel: document.getElementById("view"),
  };
  viewportOptions.interaction = app.renderer.plugins.interaction;
  const newViewport = new Viewport(viewportOptions)
    .moveCenter(generationParameters.size / 2, generationParameters.size / 2)
    .clamp({ direction: "all", underflow: "center" });

  if (clamps) {
    newViewport
      .clamp({ direction: "all", underflow: "center" })
      .clampZoom(clamps)
      .drag()
      .pinch()
      .wheel()
      .decelerate();
  }

  // set viewport parameters for use later
  newViewport.initialWidth = newViewport.screenWidth; // for snapZoom

  // add viewport to app stage
  app.stage.addChild(newViewport);

  // return viewport
  return newViewport;
}
