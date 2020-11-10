// DEPENDENCIES
import { Viewport } from "pixi-viewport";

// CONFIG
import { worldHeight, worldWidth, screenHeight, screenWidth } from "../config";

// create viewport
export function createViewport(app, options, drag) {
  const viewportOptions = options || {
    worldHeight,
    worldWidth,
    screenHeight,
    screenWidth,
  };
  viewportOptions.interaction = app.renderer.plugins.interaction;
  const newViewport = new Viewport(viewportOptions)
    .moveCenter(worldWidth / 2, worldHeight / 2)
    .clamp({ direction: "all", underflow: "center" });

  if (drag) {
    newViewport
      .clamp({ direction: "all", underflow: "center" })
      .clampZoom({ minScale: 0.5, maxScale: 2 })
      .drag()
      .pinch()
      .wheel()
      .decelerate();
  }

  // set viewport parameters for use later
  newViewport.initialWidth = newViewport.screenWidth; // for snapZoom

  // add viewport to app stage
  app.stage.addChild(newViewport);

  newViewport.on("zoomed", (ev) => {
    console.log(ev.viewport.scaled);
    console.log(newViewport.getVisibleBounds());
  });

  // return viewport
  return newViewport;
}
