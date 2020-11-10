// PIXI
import * as PIXI from "pixi.js";
import {
  generateStarName,
  getID,
  getType,
  getClass,
  getTemp,
  getStarSize,
  getStarRadius,
  getStarMass,
  getStarAge,
} from "../helpers";

import { colors } from "../config";

// ASSETS
import starPNG from "../assets/images/star-indicator.png";

// TEXTURE
const starTexture = PIXI.Texture.from(starPNG);

class Star {
  constructor(x, y, name, id) {
    this.id = id;
    this.name = name;
    this.position = { x, y };
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.type = getType();
    this.class = getClass();
    this.temp = getTemp(this.type);
    this.size = getStarSize(this.class, 10);
    this.radius = getStarRadius(this.size);
    this.mass = getStarMass(this.size);
    this.age = getStarAge(this.type);
  }
  createSprite() {
    const { x, y } = this.position;
    this.sprite = new PIXI.Sprite(starTexture);
    this.sprite.position.set(x, y);
    this.sprite.tint = colors.white;
    this.sprite.anchor.set(0.5);
    this.sprite.star = {
      id: this.id,
      name: this.name,
      x,
      y,
    };
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.height = this.size;
    this.sprite.width = this.size;

    const hitAreaSize = 50; // pixels
    const hitAreaScalePercentage = this.size * (hitAreaSize / this.size);
    const hitAreaCoordinates = [
      0, // x
      0, // y
      hitAreaScalePercentage, // radius
    ];
    this.sprite.hitArea = new PIXI.Circle(...hitAreaCoordinates);
    return this.sprite;
  }
}

export default Star;
