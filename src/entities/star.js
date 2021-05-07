// PIXI
import * as PIXI from "pixi.js";
import AstronomicalObject from "./astronomicalObject";
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
  getDistanceAndAngleBetweenTwoPoints,
} from "../helpers";

import { colors } from "../config";

import Interaction from "../engine/interaction";

// ASSETS
import starPNG from "../assets/images/star-indicator-large.png";

// TEXTURE
const starTexture = PIXI.Texture.from(starPNG);

class Star extends AstronomicalObject {
  constructor(x, y, name, id, sector, starClass, universe) {
    super(name, id, universe, sector, { hydrogen: 1000000000 });
    // this.id = id;
    // this.name = name;
    this.position = { x, y };
    // this.sector = sector;
    this.sprite = null;
    this.class = getClass(starClass);
    this.type = getType();
    this.temp = getTemp(this.class);
    this.size = getStarSize(this.class, 12);
    this.radius = getStarRadius(this.size);
    this.mass = getStarMass(this.size);
    this.age = getStarAge(this.class);
    // this.universe = universe;
    this.range = 300;
    this.select = this.select.bind(this);
    this.hover = this.hover.bind(this);
    this.blur = this.blur.bind(this);
    this.interaction = new Interaction(
      this,
      this.select,
      this.hover,
      this.blur
    );
    this.textWidth = 0;
  }
  select() {
    this.universe.setSelectedStar(this);
  }
  hover() {
    this.universe.setHoveredStar(this);
  }
  blur() {
    this.universe.setHoveredStar();
  }
  getInfo() {
    console.log("");
    console.log("STAR INFORMATION");
    console.log(`ID: ${this.id}`);
    console.log(`Name: ${this.name}`);
    console.log(`Position: ${this.position.x}x ${this.position.y}y`);
    console.log(`Sector: ${this.sector}`);
    console.log(`Type: ${this.type}`);
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
    const starInfoText = `POS: ${this.position.x}x ${this.position.y}y\nSEC: ${
      this.sector
    }\nTYP: ${this.type}\nCLS: ${
      this.class
    }\nTMP: ${this.temp.toLocaleString()}K\nSRa: ${
      this.size
    } R\nRAD: ${this.radius.toLocaleString()} KM\nSMa: ${this.mass} R\nMAS: ${
      this.mass * (2 * 10000000000000000000000000000000)
    } kg\nAGE: ${this.age.toLocaleString()}`;
    this.textWidth = starInfoText.width + this.size / 2 + 50;
    return starInfoText;
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
    this.sprite.hitArea = new PIXI.Rectangle(
      0 - hitAreaSize / 2,
      0 - hitAreaSize / 2,
      hitAreaSize,
      hitAreaSize
    );

    // add star event handlers
    this.sprite.on("mouseover", () => {
      this.interaction.hover();
    });
    this.sprite.on("mouseout", () => {
      this.interaction.blur();
    });

    return this.sprite;
  }
  getStarsInRange(includeOrigin = false, includeDestination = false) {
    const sectorScan = this.range / this.universe.sectorGrid.delimiter;
    const sectorDistance = Math.ceil(sectorScan);
    const limitSector = this.universe.getGridSector(
      this.position.x,
      this.position.y
    );
    const adjacentSectors = this.universe.getAdjacentSectors(limitSector, true);
    for (let s = 1; s < sectorDistance; s++) {
      adjacentSectors.forEach((adjacentSector) => {
        this.universe
          .getAdjacentSectors(adjacentSector)
          .forEach((loopedSector) => {
            if (!adjacentSectors.includes(loopedSector)) {
              adjacentSectors.push(loopedSector);
            }
          });
      });
    }
    const limitedStars = this.universe.getStarsFromSectorArray(adjacentSectors);

    // const limitedStars = this.universe.getStarsInThisAndAdjacentSectors(
    //   this.position.x,
    //   this.position.y
    // );
    const starsInRange = limitedStars.filter((limitStar) => {
      const starDistance = getDistanceAndAngleBetweenTwoPoints(
        { x: limitStar.position.x, y: limitStar.position.y },
        this.position
      ).distance;
      return starDistance <= this.range;
    });
    // if (includeOrigin && includeDestination) {
    //   return starsInRange;
    // } else if (!includeOrigin && !includeDestination) {
    //   return starsInRange.filter(
    //     (star) => star.id !== this.origin.id && star.id !== this.destination.id
    //   );
    // } else if (includeOrigin && !includeDestination) {
    //   return starsInRange.filter((star) => star.id !== this.destination.id);
    // } else if (!includeOrigin && includeDestination) {
    //   return starsInRange.filter((star) => star.id !== this.origin.id);
    // }
    return starsInRange;
  }
}

export default Star;
