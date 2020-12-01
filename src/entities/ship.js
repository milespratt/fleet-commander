// PIXI
import * as PIXI from "pixi.js";

// ASSETS
import shipPNG from "../assets/images/ship-indicator.png";

import { colors, textResolution, calculationMultiplier } from "../config";

import {
  Vector,
  getDistanceAndAngleBetweenTwoPoints,
  getRandomStar,
} from "../helpers";

// TEXTURE
const shipTexture = PIXI.Texture.from(shipPNG);

class Ship {
  constructor(name, id, range, speed, x, y, origin, destination) {
    this.lastUpdate = Date.now();
    this.scanning = false;
    this.scanningCircle = new PIXI.Graphics();
    this.scanProgress = 0;
    this.scanRange = range;
    this.scanSpeed = 1;
    this.scanCoordinates = { x: 0, y: 0 };
    this.name = name;
    this.id = id;
    this.range = range;
    this.speed = speed;
    this.position = { x, y };
    this.sprite = null;
    this.voyageLine = null;
    this.pathLine = null;
    this.shipNameText = null;
    this.origin = origin;
    this.destination = destination;
    this.distanceToDestination = 0;
    this.trips = [];
    this.plottingCourse = false;
    this.pathLineDrawn = false;
    this.showVoyageLines = true;
    this.directionX = this.origin.x > this.destination.x ? "west" : "east";
    this.directionY = this.origin.y > this.destination.y ? "north" : "south";
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
    // lines
    this.voyageLine = new PIXI.Graphics();

    this.pathLine = new PIXI.Graphics();
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
      x + 15,
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
      posX + 15,
      posY - this.shipNameText.height / 2 + 1.8
    );
  }
  getNewDestination(stars, sectorGrid) {
    const newDestination = getRandomStar(stars, {
      origin: this.position,
      distance: this.range,
      sectorGrid,
    });
    // getRandomStar(newUniverse.stars, {
    //   distance: range,
    //   origin,
    //   sectorGrid: newUniverse.sectorGrid,
    // });
    return newDestination;
  }
  getDistanceToTarget(target) {
    const { distance } = getDistanceAndAngleBetweenTwoPoints(
      { x: this.position.x, y: this.position.y },
      target
    );
    return distance;
  }
  getNewCoordinates(delta) {
    const { angle, distance } = getDistanceAndAngleBetweenTwoPoints(
      { x: this.position.x, y: this.position.y },
      this.destination
    );
    const vector = new Vector(this.speed, angle);
    const posX = this.position.x + vector.magnitudeX * delta;
    const posY = this.position.y + vector.magnitudeY * delta;
    const { directionX, directionY } = this.getNewDirection(
      posX,
      posY,
      this.destination
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
  arrive(destination) {
    const { x, y } = destination;
    this.distanceToDestination = 0;
    this.origin = destination;
    this.position.x = x;
    this.position.y = y;
    this.sprite.position.set(x, y);
  }
  drawVoyageLines() {
    if (this.showVoyageLines) {
      this.voyageLine.clear();
      this.voyageLine.lineStyle(2, colors.blue, 1);
      this.voyageLine.moveTo(this.origin.x, this.origin.y);
      this.voyageLine.lineTo(this.position.x, this.position.y);

      if (this.pathLineDrawn === false) {
        this.pathLineDrawn = true;
        this.pathLine.clear();
        this.pathLine.lineStyle(2, colors.blue, 0.25);
        this.pathLine.moveTo(this.destination.x, this.destination.y);
        this.pathLine.lineTo(this.position.x, this.position.y);
      }
    }
  }
  getDelta() {
    const now = Date.now();
    const delta = (now - this.lastUpdate) / calculationMultiplier;
    return delta;
  }
  move(stars, sectorGrid) {
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
        if (!this.scanning) {
          this.scanning = true;
          this.scanCoordinates = { ...this.position };
        }
        this.plottingCourse = true;
        this.arrive(this.destination);
        const newDestination = this.getNewDestination(stars, sectorGrid);
        const distance = this.getDistanceToTarget(newDestination);
        const { directionX, directionY } = this.getNewDirection(
          this.position.x,
          this.position.y,
          newDestination
        );
        const newPlot = {
          posX: this.destination.x,
          posY: this.destination.y,
          directionX,
          directionY,
          distance,
        };
        this.destination = newDestination;
        this.updatePosition(newPlot);
        this.pathLineDrawn = false;
        this.plottingCourse = false;
      }
    }
    this.drawVoyageLines();
  }
  update(stars, sectorGrid) {
    this.move(stars, sectorGrid);
    if (this.scanning) {
      this.scan();
    }
    this.timeStamp();
  }
}

export default Ship;
