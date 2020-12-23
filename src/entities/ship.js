// PIXI
import * as PIXI from "pixi.js";

// ASSETS
import shipPNG from "../assets/images/ship-indicator.png";

import {
  colors,
  textResolution,
  calculationMultiplier,
  lightSpeed,
  lightYear,
} from "../config";

import {
  Vector,
  getDistanceAndAngleBetweenTwoPoints,
  // getRandomStar,
  getRandomArrayElement,
} from "../helpers";

// TEXTURE
const shipTexture = PIXI.Texture.from(shipPNG);

const statuses = {
  idle: "idle",
  travelling: "travelling",
};

class Ship {
  constructor(name, id, range, x, y, origin, destination, universe) {
    this.universe = universe;
    this.lastUpdate = Date.now();
    this.scanning = false;
    this.scanningGraphics = new PIXI.Graphics();
    this.voyageGraphics = new PIXI.Graphics();
    this.scanProgress = 0;
    this.scanRange = range;
    this.scanSpeed = 1;
    this.scanCoordinates = { x: 0, y: 0 };
    this.name = name;
    this.id = id;
    this.range = range;
    this.speed = 0;
    this.acceleration = 1;
    this.maxAcceleration = 1000000;
    this.maxSpeed = (lightSpeed / lightYear) * 1000000;
    this.position = { x, y };
    this.sprite = null;
    this.shipNameText = null;
    this.origin = origin;
    this.status = statuses.idle;
    this.destination = destination;
    this.distanceToDestination = 0;
    this.trips = [];
    this.plottingCourse = false;
    this.directionX =
      this.origin.position.x > this.destination.position.x ? "west" : "east";
    this.directionY =
      this.origin.position.y > this.destination.position.y ? "north" : "south";
  }
  timeStamp() {
    this.lastUpdate = Date.now();
  }
  stopScan() {
    this.scanning = false;
    this.scanProgress = 0;
  }
  scan() {
    const delta = this.getDelta();
    if (!this.scanning) {
      this.scanProgress = 0;
      this.scanning = true;
    }
    this.scanProgress += this.scanSpeed * delta;
    if (this.scanProgress / this.scanRange >= 1) {
      this.stopScan();
    }
  }
  createSprite() {
    const { x, y } = this.position;
    this.sprite = new PIXI.Sprite(shipTexture);
    this.sprite.id = this.id;
    this.sprite.height = 10;
    this.sprite.width = 10;
    this.sprite.tint = colors.blue;
    this.sprite.anchor.set(0.5);
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.sprite.visible = true;
    this.sprite.position.set(x, y);
    this.sprite.ship = this;

    // hit area
    const hitAreaSize = 30; // pixels
    const hitAreaScalePercentage = 10 * (hitAreaSize / 10);
    const hitAreaCoordinates = [
      0, // x
      0, // y
      hitAreaScalePercentage, // radius
    ];
    const hitAreaPreview = new PIXI.Graphics();
    hitAreaPreview.drawCircle(...hitAreaCoordinates);
    this.sprite.hitArea = new PIXI.Circle(...hitAreaCoordinates);
    // // name text
    this.shipNameText = new PIXI.Text("ship", {
      fontFamily: "Inconsolata",
      letterSpacing: 1.75,
      lineHeight: 13,
      fontSize: 12,
      fontWeight: 700,
      fill: "white",
      stroke: "black",
      strokeThickness: 1,
    });
    this.shipNameText.resolution = textResolution;
    this.shipNameText.visible = true;
    this.shipNameText.text = `${this.name}`;
    this.shipNameText.position.set(
      x + 21,
      y - this.shipNameText.height / 2 + 1.8
    );
    return this.sprite;
  }
  getNewDirection(posX, posY, destination) {
    const direction = {
      directionX: posX > destination.x ? "west" : "east",
      directionY: posY > destination.y ? "north" : "south",
    };
    return direction;
  }
  updatePosition(newCoordinates) {
    const { posX, posY, directionX, directionY, distance } = newCoordinates;
    this.position.x = posX;
    this.position.y = posY;
    this.directionX = directionX;
    this.directionY = directionY;
    this.distanceToDestination = distance;
    this.sprite.position.set(posX, posY);
    this.shipNameText.position.set(
      posX + 21,
      posY - this.shipNameText.height / 2 + 1.8
    );
  }
  getNewDestination() {
    const starsInRange = this.getStarsInRange();
    return getRandomArrayElement(starsInRange);
  }
  getStarsInRange(includeOrigin = false, includeDestination = false) {
    const limitedStars = this.universe.getStarsInThisAndAdjacentSectors(
      this.position.x,
      this.position.y
    );
    const starsInRange = limitedStars.filter((limitStar, index) => {
      const starDistance = getDistanceAndAngleBetweenTwoPoints(
        { x: limitStar.position.x, y: limitStar.position.y },
        this.position
      ).distance;
      return starDistance <= this.range;
    });
    console.log(`${starsInRange.length} stars in range of ${this.name}`);
    if (includeOrigin && includeDestination) {
      return starsInRange;
    } else if (!includeOrigin && !includeDestination) {
      return starsInRange.filter(
        (star) => star.id !== this.origin.id && star.id !== this.destination.id
      );
    } else if (includeOrigin && !includeDestination) {
      return starsInRange.filter((star) => star.id !== this.destination.id);
    } else if (!includeOrigin && includeDestination) {
      return starsInRange.filter((star) => star.id !== this.origin.id);
    }
    return starsInRange;
  }
  getDistanceToTarget(target) {
    const { distance } = getDistanceAndAngleBetweenTwoPoints(
      { x: this.position.x, y: this.position.y },
      target
    );
    return distance;
  }
  getNewCoordinates(delta) {
    // TODO: move acceleration and speed to function
    // accelerate
    if (this.acceleration < this.maxAcceleration) {
      const accelerationIncrease = this.maxSpeed / 1000000000000000;
      this.acceleration = accelerationIncrease * delta;
    }
    // update speed
    if (this.speed < this.maxSpeed) {
      this.speed += this.acceleration;
    }
    const { angle, distance } = getDistanceAndAngleBetweenTwoPoints(
      { x: this.position.x, y: this.position.y },
      this.destination.position
    );
    const vector = new Vector(this.speed, angle);
    const posX = this.position.x + vector.magnitudeX * delta;
    const posY = this.position.y + vector.magnitudeY * delta;
    const { directionX, directionY } = this.getNewDirection(
      posX,
      posY,
      this.destination.position
    );
    const newCoordinates = {
      posX,
      posY,
      directionX,
      directionY,
      distance,
    };
    return newCoordinates;
  }
  validateCoordinates(newCoordinates) {
    return (
      newCoordinates.distance > 0 &&
      newCoordinates.directionX === this.directionX &&
      newCoordinates.directionY === this.directionY
    );
  }
  arrive() {
    this.speed = 0;
    this.acceleration = 1;
    this.status = statuses.idle;
    const { x, y } = this.destination.position;
    this.distanceToDestination = 0;
    this.origin = this.destination;
    const newPlot = {
      posX: x,
      posY: y,
      directionX: this.directionX,
      directionY: this.directionY,
      distance: this.distanceToDestination,
    };
    this.updatePosition(newPlot);
    this.voyageGraphics.clear();
  }
  drawVoyageGraphics() {
    this.voyageGraphics.clear();
    // voyage line (from origin to position)
    this.voyageGraphics.lineStyle(2, colors.blue, 1);
    this.voyageGraphics.moveTo(this.origin.position.x, this.origin.position.y);
    this.voyageGraphics.lineTo(this.position.x, this.position.y);

    // path line (from position to destination)
    this.voyageGraphics.lineStyle(2, colors.blue, 0.5);
    this.voyageGraphics.moveTo(
      this.destination.position.x,
      this.destination.position.y
    );
    this.voyageGraphics.lineTo(this.position.x, this.position.y);
  }
  plot() {
    this.destination = this.getNewDestination();
    const distance = this.getDistanceToTarget(this.destination);
    const { directionX, directionY } = this.getNewDirection(
      this.position.x,
      this.position.y,
      this.destination.position
    );
    this.distanceToDestination = distance;
    this.directionX = directionX;
    this.directionY = directionY;
  }
  launch() {
    this.scanning = false;
    this.scanningGraphics.clear();
    this.status = statuses.travelling;
  }
  getDelta() {
    const now = Date.now();
    const delta = (now - this.lastUpdate) / calculationMultiplier;
    return delta;
  }
  move() {
    // get delta and move
    const delta = this.getDelta();
    if (this.destination === undefined) {
      return;
    }
    // 1. get new coordinates
    const newCoordinates = this.getNewCoordinates(delta);
    // 2. validate new coordinates
    if (this.validateCoordinates(newCoordinates)) {
      // 3. Update ship
      this.updatePosition(newCoordinates);
    } else {
      if (this.destination && this.plottingCourse === false) {
        this.arrive(this.destination);
      }
    }
  }
  update() {
    if (this.status === statuses.travelling) {
      this.move();
    }
    this.drawVoyageGraphics();
    // if (this.scanning) {
    //   this.scan();
    // }
    this.timeStamp();
  }
}

export default Ship;
