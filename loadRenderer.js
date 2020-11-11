// RENDERING
import * as PIXI from "pixi.js";
import { DotFilter, GlowFilter } from "pixi-filters";
import { createApp, createViewport } from "./engine";
import ringPNG from "./assets/images/star-selection-ring.png";
import hoverRingPNG from "./assets/images/star-hover-ring.png";

// ASSETS
import starPNG from "./assets/images/star-indicator.png";

// CONFIG
import {
  colors,
  textResolution,
  lightSpeed,
  lightYear,
  pixelsPerLightyear,
  au,
  baseAPIurl,
} from "./config";

import {
  convertTime,
  renderDistance,
  Vector,
  getDistanceAndAngleBetweenTwoPoints,
  randomIntFromInterval,
} from "./helpers";
import { startCulling } from "./engine/culler";

PIXI.utils.skipHello();
PIXI.settings.RESOLUTION = window.devicePixelRatio;

// TEXTURE
const starTexture = PIXI.Texture.from(starPNG);

export default (universe) => {
  // BUTTONS
  const deselect = document.getElementById("deselect");
  const app = createApp(null, null, "view");
  const localApp = createApp(400, 400, "local_view");
  const viewContainer = document.getElementById("view");
  const localViewContainer = document.getElementById("local_view");
  const localViewTitle = document.getElementById("local_view_title");
  const localViewLoader = document.getElementById("local_view_loader");
  app.viewport = createViewport(app, null, { minScale: 0.5, maxScale: 2 });
  localApp.viewport = createViewport(localApp, {
    worldHeight: 400,
    worldWidth: 400,
    screenHeight: 400,
    screenWidth: 400,
  });
  viewContainer.appendChild(app.view);
  localViewContainer.appendChild(localApp.view);

  // handle viewport resize
  function updateViewportSize() {
    const { width, height } = viewContainer.getBoundingClientRect();
    app.viewport.resize(width, height);
    app.viewport.initialWidth = width;
    app.viewport.dirty = true;
  }
  window.onresize = updateViewportSize;

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

  // create containers
  const shipContainer = new PIXI.Container();
  const starContainer = new PIXI.Container();
  const indicatorContainer = new PIXI.Container();
  const textContainer = new PIXI.Container();
  const voyageContainer = new PIXI.Container();
  const lineContainer = new PIXI.Container();
  const localMapContainer = new PIXI.Container();

  // add containers to viewport
  app.viewport.addChild(voyageContainer);
  app.viewport.addChild(starContainer);
  app.viewport.addChild(shipContainer);
  app.viewport.addChild(indicatorContainer);
  app.viewport.addChild(lineContainer);
  app.viewport.addChild(textContainer);
  localApp.viewport.addChild(localMapContainer);

  const orbits = new PIXI.Graphics();
  localMapContainer.addChild(orbits);
  const selectionLine = new PIXI.Graphics();
  selectionLine.filters = [
    new GlowFilter({
      quality: 1,
      color: colors.blueGlow,
      distance: 10,
      outerStrength: 1,
    }),
  ];

  lineContainer.addChild(selectionLine);

  let localStarSprites = null;
  function clearPlanets() {
    localViewTitle.innerHTML = `SYS:...<br>BDS:...`;
    orbits.clear();
    if (localStarSprites) {
      localStarSprites.forEach((sprite) => {
        sprite.destroy();
      });
      localStarSprites = null;
    }
  }
  function makePlanets(total, title) {
    localViewTitle.innerHTML = `SYS:${title}<br>BDS:${total - 1}`;
    orbits.clear();
    if (localStarSprites) {
      localStarSprites.forEach((sprite) => {
        sprite.destroy();
      });
    }
    localStarSprites = new Array(total).fill(undefined).map((e, i) => {
      orbits.lineStyle(1, colors.white); //(thickness, color)

      const height = i === 0 ? 14 : 5;
      const pivot = i === 0 ? 0 : randomIntFromInterval(42, 47) * i;
      const localStarSprite = new PIXI.Sprite(starTexture);
      localStarSprite.position.set(442 / 2, 442 / 2);
      localStarSprite.tint = colors.white;
      localStarSprite.anchor.set(0.5);
      localStarSprite.pivot.set(pivot, 0);
      // localStarSprite.interactive = true;
      // localStarSprite.buttonMode = true;
      localStarSprite.height = height;
      localStarSprite.width = height;
      localStarSprite.speed = i === 0 ? 0 : 0.1 / pivot;
      // localStarSprite.speed = 0.01;
      localStarSprite.rotation = randomIntFromInterval(0, 10000);
      orbits.drawCircle(442 / 2, 442 / 2, pivot * (height / 12)); //(x,y,radius)
      return localStarSprite;
    });

    for (const localStarSprite of localStarSprites) {
      localMapContainer.addChild(localStarSprite);
    }
  }

  // create star info text
  const starText = new PIXI.Text("star", {
    ...textStyle,
  });
  starText.resolution = textResolution;
  starText.visible = false;

  const shipInfoText = new PIXI.Text("ship info", {
    ...textStyle,
  });
  shipInfoText.resolution = textResolution;
  shipInfoText.visible = false;

  textContainer.addChild(shipInfoText);
  textContainer.addChild(starText);

  // create star hover ring sprite
  const hoverRingTexture = PIXI.Texture.from(hoverRingPNG);
  const hoverRingSprite = new PIXI.Sprite(hoverRingTexture);
  hoverRingSprite.anchor.set(0.5);
  hoverRingSprite.height = 50;
  hoverRingSprite.interactive = false;
  hoverRingSprite.tint = colors.yellow;
  hoverRingSprite.visible = false;
  hoverRingSprite.width = 50;

  // add star hover ring sprite to star container
  indicatorContainer.addChild(hoverRingSprite);

  // create star selection ring sprite
  // const ringTexture = PIXI.Texture.from(ringPNG);
  // const ringSprite = new PIXI.Sprite(ringTexture);
  // ringSprite.anchor.set(0.5);
  // ringSprite.height = 30;
  // ringSprite.interactive = false;
  // ringSprite.tint = colors.yellow;
  // ringSprite.tint = colors.blue;

  // ringSprite.visible = false;
  // ringSprite.width = 30;

  // add star selection ring sprite to star container
  // indicatorContainer.addChild(ringSprite);
  let selectedStar = null;
  deselect.addEventListener("click", () => {
    selectedStar = null;
    // ringSprite.visible = false;
    starText.visible = false;
  });
  // add stars to container
  for (const star in universe.stars) {
    const starSprite = universe.stars[star].createSprite();
    // add star event handlers
    starSprite.on("mouseover", (ev) => {
      // only handle hover if the hovered star is not already selected
      if (!selectedStar || selectedStar.id !== ev.target.star.id) {
        hoverRingSprite.position.set(ev.target.x, ev.target.y);
        hoverRingSprite.visible = true;
      }
    });
    starSprite.on("mouseout", (ev) => {
      hoverRingSprite.visible = false;
    });
    starSprite.on("pointerdown", async (ev) => {
      ev.stopPropagation();
      const clickedStar = ev.target.star;
      let apiStar;
      if (
        (selectedStar && selectedStar.id !== clickedStar.id) ||
        !selectedStar
      ) {
        clearPlanets();
        localViewLoader.classList.remove("hidden");
        apiStar = fetch(`${baseAPIurl}/api/stars/${clickedStar.id}`)
          .then((res) => res.json())
          .then((jsonData) => {
            const { star } = jsonData;
            return star;
          })
          .catch((err) => console.log(err));
      }

      hoverRingSprite.visible = false;
      if (selectedStar && selectedStar.id === clickedStar.id) {
        app.viewport.snap(clickedStar.x, clickedStar.y, {
          time: 500,
          removeOnComplete: true,
          removeOnInterrupt: true,
          forceStart: true,
        });
        app.viewport.snapZoom({
          width: app.viewport.initialWidth,
          time: 750,
          removeOnComplete: true,
          removeOnInterrupt: true,
          forceStart: true,
        });
      }

      // ringSprite.visible = true;
      // ringSprite.position.set(ev.target.x, ev.target.y);
      starText.text = `${clickedStar.name}`;

      starText.visible = true;
      starText.position.set(
        clickedStar.x + 21,
        clickedStar.y - starText.height / 2 + 1.8
      );

      if (
        (selectedStar && selectedStar.id !== clickedStar.id) ||
        !selectedStar
      ) {
        apiStar.then((data) => {
          console.log(data);
          localViewLoader.classList.add("hidden");
          makePlanets(data.planets.length + 1, data.name);
        });
      }
      selectedStar = {
        id: clickedStar.id,
        x: clickedStar.x,
        y: clickedStar.y,
      };
    });
    starContainer.addChild(starSprite);
  }

  let selectedShip;
  for (const ship of universe.ships) {
    const shipSprite = ship.createSprite();
    shipContainer.addChild(shipSprite);
    voyageContainer.addChild(ship.voyageLine);
    voyageContainer.addChild(ship.pathLine);
    textContainer.addChild(ship.shipNameText);

    shipSprite.on("pointerdown", async (ev) => {
      selectedShip = ev.target;
      const clickedShip = ev.target.ship;
      const apiShip = fetch(`${baseAPIurl}/api/ships/${clickedShip.id}`)
        .then((res) => res.json())
        .then((jsonData) => {
          const { ship } = jsonData;
          return ship;
        })
        .catch((err) => console.log(err));
      apiShip.then((data) => console.log(data));
    });
  }

  startCulling([starContainer, shipContainer], app.viewport);

  function drawSelectionLine(start, end) {
    const { angle } = getDistanceAndAngleBetweenTwoPoints(
      { x: start.x, y: start.y },
      { x: end.x, y: end.y }
    );
    const vector = new Vector(15, angle);
    const lineStartX = start.x + vector.magnitudeX;
    const lineStartY = start.y + vector.magnitudeY;

    selectionLine.moveTo(lineStartX, lineStartY);
    selectionLine.lineTo(end.x, end.y);
  }

  const loadingText = document.getElementById("loading_text");
  loadingText.classList.add("hidden");
  app.ticker.add(() => {
    const bounds = app.viewport.getVisibleBounds();
    const boundary = {
      xmin: bounds.x,
      xmax: bounds.x + bounds.width,
      ymin: bounds.y,
      ymax: bounds.y + bounds.height,
    };
    if (hoverRingSprite.visible) {
      hoverRingSprite.rotation += 0.025;
    }
    if (selectedStar) {
      // ringSprite.alpha = 0;
      if (localStarSprites) {
        localStarSprites.forEach((localStarSprite) => {
          localStarSprite.rotation += localStarSprite.speed;
        });
      }
      if (localViewContainer.classList.contains("hidden")) {
        localViewContainer.classList.remove("hidden");
      }

      // draw selection lines
      selectionLine.clear();
      selectionLine.lineStyle(2 / app.viewport.scaled, colors.blue, 1);

      selectionLine.drawCircle(selectedStar.x, selectedStar.y, 15);
      // selectionLine.drawRect(selectedStar.x - 15, selectedStar.y - 15, 30, 30);
      // draw line to top right
      if (
        selectedStar &&
        (selectedStar.x > bounds.x + 474 / app.viewport.scaled ||
          selectedStar.y < bounds.y + 26.5 / app.viewport.scaled)
      ) {
        drawSelectionLine(
          { x: selectedStar.x, y: selectedStar.y },
          {
            x: bounds.x + 474 / app.viewport.scaled,
            y: bounds.y + 26.5 / app.viewport.scaled,
          }
        );
      }

      // draw line to bottom right
      if (
        selectedStar &&
        (selectedStar.y > bounds.y + 474 / app.viewport.scaled ||
          selectedStar.x > bounds.x + 474 / app.viewport.scaled)
      ) {
        drawSelectionLine(
          { x: selectedStar.x, y: selectedStar.y },
          {
            x: bounds.x + 474 / app.viewport.scaled,
            y: bounds.y + 474 / app.viewport.scaled,
          }
        );
      }

      // draw line to bottom left
      if (
        selectedStar &&
        (selectedStar.y > bounds.y + 474 / app.viewport.scaled ||
          selectedStar.x < bounds.x + 26.5 / app.viewport.scaled)
      ) {
        drawSelectionLine(
          { x: selectedStar.x, y: selectedStar.y },
          {
            x: bounds.x + 26.5 / app.viewport.scaled,
            y: bounds.y + 474 / app.viewport.scaled,
          }
        );
      }

      // draw line to top left
      if (
        selectedStar &&
        (selectedStar.y < bounds.y + 26.5 / app.viewport.scaled ||
          selectedStar.x < bounds.x + 26.5 / app.viewport.scaled)
      ) {
        drawSelectionLine(
          { x: selectedStar.x, y: selectedStar.y },
          {
            x: bounds.x + 26.5 / app.viewport.scaled,
            y: bounds.y + 26.5 / app.viewport.scaled,
          }
        );
      }
    } else {
      selectionLine.clear();
      if (!localViewContainer.classList.contains("hidden")) {
        localViewContainer.classList.add("hidden");
      }
    }
    for (const ship of universe.ships) {
      if (
        (selectedShip &&
          ship.id === selectedShip.id &&
          ship.plottingCourse === false) ||
        (ship.position.x > boundary.xmin &&
          ship.position.x < boundary.xmax &&
          ship.position.y > boundary.ymin &&
          ship.position.y < boundary.ymax &&
          ship.plottingCourse === false)
      ) {
        ship.move(universe.stars);
      }
      if (selectedShip && ship.id === selectedShip.id) {
        const currentTime = convertTime(
          ship.distanceToDestination / ship.speed / 60
        ); // divide by 60 to get seconds
        const currentDistance = renderDistance(
          ship.distanceToDestination,
          pixelsPerLightyear
        );
        const currentSpeed = ship.speed / (lightSpeed / lightYear);
        shipInfoText.text = `NM:${ship.name}\nID:${ship.id}\nDIR:${
          ship.directionY
        }-${ship.directionX}\nDES:${ship.destination.name}\nORIG:${
          ship.origin.name
        }\nETA:${currentTime}\nDIST(m):${currentDistance}\nDIST(au):${(
          ((ship.distanceToDestination / pixelsPerLightyear) * lightYear) /
          au
        ).toLocaleString()}au\nDIST(ly):${(
          ((ship.distanceToDestination / pixelsPerLightyear) * lightYear) /
          lightYear
        ).toLocaleString()}ly\nVEL(c):${currentSpeed.toLocaleString()}c\nVEL(m/s):${(
          currentSpeed * lightSpeed
        ).toLocaleString()}m/s`;
        shipInfoText.position.set(
          selectedShip.position.x - 5,
          selectedShip.position.y - shipInfoText.height - 13
        );
        shipInfoText.visible = true;
      }
    }
  });
  return app;
};
