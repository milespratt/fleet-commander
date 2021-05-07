// RENDERING
import * as PIXI from "pixi.js";
import { AdvancedBloomFilter, GlowFilter, OutlineFilter } from "pixi-filters";
import { createApp, createViewport } from "./engine";
import Stats from "stats.js";
import ringPNG from "./assets/images/star-selection-ring.png";
import hoverRingPNG from "./assets/images/star-hover-ring.png";

// ASSETS
import starPNG from "./assets/images/star-indicator.png";
import mousePNG from "./assets/images/mouse.png";
import pinkMousePNG from "./assets/images/pinkMouse.png";
import starMousePNG from "./assets/images/starMouse.png";
import shipMousePNG from "./assets/images/shipMouse.png";

import loop from "./loop";

// CONFIG
import {
  colors,
  textResolution,
  lightSpeed,
  lightYear,
  pixelsPerLightyear,
  au,
  baseAPIurl,
  statuses,
} from "./config";

import {
  convertTime,
  renderDistance,
  Vector,
  getDistanceAndAngleBetweenTwoPoints,
  randomIntFromInterval,
  intersection,
  getRandomArrayElement,
} from "./helpers";
import { startCulling } from "./engine/culler";

PIXI.utils.skipHello();

// TEXTURE
const starTexture = PIXI.Texture.from(starPNG);

