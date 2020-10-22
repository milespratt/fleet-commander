// This file creates and returns a new Pixi application
import * as PIXI from "pixi.js";

import { screenWidth, screenHeight } from "./config";

// TODO: Take in config as parameters
export function createApp() {
  const newApp = new PIXI.Application({
    width: screenWidth,
    height: screenHeight,
    transparent: true,
    antialias: true,
  });
  return newApp;
}
