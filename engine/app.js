// This file creates and returns a new Pixi application
import * as PIXI from "pixi.js";

import { screenWidth, screenHeight } from "../config";

// TODO: Take in config as parameters
export function createApp(height, width, viewportId) {
  const newApp = new PIXI.Application({
    width: width || screenWidth,
    height: height || screenHeight,
    transparent: true,
    antialias: true,
    autoResize: true,
    resizeTo: document.getElementById(viewportId),
  });
  return newApp;
}
