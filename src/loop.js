import {
  convertTime,
  renderDistance,
  Vector,
  getDistanceAndAngleBetweenTwoPoints,
  randomIntFromInterval,
  intersection,
  getRandomArrayElement,
} from "./helpers";

import {
  colors,
  textResolution,
  lightSpeed,
  lightYear,
  pixelsPerLightyear,
  au,
  baseAPIurl,
} from "./config";

export default (
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
) => {
  // app.ticker.add(() => {
  if (errorText.style.opacity > 0) {
    const opacity = errorText.style.opacity;
    errorText.style.opacity = opacity - 0.005;
    errorLine.clear();
    errorLine.lineStyle(2, colors.pink, opacity - 0.005); //(thickness, color)
    errorLine.moveTo(errorPosition.origin.x, errorPosition.origin.y);
    errorLine.lineTo(errorPosition.destination.x, errorPosition.destination.y);
  }
  // stats.begin();
  // const bounds = app.viewport.getVisibleBounds();
  // const boundary = {
  //   xmin: bounds.x,
  //   xmax: bounds.x + bounds.width,
  //   ymin: bounds.y,
  //   ymax: bounds.y + bounds.height,
  // };
  if (universe.hoverRingSprite.visible) {
    universe.hoverRingSprite.rotation += 0.05;
  }
  if (universe.selectedStar) {
    if (starResourceText.visible) {
      starResourceText.text = `${universe.selectedStar.resources.hydrogen.toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}kg`;
      starResourceText.position.set(
        universe.selectedStar.position.x - starResourceText.width / 2,
        starResourceText.position.y
      );
    }
    // if (!selectionRingSprite.visible) {
    //   const hitAreaSize =
    //     universe.selectedStar.hitAreaSize * (universe.selectedStar.size / 72);
    //   selectionRingSprite.visible = true;
    //   selectionRingSprite.height = hitAreaSize - 14;
    //   selectionRingSprite.width = hitAreaSize - 14;
    //   selectionRingSprite.position.set(
    //     universe.selectedStar.position.x,
    //     universe.selectedStar.position.y
    //   );
    // }
    // if (localStarSprites) {
    //   localStarSprites.forEach((localStarSprite) => {
    //     localStarSprite.rotation += localStarSprite.speed;
    //   });
    // }
    // if (localViewContainer.classList.contains("hidden")) {
    //   localViewContainer.classList.remove("hidden");
    // }
    // draw selection lines
    //       selectionLine.clear();
    //       selectionLine.lineStyle(2 / app.viewport.scaled, colors.blue, 1);
    //
    //       selectionLine.drawCircle(selectedStar.position.x, selectedStar.position.y, 15);
    // selectionLine.drawRect(selectedStar.position.x - 15, selectedStar.position.y - 15, 30, 30);
    // draw line to top right
    //       if (
    //         selectedStar &&
    //         (selectedStar.position.x > bounds.x + 474 / app.viewport.scaled ||
    //           selectedStar.position.y < bounds.y + 26.5 / app.viewport.scaled)
    //       ) {
    //         drawSelectionLine(
    //           { x: selectedStar.position.x, y: selectedStar.position.y },
    //           {
    //             x: bounds.x + 474 / app.viewport.scaled,
    //             y: bounds.y + 26.5 / app.viewport.scaled,
    //           }
    //         );
    //       }
    //
    //       // draw line to bottom right
    //       if (
    //         selectedStar &&
    //         (selectedStar.position.y > bounds.y + 474 / app.viewport.scaled ||
    //           selectedStar.position.x > bounds.x + 474 / app.viewport.scaled)
    //       ) {
    //         drawSelectionLine(
    //           { x: selectedStar.position.x, y: selectedStar.position.y },
    //           {
    //             x: bounds.x + 474 / app.viewport.scaled,
    //             y: bounds.y + 474 / app.viewport.scaled,
    //           }
    //         );
    //       }
    //
    //       // draw line to bottom left
    //       if (
    //         selectedStar &&
    //         (selectedStar.position.y > bounds.y + 474 / app.viewport.scaled ||
    //           selectedStar.position.x < bounds.x + 26.5 / app.viewport.scaled)
    //       ) {
    //         drawSelectionLine(
    //           { x: selectedStar.position.x, y: selectedStar.position.y },
    //           {
    //             x: bounds.x + 26.5 / app.viewport.scaled,
    //             y: bounds.y + 474 / app.viewport.scaled,
    //           }
    //         );
    //       }
    //
    //       // draw line to top left
    //       if (
    //         selectedStar &&
    //         (selectedStar.position.y < bounds.y + 26.5 / app.viewport.scaled ||
    //           selectedStar.position.x < bounds.x + 26.5 / app.viewport.scaled)
    //       ) {
    //         drawSelectionLine(
    //           { x: selectedStar.position.x, y: selectedStar.position.y },
    //           {
    //             x: bounds.x + 26.5 / app.viewport.scaled,
    //             y: bounds.y + 26.5 / app.viewport.scaled,
    //           }
    //         );
    //       }
  } else {
    // selectionLine.clear();
    // if (!localViewContainer.classList.contains("hidden")) {
    //   localViewContainer.classList.add("hidden");
    // }
  }
  for (const ship of universe.ships) {
    if (
      true
      // (selectedShip &&
      //   ship.id === selectedShip.id &&
      //   ship.plottingCourse === false) ||
      // (ship.position.x > boundary.xmin &&
      //   ship.position.x < boundary.xmax &&
      //   ship.position.y > boundary.ymin &&
      //   ship.position.y < boundary.ymax &&
      //   ship.plottingCourse === false)
    ) {
      ship.update();
    }
    if (ship.scanning) {
      drawingScanningCircle(
        // ship.scanCoordinates.x,
        // ship.scanCoordinates.y,
        // ship.scanProgress,
        // 1 - ship.scanProgress / ship.scanRange,
        // ship.scanningCircle,
        ship
      );
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
      const acceleration = ship.acceleration / (lightSpeed / lightYear);
      shipInfoText.text = `NM:${ship.name}\nID:${ship.id}\nTYP:${
        ship.type
      }\nSTS:${ship.status}\nCRG:${ship.cargo.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}kg\nDIR:${ship.directionY}-${ship.directionX}\nDES:${
        ship.destination.name
      }\nORIG:${
        ship.origin.name
      }\nETA:${currentTime}\nDIST(m):${currentDistance}\nDIST(au):${(
        ((ship.distanceToDestination / pixelsPerLightyear) * lightYear) /
        au
      ).toLocaleString()}au\nDIST(ly):${(
        ((ship.distanceToDestination / pixelsPerLightyear) * lightYear) /
        lightYear
      ).toLocaleString()}ly\nVEL(c):${currentSpeed.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}c\nVEL(m/s):${(currentSpeed * lightSpeed).toLocaleString()}m/s`;
      shipInfoText.position.set(
        selectedShip.position.x - 5,
        selectedShip.position.y - shipInfoText.height - 18
      );
      shipInfoText.visible = true;
    }
  }
  // stats.end();
  // });
};
