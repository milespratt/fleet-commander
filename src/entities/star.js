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
import starPNG from "../assets/images/star-indicator-large.png";

// TEXTURE
const starTexture = PIXI.Texture.from(starPNG);

class Star {
  constructor(x, y, name, id, sector, starClass) {
    this.id = id;
    this.name = name;
    this.position = { x, y };
    this.sector = sector;
    this.sprite = null;
    this.class = getClass(starClass);
    this.type = getType();
    this.temp = getTemp(this.class);
    this.size = getStarSize(this.class, 12);
    this.radius = getStarRadius(this.size);
    this.mass = getStarMass(this.size);
    this.age = getStarAge(this.class);
  }
  getInfo() {
    console.log("");
    console.log("STAR INFORMATION");
    console.log(`ID: ${this.id}`);
    console.log(`Name: ${this.name}`);
    console.log(`Position: ${this.position.x}x ${this.position.y}y`);
    console.log(`Sector: ${this.sector}`);
    // console.log(`Type: ${this.type}`);
    console.log(`Class: ${this.class}`);
    console.log(`Temp: ${this.temp.toLocaleString()}K`);
    console.log(`Solar Radius: ${this.size} R`);
    console.log(`Radius: ${this.radius.toLocaleString()} KM`);
    console.log(`Solar Mass: ${this.mass} R`);
    console.log(
      `Mass: ${this.mass * (2 * 10000000000000000000000000000000)} kg`
    );
    console.log(`Age: ${this.age.toLocaleString()}`);
    console.log("");
  }
  createSprite() {
    const baseTextureSize = 72;
    const { x, y } = this.position;
    this.sprite = new PIXI.Sprite(starTexture);
    this.sprite.position.set(x, y);
    this.sprite.tint = colors.white;
    this.sprite.anchor.set(0.5);
    this.sprite.star = this;
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.height = this.size;
    this.sprite.width = this.size;

    const hitAreaSize = 50 * (baseTextureSize / this.size) + this.size; // pixels. 30 is the base texture size. 50 is the desired hit area size.
    this.hitAreaSize = hitAreaSize;
    // console.log(this.size, hitAreaSize);
    // console.log(hitAreaSize);
    // console.log(hitAreaSize * (this.size / 30));
    // console.log(this.size);
    // const hitAreaScalePercentage = this.size * (hitAreaSize / this.size);
    // const hitAreaCoordinates = [
    //   0, // x
    //   0, // y
    //   hitAreaSize, // radius
    // ];
    // this.hitAreaCoordinates = hitAreaCoordinates;
    // this.sprite.hitArea = new PIXI.Circle(0, 0, hitAreaSize / 2);
    this.sprite.hitArea = new PIXI.Rectangle(
      0 - hitAreaSize / 2,
      0 - hitAreaSize / 2,
      hitAreaSize,
      hitAreaSize
    );
    // console.log(this.sprite.hitArea);

    return this.sprite;
  }
}

export default Star;
