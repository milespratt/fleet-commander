// DEPENDENCIES
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";

// ASSETS
import viewportClickPNG from "../assets/viewport-click-indicator.png";

// CONFIG
import {
  worldHeight,
  worldWidth,
  screenHeight,
  screenWidth,
  viewportClamps,
} from "./config";

// create click sprite
const viewportClickTexture = PIXI.Texture.from(viewportClickPNG);
const viewportClickSprite = new PIXI.Sprite(viewportClickTexture);
viewportClickSprite.alpha = 0;
viewportClickSprite.anchor.set(0.5);
viewportClickSprite.height = 50;
viewportClickSprite.interactive = false;
viewportClickSprite.tint = 0x70ffe9;
viewportClickSprite.visible = false;
viewportClickSprite.width = 50;

// create viewport
export function createViewport(app) {
  const newViewport = new Viewport({
    screenWidth,
    screenHeight,
    worldWidth,
    worldHeight,
    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  })
    .clamp({ direction: "all", underflow: "center" })
    .clampZoom(viewportClamps)
    .drag()
    .pinch()
    .wheel()
    .decelerate()
    .moveCenter(worldWidth / 2, worldHeight / 2);

  // set viewport parameters for use later
  newViewport.clickedAt = Date.now(); // for tracking double click
  newViewport.clickCount = 0; // for tracking double click
  newViewport.doubleClickTimeout = 500; // ms between clicks for double click
  newViewport.initialWidth = newViewport.screenWidth; // for snapZoom

  // attach click sprite
  newViewport.clickSprite = viewportClickSprite;
  newViewport.addChild(viewportClickSprite);

  // event handlers
  // CLICK
  newViewport.on("clicked", (ev) => {
    // update click trackers
    newViewport.clickedAt = Date.now();
    newViewport.clickCount += 1;

    // center and zoom when double clicked
    if (newViewport.clickCount >= 2) {
      // get click coordinates
      const clickCoords = [ev.world.x, ev.world.y];

      // reset click tracking
      newViewport.clickedAt = 0;
      newViewport.clickCount = 0;

      // snap viewport to location
      newViewport.snap(...clickCoords, {
        time: 750,
        removeOnComplete: true,
        removeOnInterrupt: true,
        forceStart: true,
      });

      // zoom viewport to location
      newViewport.snapZoom({
        width: newViewport.initialWidth,
        time: 750,
        removeOnComplete: true,
        removeOnInterrupt: true,
        forceStart: true,
      });

      // show click sprite
      newViewport.clickSprite.alpha = 1;
      newViewport.clickSprite.visible = true;
      newViewport.clickSprite.position.set(...clickCoords);
    }
  });

  // add viewport to app stage
  app.stage.addChild(newViewport);

  // return viewport
  return newViewport;
}
