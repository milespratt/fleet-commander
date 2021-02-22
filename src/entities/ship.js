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
  randomIntFromInterval,
  getRandomArrayElement,
} from "../helpers";

// TEXTURE
const shipTexture = PIXI.Texture.from(shipPNG);

import { statuses } from "../config";

class Ship {
  constructor(name, id, range, x, y, origin, destination, universe) {
    this.autopilot = false;
    this.universe = universe;
    this.lastUpdate = Date.now();
    this.scanning = false;
    this.scanningGraphics = new PIXI.Graphics();
    this.voyageGraphics = new PIXI.Graphics();
    this.routeGraphics = new PIXI.Graphics();
    this.scanProgress = 0;
    this.scanRange = range;
    this.scanSpeed = 1;
    this.scanCoordinates = { x: 0, y: 0 };
    this.name = name;
    this.id = id;
    this.range = range;
    this.route = null;
    this.spoolTime = 0;
    this.spoolReq = randomIntFromInterval(1, 10); //seconds
    this.actions = {};
    // ACCELERATION 447040m/s = 1 million mph
    // this.baseAcceleration = (lightSpeed / lightYear) * (1 / lightSpeed); // 1m/s
    // this.acceleration = 0; // 1m/s
    // this.maxAcceleration = (lightSpeed / lightYear) * 1; // 100% the speed of light
    // this.maxAcceleration = (lightSpeed / lightYear) * (1000000000 / lightSpeed); // 1000000000m/s
    // SPEED
    this.speed = 0;
    // this.speed = (lightSpeed / lightYear) * (447040 / lightSpeed); // 447040m/s
    this.maxSpeed = (lightSpeed / lightYear) * 100000000; // 80% the speed of light
    // this.maxSpeed = (lightSpeed / lightYear) * (447040 / lightSpeed); // 447040m/s
    this.warpSpeed = (lightSpeed / lightYear) * 1;
    this.location = origin;
    this.position = { x, y };
    this.sprite = null;
    this.shipNameText = null;
    this.origin = origin;
    this.status = statuses.idle;
    this.destination = destination;
    this.distanceToDestination = 0;
    this.tripDistance = 0;
    this.trips = [];
    this.plottingCourse = false;
    this.directionX =
      this.origin.position.x > this.destination.position.x ? "west" : "east";
    this.directionY =
      this.origin.position.y > this.destination.position.y ? "north" : "south";
  }
  engageAutopilot() {
    console.log("autopilot engaged");
    this.autopilot = true;
  }
  disengageAutopilot() {
    console.log("autopilot disengaged");
    this.autopilot = false;
  }
  timeStamp() {
    this.lastUpdate = Date.now();
  }
  stopScan() {
    this.scanning = false;
    this.scanProgress = 0;
  }
  scan() {
    this.scanCoordinates = { ...this.position };
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
    const newDestination = getRandomArrayElement(starsInRange);
    return newDestination;
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
      target.position
    );
    return distance;
  }
  getNewCoordinates(delta) {
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

  scanLaunch() {
    setTimeout(
      () => {
        this.scan();
        setTimeout(() => {
          this.plot();
        }, randomIntFromInterval(2000, 5000));
      },
      1000,
      5000
    );
  }
  arrive() {
    this.status = statuses.idle;
    this.speed = 0;
    this.acceleration = 0;
    this.distanceToDestination = 0;
    const { x, y } = this.destination.position;
    this.origin = this.destination;
    this.location = this.destination;
    const newPlot = {
      posX: x,
      posY: y,
      directionX: this.directionX,
      directionY: this.directionY,
      distance: this.distanceToDestination,
    };
    this.updatePosition(newPlot);
    this.voyageGraphics.clear();
    // AUTOPILOT
    if (this.route && this.route.length > 0) {
      const nextDestination = this.route.shift();
      this.plot(nextDestination.end);
    } else if (this.autopilot && (!this.route || this.route.length === 0)) {
      this.disengageAutopilot();
    }
  }
  drawVoyageGraphics() {
    // this.voyageGraphics.clear();
    this.voyageGraphics.lineStyle(2, colors.blue, 1);
    // voyage line (from origin to position)
    this.voyageGraphics.moveTo(this.origin.position.x, this.origin.position.y);
    this.voyageGraphics.lineTo(this.position.x, this.position.y);

    // path line (from position to destination)
    // this.voyageGraphics.lineStyle(1, colors.blue, 0.5);
    // this.voyageGraphics.moveTo(
    //   this.destination.position.x,
    //   this.destination.position.y
    // );
    // this.voyageGraphics.lineTo(this.position.x, this.position.y);
  }
  plot(destination) {
    if (destination) {
      this.destination = destination;
    } else {
      this.destination = this.getNewDestination();
    }
    if (this.destination) {
      const distance = this.getDistanceToTarget(this.destination);
      const { directionX, directionY } = this.getNewDirection(
        this.position.x,
        this.position.y,
        this.destination.position
      );
      this.distanceToDestination = distance;
      this.tripDistance = distance;
      this.directionX = directionX;
      this.directionY = directionY;
      this.routeGraphics.lineStyle(1, colors.blue, 0.5); //(thickness, color, alpha)
      this.routeGraphics.moveTo(this.position.x, this.position.y);
      this.routeGraphics.lineTo(destination.position.x, destination.position.y);
      // this.drawVoyageGraphics();
      // AUTO MOVE
      if (this.autopilot) {
        setTimeout(() => {
          this.launch();
        }, 1000);
      }
    } else {
      console.log("No Destination!");
    }
  }
  launch() {
    if (this.status === statuses.idle || this.status === statuses.spooling) {
      const distance = this.getDistanceToTarget(this.destination);
      this.tripDistance = distance;
      this.scanning = false;
      this.scanningGraphics.clear();
      this.status = statuses.travelling;
      this.speed = this.maxSpeed;
      this.location = null;
    } else {
      console.log(`Cannot launch in current status: ${this.status}`);
    }
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
  plotCourse(star) {
    console.log("plot");
    // pathfind
    console.log("pathfind!");
    const route = this.universe.getRoute(this.location, star, this.range);
    console.log(route);
    this.routeGraphics.clear();
    this.routeGraphics.lineStyle(1, colors.yellow, 0.5); //(thickness, color, alpha)
    route.forEach((leg, i) => {
      // if (i === 0) {
      //   return;
      // }
      this.routeGraphics.moveTo(leg.start.position.x, leg.start.position.y);
      this.routeGraphics.lineTo(leg.end.position.x, leg.end.position.y);
    });
    const firstDestination = route.shift();

    this.plot(firstDestination.end);
    this.route = route;
  }
  update() {
    const delta = this.getDelta();
    if (this.status === statuses.travelling) {
      this.move();
      this.drawVoyageGraphics();
    }
    // if (this.status === statuses.mining) {
    //   this.mine(delta);
    // }
    Object.values(this.actions).forEach((action) => action(delta));
    // if (this.destination) {
    //   this.drawVoyageGraphics();
    // }
    this.timeStamp();
  }
}

export default Ship;
