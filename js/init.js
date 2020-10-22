// PIXI
import * as PIXI from "pixi.js";
PIXI.utils.skipHello();

// CONFIG
import {
  generationParameters,
  calculationMultiplier,
  pixelsPerLightyear,
  lightSpeed,
  lightYear,
  au,
  textResolution,
  shipNames,
  colors,
} from "./config";

// HELPERS
import {
  generateUniverse,
  getType,
  getClass,
  getTemp,
  getStarSize,
  getStarRadius,
  getStarMass,
  getStarAge,
  Vector,
  getDistanceAndAngleBetweenTwoPoints,
  getRandomStar,
  convertTime,
  renderDistance,
  getShipName,
  getID,
} from "./helpers";

// RENDERING
import { createApp } from "./app";
import { createViewport } from "./viewport";

// ASSETS
import starPNG from "../assets/star-indicator.png";
import shipPNG from "../assets/ship-indicator.png";
import ringPNG from "../assets/star-selection-ring.png";
import hoverRingPNG from "../assets/star-hover-ring.png";

// TEXT STYLES
const textStyle = new PIXI.TextStyle({
  fontFamily: "Inconsolata",
  letterSpacing: 1.75,
  lineHeight: 13,
  fontSize: 12,
  fontWeight: 700,
  fill: "white",
  stroke: "black",
  strokeThickness: 1,
});

// generate universe
let universe = generateUniverse(generationParameters);

// CREATE PIXI APP
const app = createApp();
const viewport = createViewport(app);
document.body.appendChild(app.view);

// CONTAINERS

// create containers
const shipContainer = new PIXI.Container();
const starContainer = new PIXI.Container();
const textContainer = new PIXI.Container();
const voyageContainer = new PIXI.Container();

// add containers to viewport
viewport.addChild(voyageContainer);
viewport.addChild(starContainer);
viewport.addChild(shipContainer);
viewport.addChild(textContainer);

// TEXTURES
const hoverRingTexture = PIXI.Texture.from(hoverRingPNG);
const ringTexture = PIXI.Texture.from(ringPNG);
const shipTexture = PIXI.Texture.from(shipPNG);
const starTexture = PIXI.Texture.from(starPNG);

// GLOBAL SPRITES

// create star selection ring sprite
const ringSprite = new PIXI.Sprite(ringTexture);
ringSprite.anchor.set(0.5);
ringSprite.height = 30;
ringSprite.interactive = false;
ringSprite.tint = colors.yellow;
ringSprite.visible = false;
ringSprite.width = 30;

// add star selection ring sprite to star container
starContainer.addChild(ringSprite);

// create star hover ring sprite
const hoverRingSprite = new PIXI.Sprite(hoverRingTexture);
hoverRingSprite.anchor.set(0.5);
hoverRingSprite.height = 50;
hoverRingSprite.interactive = false;
hoverRingSprite.tint = colors.yellow;
hoverRingSprite.visible = false;
hoverRingSprite.width = 50;

// add star hover ring sprite to star container
starContainer.addChild(hoverRingSprite);

// STARS

// create star info text
const starText = new PIXI.Text("star", {
  ...textStyle,
});
starText.resolution = textResolution;
starText.visible = false;

// function to create star
function generateStar(star) {
  const newStar = { ...star };

  newStar.type = getType();
  newStar.class = getClass();
  newStar.temp = getTemp(newStar.type);
  newStar.size = getStarSize(newStar.class, 10);
  newStar.radius = getStarRadius(newStar.size);
  newStar.mass = getStarMass(newStar.size);
  newStar.age = getStarAge(newStar.type);
  newStar.id = getID();
  return newStar;
}

// star handlers
let selectedStar = null;
const starClickHandler = (ev) => {
  hoverRingSprite.visible = false;
  selectedStar = ev.target.star.id;
  viewport.snap(ev.target.x, ev.target.y, {
    time: 500,
    removeOnComplete: true,
    removeOnInterrupt: true,
    forceStart: true,
  });
  ringSprite.visible = true;
  ringSprite.position.set(ev.target.x, ev.target.y);
  const clickedStar = ev.target.star;

  starText.text = `${clickedStar.name}`;

  // `ID:${clickedStar.name}\nS-TYPE:${clickedStar.type}\nCLASS:${
  //   clickedStar.class
  // }\nTEMP:${clickedStar.temp.toLocaleString()}K\nRADIUS:${clickedStar.radius.toLocaleString()}KM\nMASS:${
  //   clickedStar.mass
  // }SOL\nAGE:${clickedStar.age.toLocaleString()}Y`;

  starText.visible = true;
  starText.position.set(
    clickedStar.x + 21,
    clickedStar.y - starText.height / 2 + 1.8
  );
};

// render stars

