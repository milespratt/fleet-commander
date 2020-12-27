// DEPENDENCIES
import { Viewport } from "pixi-viewport";

// CONFIG
import { worldSize, screenHeight, screenWidth } from "../config";

// create viewport
export function createViewport(app, options, clamps) {
  const viewportOptions = options || {
    worldHeight: worldSize,
    worldWidth: worldSize,
    screenHeight,
    screenWidth,
    divWheel: document.getElementById("view"),
  };
  viewportOptions.interaction = app.renderer.plugins.interaction;
  const newViewport = new Viewport(viewportOptions)
    .moveCenter(worldSize / 2, worldSize / 2)
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