export default (universe) => {
  // SHIP BUTTONS
  const deselect = document.getElementById("deselect");
  const scan = document.getElementById("scan");
  const launch = document.getElementById("launch");
  const autopilot = document.getElementById("ship_autopilot");
  const snapshot = document.getElementById("snapshot");
  const centerShip = document.getElementById("centerShip");
  const followShip = document.getElementById("followShip");
  const mine = document.getElementById("mine");
  // SHIP BUTTONS

  // DOM
  const viewportID = "view";
  // const viewContainer = document.getElementById("view");
  const viewContainer = document.getElementById(viewportID);
  const localViewContainer = document.getElementById("local_view");
  const localViewTitle = document.getElementById("local_view_title");
  const localViewLoader = document.getElementById("local_view_loader");
  const loadingText = document.getElementById("loading_text");
  const errorText = document.getElementById("error_text");
  const errorTextText = document.getElementById("error_text_text");

  // ERROR LINE
  const errorLine = new PIXI.Graphics();
  errorLine.lineStyle(2, colors.pink); //(thickness, color)
  let errorPosition = { origin: { x: 0, y: 0 }, destination: { x: 0, y: 0 } };
  // ERROR LINE

  // APPS
  const app = createApp(null, null, viewportID);

  app.renderer.plugins.interaction.cursorStyles.default = `url(${shipMousePNG}) 16 16,auto`;
  app.renderer.plugins.interaction.cursorStyles.star = `url(${pinkMousePNG}) 16 16,auto`;
  app.renderer.plugins.interaction.cursorStyles.ship = `url(${pinkMousePNG}) 16 16,auto`;

  // VIEWPORTS
  app.viewport = createViewport(app, null, { minScale: 0.25, maxScale: 2 });
  viewContainer.appendChild(app.view);

  // handle viewport resize
  function updateViewportSize() {
    const { width, height } = viewContainer.getBoundingClientRect();
    app.viewport.resize(width, height);
    app.viewport.initialWidth = width;
    app.viewport.clamp({
      direction: "all",
      underflow: "center",
    });
    app.viewport.dirty = true;
  }
  window.onresize = updateViewportSize;
  // VIEWPORTS

  // TEXT STYLES
  const textStyle = new PIXI.TextStyle({
    fontFamily: ["Inconsolata", "monospace"],
    letterSpacing: 1.75,
    lineHeight: 13,
    fontSize: 12,
    fontWeight: 700,
    fill: "white",
    stroke: "black",
    strokeThickness: 1,
  });

  const universeLines = new PIXI.Graphics();
  const universeLineContainer = new PIXI.Container();
  universeLineContainer.addChild(universeLines);
  app.viewport.addChild(universeLineContainer);

  // create containers
  const gridContainer = new PIXI.Container();
  const empireContainer = new PIXI.Container();
  const shipContainer = new PIXI.Container();
  const starContainer = new PIXI.Container();
  // starContainer.filters = [
  //   new AdvancedBloomFilter({
  //     threshold: 0.5,
  //     bloomScale: 0.5,
  //     brightness: 0.8,
  //     blur: 6,
  //     quality: 4,
  //     pixelSize: 0.5,
  //     // resolution: 4
  //   }),
  // ];
  const indicatorContainer = new PIXI.Container();
  const textContainer = new PIXI.Container();
  const errorContainer = new PIXI.Container();
  const lineContainer = new PIXI.Container();
  const voyageContainer = new PIXI.Container();
  const selectionContainer = new PIXI.Container();
  const localMapContainer = new PIXI.Container();

  // add containers to viewports
  app.viewport.addChild(errorContainer);
  app.viewport.addChild(empireContainer);
  const empireGraphics = new PIXI.Graphics();
  empireContainer.filters = [new PIXI.filters.AlphaFilter(0.2)];
  empireContainer.addChild(empireGraphics);

  app.viewport.addChild(voyageContainer);
  app.viewport.addChild(starContainer);
  app.viewport.addChild(lineContainer);
  app.viewport.addChild(shipContainer);
  app.viewport.addChild(indicatorContainer);
  app.viewport.addChild(selectionContainer);
  app.viewport.addChild(gridContainer);
  app.viewport.addChild(textContainer);
  // localApp.viewport.addChild(localMapContainer);

  snapshot.addEventListener("click", () => {
    universeLines.clear();

    universeLines.lineStyle(1, colors.pink, 1); //(thickness, color, alpha)
    universe.stars.forEach((star) => {
      universeLines.drawCircle(
        star.position.x,
        star.position.y,
        star.size / 2 + 2
      );
      universeLines.beginFill(colors.pink, 1); //(thickness, color)
      const starsInRange = star.getStarsInRange();
      starsInRange.forEach((starInRange) => {
        universeLines.moveTo(star.position.x, star.position.y);
        universeLines.lineTo(starInRange.position.x, starInRange.position.y);
        // universeLines.drawCircle(
        //   starInRange.position.x,
        //   starInRange.position.y,
        //   starInRange.size / 2 + 2
        // );
        // universeLines.beginFill(colors.pink, 1); //(thickness, color)
      });
      // universeLines.closePath();
    });
    // const image = app.renderer.plugins.extract.image(universeLineContainer);
    // // document.body.appendChild(image);
  });

  // GRIDS
  const gridLines = new PIXI.Graphics();
  gridContainer.addChild(gridLines);
  gridContainer.visible = false;
  gridLines.lineStyle(1, colors.blue, 1); //(thickness, color)
  for (
    let i = universe.sectorGrid.delimiter;
    i < universe.size;
    i += universe.sectorGrid.delimiter
  ) {
    gridLines.moveTo(i, 0);
    gridLines.lineTo(i, universe.size);
    gridLines.moveTo(0, i);
    gridLines.lineTo(universe.size, i);
  }
  gridLines.drawRect(0, 0, universe.size, universe.size);
  const gridToggle = document.getElementById("grid_toggle");
  gridToggle.addEventListener("click", () => {
    gridContainer.visible = !gridContainer.visible;
    gridToggle.innerText = gridContainer.visible ? "HIDE GRID" : "SHOW GRID";
  });
  gridToggle.innerText = gridContainer.visible ? "HIDE GRID" : "SHOW GRID";

  const gridCenter = document.getElementById("grid_center");
  gridCenter.addEventListener("click", () => {
    app.viewport.animate({
      time: 250 / app.viewport.lastViewport.scaleX,
      position: { x: universe.size / 2, y: universe.size / 2 },
      // width: app.viewport.initialWidth,
      scale: 1,
      removeOnInterrupt: true,
      ease: "easeInOutCubic",
    });
  });

  for (const sector in universe.sectorGrid.sectors) {
    const { sectorGrid } = universe;
    const { center } = sectorGrid.sectors[sector];
    const sectorLabel = new PIXI.Text(sector, {
      ...textStyle,
      strokeThickness: 0,
      fontSize: 20,
      fill: "0x70ffe9",
    });
    sectorLabel.position.set(
      center.x - sectorGrid.delimiter * 1.5 + 5,
      center.y - sectorGrid.delimiter / 2 + 5
    );
    gridContainer.addChild(sectorLabel);
  }

  app.viewport.on("clicked", (ev) => {
    const sectorDistance = 2;
    const { x, y } = ev.world;
    const row = universe.getGridRow(y);
    const column = universe.getGridColumn(x);
    const sector = universe.getGridSector(x, y);
    // const allSectors = new Set([sector]);
    const starsInSector = universe.getStarsInSector(sector);
    const adjacentSectors = universe.getAdjacentSectors(sector);

    for (let s = 1; s < sectorDistance; s++) {
      adjacentSectors.forEach((adjacentSector) => {
        universe.getAdjacentSectors(adjacentSector).forEach((loopedSector) => {
          if (
            !adjacentSectors.includes(loopedSector) &&
            loopedSector !== sector
          ) {
            adjacentSectors.push(loopedSector);
          }
        });
      });
    }

    const starsInAdjacentSectors = universe.getStarsFromSectorArray(
      adjacentSectors
    );
  });
  // GRIDS

  errorContainer.addChild(errorLine);

  // create star info text
  const starText = new PIXI.Text("star", {
    ...textStyle,
    fill: colors.blueGlow,
    strokeThickness: 1,
    fontSize: 18,
    fontWeight: 400,
    letterSpacing: 1,
  });
  starText.resolution = textResolution;
  starText.visible = false;

  // create star info text
  const starInfoText = new PIXI.Text("star", {
    ...textStyle,
    fill: colors.white,
    strokeThickness: 1,
    fontSize: 12,
    lineHeight: 12,
    fontWeight: 400,
    letterSpacing: 1,
  });
  starInfoText.resolution = textResolution;
  starInfoText.visible = false;

  const starResourceText = new PIXI.Text("star", {
    ...textStyle,
  });
  starResourceText.resolution = textResolution;
  starResourceText.visible = false;

  const shipInfoText = new PIXI.Text("ship info", {
    ...textStyle,
  });
  shipInfoText.resolution = textResolution;
  shipInfoText.visible = false;

  textContainer.addChild(starText);
  textContainer.addChild(starInfoText);
  textContainer.addChild(starResourceText);
  textContainer.addChild(shipInfoText);

  // add star hover ring sprite to star container
  indicatorContainer.addChild(universe.hoverRingSprite);
  indicatorContainer.addChild(universe.selectionRingSprite);
  indicatorContainer.addChild(universe.indicatorGraphics);

  // DOM BUTTONS
  scan.addEventListener("click", () => {
    if (selectedShip && !selectedShip.scanning) {
      selectedShip.scanCoordinates = { ...selectedShip.position };
      selectedShip.scanning = true;
    }
  });

  launch.addEventListener("click", () => {
    if (selectedShip) {
      selectedShip.launch();
    }
  });

  mine.addEventListener("click", () => {
    if (selectedShip) {
      selectedShip.skills.Mining.active
        ? selectedShip.skills.Mining.stop()
        : selectedShip.skills.Mining.start();
      mine.innerText = selectedShip.skills.Mining.active
        ? "STOP MINING"
        : "START MINING";
    }
  });

  centerShip.addEventListener("click", () => {
    if (selectedShip) {
      app.viewport.snapTo(
        app.viewport,
        app.viewport.lastViewport.scaleX,
        selectedShip.position
      );
    }
  });

  followShip.addEventListener("click", () => {
    if (selectedShip) {
      // app.viewport.follow(selectedShip.sprite);
    }
  });

  autopilot.addEventListener("change", () => {
    if (selectedShip) {
      if (autopilot.checked) {
        selectedShip.engageAutopilot();
      } else if (!autopilot.checked) {
        selectedShip.disengageAutopilot();
      }
    }
  });

  // add star selection ring sprite to star container
  // indicatorContainer.addChild(ringSprite);
  let selectedStar = null;
  deselect.addEventListener("click", () => {
    shipControls.classList.add("hidden");
    selectedStar = null;
    starText.visible = false;
    starResourceText.visible = false;
    selectedShip = null;
    shipInfoText.visible = false;
  });
  // add stars to container
  const hitAreaGraphics = new PIXI.Graphics();
  hitAreaGraphics.lineStyle(2, colors.pink, 0.0); //(thickness, color, alpha)
  // starContainer.addChild(hitAreaGraphics);
  const empireCircles = [];
  for (const star of universe.stars) {
    const starSprite = star.createSprite();
    starSprite.cursor = "star";
    starSprite.interactive = true;
    const hitAreaSize = star.hitAreaSize * (star.size / 72);
    // hitAreaGraphics.drawCircle(
    //   star.position.x,
    //   star.position.y,
    //   star.hitAreaSize
    // );
    hitAreaGraphics.drawRect(
      star.position.x - hitAreaSize / 2,
      star.position.y - hitAreaSize / 2,
      hitAreaSize,
      hitAreaSize
    );
    // add star event handlers
    // starSprite.on("mouseover", (ev) => {
    //   const hoveredStar = ev.target.star;
    //   hoveredStar.interaction.hover();
    // });
    // starSprite.on("mouseout", (ev) => {
    //   universe.setHoveredStar();
    // });
    let click1 = 0;
    starSprite.on("pointerdown", async (ev) => {
      const now = performance.now();
      const delay = now - click1;
      click1 = now;

      ev.stopPropagation();
      const clickedStar = ev.target.star;
      // snap if clicked again
      if (
        delay < 500 &&
        universe.selectedStar &&
        clickedStar.id === universe.selectedStar.id
      ) {
        app.viewport.snapTo(
          app.viewport,
          app.viewport.lastViewport.scaleX,
          clickedStar.position
        );
      }

      // app.viewport.lastViewport.scaleX,
      //
      //       // add new circle to array
      //       // empireCircles.push(clickedStar.position);
      //
      //       // clear existing circles
      //       // empireGraphics.clear();
      //       // empireLines.lineStyle(4, colors.white, 1); //(thickness, color)
      //       // cycle through circle coordinates
      //       // empireCircles.forEach((empireCircle) => {
      //       empireGraphics.beginFill(colors.green, 1); //(thickness, color)
      //       // draw a circle for each empire circle
      //
      //       // set fill and line style
      //       // if the circle overlaps with another, draw arcs
      //       //         const overlappingCircles = [];
      //       //         for (let c = 0; c < empireCircles.length; c++) {
      //       //           const circleDistance = getDistanceAndAngleBetweenTwoPoints(
      //       //             { ...empireCircle },
      //       //             { ...empireCircles[c] }
      //       //           ).distance;
      //       //           if (circleDistance < 140 && circleDistance > 0) {
      //       //             const intersections = intersection(
      //       //               empireCircle.x,
      //       //               empireCircle.y,
      //       //               70,
      //       //               empireCircles[c].x,
      //       //               empireCircles[c].y,
      //       //               70
      //       //             );
      //       //             //first arc from origin circle
      //       //             const deltaX1 = intersections[0] - empireCircle.x;
      //       //             const deltaY1 = intersections[2] - empireCircle.y;
      //       //             const rad1 = Math.atan2(deltaY1, deltaX1); // In radians
      //       //
      //       //             const deltaX2 = intersections[1] - empireCircle.x;
      //       //             const deltaY2 = intersections[3] - empireCircle.y;
      //       //             const rad2 = Math.atan2(deltaY2, deltaX2); // In radians
      //       //
      //       //             // empireGraphics.arc(empireCircle.x, empireCircle.y, 70, rad1, rad2);
      //       //
      //       //             const intersections2 = intersection(
      //       //               empireCircles[c].x,
      //       //               empireCircles[c].y,
      //       //               70,
      //       //               empireCircle.x,
      //       //               empireCircle.y,
      //       //               70
      //       //             );
      //       //
      //       //             //second arc
      //       //             const deltaX3 = intersections2[0] - empireCircles[c].x;
      //       //             const deltaY3 = intersections2[2] - empireCircles[c].y;
      //       //             const rad3 = Math.atan2(deltaY3, deltaX3); // In radians
      //       //
      //       //             const deltaX4 = intersections2[1] - empireCircles[c].x;
      //       //             const deltaY4 = intersections2[3] - empireCircles[c].y;
      //       //             const rad4 = Math.atan2(deltaY4, deltaX4); // In radians
      //
      //       // empireGraphics.arc(
      //       //   empireCircles[c].x,
      //       //   empireCircles[c].y,
      //       //   70,
      //       //   rad3,
      //       //   rad4
      //       // );
      //       // } else {
      //       // intersections
      //       // empireGraphics.drawCircle(intersections[0], intersections[2], 10);
      //       // empireGraphics.drawCircle(intersections[1], intersections[3], 10);
      //       //   }
      //       // }
      //       // empireLines.drawCircle(
      //       //   clickedStar.position.x,
      //       //   clickedStar.position.y,
      //       //   100
      //       // );
      //       empireGraphics.drawCircle(
      //         clickedStar.position.x,
      //         clickedStar.position.y,
      //         70
      //       );
      //       empireGraphics.endFill(); //(thickness, color)
      //       // });
      //       clickedStar.getInfo();
      //       // let apiStar;
      //       if (
      //         (selectedStar && selectedStar.id !== clickedStar.id) ||
      //         !selectedStar
      //       ) {
      //         // clearPlanets();
      //         // localViewLoader.classList.remove("hidden");
      //         // apiStar = fetch(`${baseAPIurl}/stars/${clickedStar.id}`)
      //         //   .then((res) => res.json())
      //         //   .then((jsonData) => {
      //         //     const { star } = jsonData;
      //         //     return star;
      //         //   })
      //         //   .catch((err) => console.log(err));
      //       }
      //
      //       hoverRingSprite.visible = false;
      //       selectionRingSprite.visible = true;
      //       selectionRingSprite.height = hitAreaSize - 14;
      //       selectionRingSprite.width = hitAreaSize - 14;
      //       selectionRingSprite.position.set(
      //         clickedStar.position.x,
      //         clickedStar.position.y
      //       );
      //       if (selectedStar && selectedStar.id === clickedStar.id) {
      //         app.viewport.animate({
      //           time: 250 / app.viewport.lastViewport.scaleX,
      //           position: { x: clickedStar.position.x, y: clickedStar.position.y },
      //           // width: app.viewport.initialWidth,
      //           scale: 1,
      //           removeOnInterrupt: true,
      //           ease: "easeInOutCubic",
      //         });
      //       }
      //
      //       // ringSprite.visible = true;
      //       // ringSprite.position.set(ev.target.x, ev.target.y);
      //
      //
      //       // if (
      //       //   (selectedStar && selectedStar.id !== clickedStar.id) ||
      //       //   !selectedStar
      //       // ) {
      //       //   apiStar.then((data) => {
      //       //     localViewLoader.classList.add("hidden");
      //       //     makePlanets(data.planets.length + 1, data.name);
      //       //   });
      //       // }
      //       selectedStar = {
      //         id: clickedStar.id,
      //         x: clickedStar.position.x,
      //         y: clickedStar.position.y,
      //       };
      if (selectedShip && selectedShip.status === "idle") {
        selectedShip.plotCourse(star);

        // const starsInRange = selectedShip.getStarsInRange(true, true);
        // const isInRange =
        //   starsInRange.filter((star) => star.id === clickedStar.id).length > 0;
        // if (isInRange) {
        //   selectedShip.plot(clickedStar);
        // } else {
        //   errorPosition.origin = {
        //     x: selectedShip.position.x,
        //     y: selectedShip.position.y,
        //   };
        //   errorPosition.destination = {
        //     x: clickedStar.position.x,
        //     y: clickedStar.position.y,
        //   };
        //   errorTextText.innerText = "ERROR: DESTINATION OUT OF RANGE";
        //   errorText.style.opacity = 1;
        //   errorLine.clear();
        //   errorLine.lineStyle(2, colors.pink, 1); //(thickness, color)
        //   errorLine.moveTo(errorPosition.origin.x, errorPosition.origin.y);
        //   errorLine.lineTo(
        //     errorPosition.destination.x,
        //     errorPosition.destination.y
        //   );
        // }
      }

      // STAR NAME
      starInfoText.text = clickedStar.getInfo();
      const starTextXOffset = starInfoText.width + clickedStar.size / 2 + 50;
      // clickedStar.interaction.click();
      universe.setSelectedStar(clickedStar, starTextXOffset);
      starText.text = `${clickedStar.name}`;
      starText.visible = true;
      starInfoText.visible = true;

      starText.position.set(
        clickedStar.position.x - starTextXOffset,
        clickedStar.position.y - 68
      );

      starInfoText.position.set(
        clickedStar.position.x - starTextXOffset,
        clickedStar.position.y - 45
      );
      // starText.position.set(
      //   // clickedStar.position.x - 22 - starText.width,
      //   clickedStar.position.x - hitAreaSize / 2 - starText.width,
      //   clickedStar.position.y - starText.height / 2 + 1.8
      // );
      // STAR RESOURCES
      // STAR NAME
      // starResourceText.text = `${clickedStar.resources.hydrogen.toLocaleString()}`;
      // starResourceText.visible = true;
      // starResourceText.position.set(
      //   clickedStar.position.x - starResourceText.width / 2,
      //   clickedStar.position.y + hitAreaSize / 2 + 1.8
      // );
    });
    starContainer.addChild(starSprite);
  }

  function selectShip(ship, snapTo) {
    shipControls.classList.remove("hidden");
    selectedShip = ship;
    const clickedShip = ship;
    autopilot.checked = clickedShip.autopilot;
    mine.innerText =
      clickedShip.status === statuses.mining ? "STOP MINING" : "START MINING";
    launch.innerText =
      clickedShip.status === statuses.travelling ? "STOP SHIP" : "LAUNCH";
  }

  // add ships to container
  let selectedShip;
  for (const ship of universe.ships) {
    const shipSprite = ship.createSprite();
    shipSprite.cursor = "ship";
    shipSprite.interactive = true;
    shipContainer.addChild(shipSprite);
    voyageContainer.addChild(ship.voyageGraphics);
    voyageContainer.addChild(ship.routeGraphics);
    // voyageContainer.addChild(ship.pathLine);
    textContainer.addChild(ship.shipNameText);
    lineContainer.addChild(ship.scanningGraphics);
    // ship.plot();
    shipSprite.on("pointerdown", async (ev) => {
      selectShip(ev.target.ship);
      // shipControls.classList.remove("hidden");
      // selectedShip = ev.target.ship;
      // const clickedShip = ev.target.ship;
      // autopilot.checked = clickedShip.autopilot;
      // mine.innerText =
      //   clickedShip.status === statuses.mining ? "STOP MINING" : "START MINING";
      // launch.innerText =
      //   clickedShip.status === statuses.travelling ? "STOP SHIP" : "LAUNCH";
      // const apiShip = fetch(`${baseAPIurl}/ships/${clickedShip.id}`)
      //   .then((res) => res.json())
      //   .then((jsonData) => {
      //     const { ship } = jsonData;
      //     return ship;
      //   })
      //   .catch((err) => console.log(err));
      // apiShip.then((data) => console.log(data));
    });
  }

  startCulling([starContainer], app.viewport);

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

  function getLimitStars(x, y, limit) {
    // const starArray = Object.keys(universe.stars).map(
    //   (id) => universe.stars[id]
    // );
    const limitedStars = universe.getStarsInThisAndAdjacentSectors(x, y);
    return limitedStars.filter((limitStar) => {
      const starDistance = getDistanceAndAngleBetweenTwoPoints(
        { x: limitStar.position.x, y: limitStar.position.y },
        { x, y }
      ).distance;
      return starDistance <= limit;
    });
  }

  function drawingScanningCircle(ship) {
    const { x, y } = ship.scanCoordinates;
    const { scanProgress, scanRange, scanningCircle } = ship;
    //
    // ship.scanCoordinates.x,
    // ship.scanCoordinates.y,
    // ship.scanProgress,
    // 1 - ship.scanProgress / ship.scanRange,
    // ship.scanningCircle,
    //

    // clear the existing lines
    // scanningCircle.clear();
    // scanningLine.clear();

    // set the line style
    // scanningLine.lineStyle(1, colors.white, 0.25);
    // scanningCircle.lineStyle(
    //   1 / app.viewport.scaled,
    //   colors.white,
    //   1 - scanProgress / scanRange
    // );

    // draw the scanning circle
    // scanningCircle.drawCircle(x, y, scanProgress);
    // const inRangeStars = getLimitStars(x, y, radius);
    const inRangeStars = ship.getStarsInRange(false, true);

    for (const star of inRangeStars) {
      ship.scanningGraphics.lineStyle(1, colors.white, 0.25);
      ship.scanningGraphics.moveTo(x, y);
      ship.scanningGraphics.lineTo(star.position.x, star.position.y);
      ship.scanningGraphics.lineStyle(1, colors.white, 1);
      ship.scanningGraphics.drawCircle(
        star.position.x,
        star.position.y,
        star.size
      );
    }
    ship.scanning = false;
  }

  // STATS DISPLAY
  // const stats = new Stats();
  // stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  // document.body.appendChild(stats.dom);
  // STATS DISPLAY
  loadingText.classList.add("hidden");
  app.ticker.add(() => {
    loop(
      app,
      errorText,
      errorLine,
      selectedStar,
      universe,
      selectedShip,
      drawingScanningCircle,
      shipInfoText,
      errorPosition,
      starResourceText
    );
  });
  updateViewportSize();
  document
    .querySelectorAll(".debug")
    .forEach((debug) => (debug.style.opacity = 1));
  return app;
};