universe.stars.forEach((star) => {
  const starSprite = new PIXI.Sprite(starTexture);

  const newStar = generateStar(star);
  starSprite.tint = colors.white;
  starSprite.anchor.set(0.5);
  starSprite.star = newStar;
  starSprite.interactive = true;
  starSprite.buttonMode = true;
  starSprite.height = newStar.size;
  starSprite.width = newStar.size;

  starSprite.position.set(newStar.x, newStar.y);
  // hit area
  const hitAreaSize = 50; // pixels
  const hitAreaScalePercentage = newStar.size * (hitAreaSize / newStar.size);
  const hitAreaCoordinates = [
    0, // x
    0, // y
    hitAreaScalePercentage, // radius
  ];
  const hitAreaPreview = new PIXI.Graphics();
  hitAreaPreview.lineStyle(2, colors.white);
  hitAreaPreview.drawCircle(...hitAreaCoordinates);
  // starSprite.addChild(hitAreaPreview);
  starSprite.hitArea = new PIXI.Circle(...hitAreaCoordinates);
  starContainer.addChild(starSprite);
  // hit area
  starSprite.on("mouseover", (ev) => {
    if (!selectedStar || selectedStar !== ev.target.star.id) {
      hoverRingSprite.position.set(ev.target.x, ev.target.y);
      hoverRingSprite.visible = true;
    }
  });
  starSprite.on("mouseout", (ev) => {
    hoverRingSprite.visible = false;
  });
  starSprite.on("click", starClickHandler);
});
textContainer.addChild(starText);

// generate ships
let hoverShip = null;
let selectedShip = null;

const shipInfoText = new PIXI.Text("ship", {
  ...textStyle,
});
shipInfoText.resolution = textResolution;
shipInfoText.visible = false;
textContainer.addChild(shipInfoText);

const shipSpeedMultiplier = 1000000;
function Ship(shipName) {
  const shipSprite = new PIXI.Sprite(shipTexture);
  shipContainer.addChild(shipSprite);
  // shipSprite.speed = 0.05;
  shipSprite.speed = (lightSpeed / lightYear) * shipSpeedMultiplier; // pixels per second
  shipSprite.range = 300;
  const origin = getRandomStar(universe.stars);
  const destination = getRandomStar(universe.stars, {
    origin,
    distance: shipSprite.range,
  });
  shipSprite.pathing = false;
  shipSprite.id = getID();
  shipSprite.height = 10;
  shipSprite.width = 10;
  shipSprite.name = shipName;
  shipSprite.tint = colors.blue;
  shipSprite.anchor.set(0.5);
  shipSprite.interactive = true;
  shipSprite.buttonMode = true;
  shipSprite.visible = true;
  shipSprite.position.set(origin.x, origin.y);
  shipSprite.origin = origin;
  shipSprite.destination = destination;
  shipSprite.directionX =
    shipSprite.origin.x > shipSprite.destination.x ? "west" : "east";
  shipSprite.directionY =
    shipSprite.origin.y > shipSprite.destination.y ? "north" : "south";

  // lines
  shipSprite.voyageLine = new PIXI.Graphics();
  voyageContainer.addChild(shipSprite.voyageLine);

  shipSprite.pathLine = new PIXI.Graphics();
  voyageContainer.addChild(shipSprite.pathLine);
  // trips
  shipSprite.trips = [];
  shipSprite.trips.push({
    o: shipSprite.origin,
    d: shipSprite.destination,
  });
  // name text
  shipSprite.shipNameText = new PIXI.Text("ship", {
    ...textStyle,
  });
  shipSprite.shipNameText.resolution = textResolution;
  shipSprite.shipNameText.visible = true;
  shipSprite.shipNameText.text = `${shipSprite.name}`;
  // handlers
  shipSprite.on("mouseover", (ev) => {
    // hoverShip = shipSprite;
    shipSprite.height = 14;
    shipSprite.width = 14;
    // shipInfoText.visible = true;
  });
  shipSprite.on("mouseout", (ev) => {
    // hoverShip = null;
    shipSprite.height = 10;
    shipSprite.width = 10;
    // shipInfoText.visible = false;
  });
  shipSprite.on("click", (ev) => {
    selectedShip = ev.target;
  });

  textContainer.addChild(shipSprite.shipNameText);

  // hit area
  const hitAreaSize = 30; // pixels
  const hitAreaScalePercentage = 10 * (hitAreaSize / 10);
  const hitAreaCoordinates = [
    0, // x
    0, // y
    hitAreaScalePercentage, // radius
  ];
  const hitAreaPreview = new PIXI.Graphics();
  hitAreaPreview.lineStyle(2, colors.blue);
  hitAreaPreview.drawCircle(...hitAreaCoordinates);
  // shipSprite.addChild(hitAreaPreview);
  shipSprite.hitArea = new PIXI.Circle(...hitAreaCoordinates);

  // return ship
  return shipSprite;
}

// const ships = shipNames.map((shipName) => {
//   return new Ship(shipName);
// });

const ships = [];
// const shipLimit = 1;
const shipLimit = shipNames.length;
for (let i = 0; i < shipLimit; i++) {
  ships.push(new Ship(shipNames[i]));
}

// viewport.follow(ships[0]);

let lastUpdate = Date.now();
const lines = true;
function moveShip(delta, ship) {
  // ship movement

  ship.shipNameText.position.set(
    ship.position.x + 15,
    ship.position.y - ship.shipNameText.height / 2 + 1.8
  );
  const { angle, distance } = getDistanceAndAngleBetweenTwoPoints(
    { x: ship.position.x, y: ship.position.y },
    ship.destination
  );
  const newVector = new Vector(ship.speed, angle);
  ship.distanceToDestination = distance;
  const newShipX = ship.position.x + newVector.magnitudeX * delta;
  const newShipY = ship.position.y + newVector.magnitudeY * delta;
  const newDirectionX = newShipX > ship.destination.x ? "west" : "east";
  const newDirectionY = newShipY > ship.destination.y ? "north" : "south";
  const currentDistance = renderDistance(
    ship.distanceToDestination,
    pixelsPerLightyear
  );
  const currentTime = convertTime(ship.distanceToDestination / ship.speed / 60); // divide by 60 to get seconds
  const currentSpeed = ship.speed / (lightSpeed / lightYear);
  if (selectedShip && ship.id === selectedShip.id) {
    shipInfoText.text = `NM:${ship.name}\nID:${ship.id}\nDES:${
      ship.destination.name
    }\nORIG:${ship.origin.name}\nDIR:${newDirectionY
      .charAt(0)
      .toUpperCase()}${newDirectionX
      .charAt(0)
      .toUpperCase()}\nETA:${currentTime}\nDIST(m):${currentDistance}\nDIST(au):${(
      ((ship.distanceToDestination / pixelsPerLightyear) * lightYear) /
      au
    ).toLocaleString()}au\nDIST(ly):${(
      ((ship.distanceToDestination / pixelsPerLightyear) * lightYear) /
      lightYear
    ).toLocaleString()}ly\nVEL(c):${currentSpeed.toLocaleString()}c\nVEL(m/s):${(
      currentSpeed * lightSpeed
    ).toLocaleString()}m/s`;
  }
  if (newDirectionX !== ship.directionX || newDirectionY !== ship.directionY) {
    ship.distanceToDestination = 0;
    ship.position.x = ship.destination.x;
    ship.position.y = ship.destination.y;
  }
  if (ship.distanceToDestination > 0) {
    ship.position.set(
      ship.position.x + newVector.magnitudeX * delta,
      ship.position.y + newVector.magnitudeY * delta
    );
    if (lines) {
      ship.voyageLine.clear();
      ship.voyageLine.lineStyle(2, colors.blue, 1);
      ship.voyageLine.moveTo(ship.origin.x, ship.origin.y);
      ship.voyageLine.lineTo(ship.position.x, ship.position.y);
      if (!ship.pathing) {
        ship.pathing = true;
        ship.pathLine.clear();
        ship.pathLine.lineStyle(2, colors.blue, 0.25);
        ship.pathLine.moveTo(ship.destination.x, ship.destination.y);
        ship.pathLine.lineTo(ship.position.x, ship.position.y);
      }
    }
  } else {
    ship.origin = ship.destination;
    ship.position.set(ship.origin.x, ship.origin.y);
    ship.destination = getRandomStar(universe.stars, {
      origin: { x: ship.origin.x, y: ship.origin.y },
      distance: ship.range,
    });
    ship.trips.push({ o: ship.origin, d: ship.destination });

    ship.directionX = ship.origin.x > ship.destination.x ? "west" : "east";
    ship.directionY = ship.origin.y > ship.destination.y ? "north" : "south";
    if (lines) {
      ship.pathLine.clear();
      ship.pathLine.lineStyle(2, colors.blue, 0.25);
      ship.pathLine.moveTo(ship.destination.x, ship.destination.y);
      ship.pathLine.lineTo(ship.position.x, ship.position.y);
    }
  }
  // ship movement
}
let benchmark = true;
app.ticker.add(() => {
  //
  // DELTA
  const now = Date.now();
  const elapsed = (now - lastUpdate) / calculationMultiplier;
  lastUpdate = now;
  const delta = elapsed;
  // DELTA
  //

  //
  // SHIP UPDATES
  ships.forEach((ship) => {
    moveShip(delta, ship);
  });
  if (selectedShip) {
    if (!shipInfoText.visible) {
      shipInfoText.visible = true;
    }
    shipInfoText.position.set(
      selectedShip.position.x - 5,
      selectedShip.position.y - shipInfoText.height - 13
    );
  }
  // animate hover ring
  if (hoverRingSprite.visible) {
    hoverRingSprite.rotation += 0.025;
  }
  // handle click selection box
  if (viewport.clickCount > 0) {
    if (now - viewport.clickedAt >= viewport.doubleClickTimeout) {
      viewport.clickCount = 0;
    }
  }
  if (viewport.clickSprite.visible) {
    viewport.clickSprite.alpha -= 0.01;
    if (viewport.clickSprite.alpha <= 0) {
      viewport.clickSprite.visible = false;
    }
  }
  // SHIP UPDATES
  //
  if (benchmark) {
    const after = Date.now();
    const loopTime = after - now;
    if (loopTime > calculationMultiplier) {
      console.log("");
      console.log(`WARNING: ${loopTime}ms loop`);
      console.log("");
    }
    // else {
    //   console.log(`${loopTime}ms loop`);
    // }
  }
});
