import * as PIXI from "pixi.js";

import {
  calculationMultiplier,
  lightYear,
  shipTypes,
  shipNames,
} from "../config";

// HELPERS
export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloatFromInterval(min, max) {
  // min and max included
  return Math.random() * (max - min + 1) + min;
}

export function getRandomArrayElement(array) {
  return array[randomIntFromInterval(0, array.length - 1)];
}

export function Vector(magnitude, angle) {
  var angleRadians = (angle * Math.PI) / 180;

  this.magnitudeX = magnitude * Math.cos(angleRadians);
  this.magnitudeY = magnitude * Math.sin(angleRadians);
}

export function getDistanceAndAngleBetweenTwoPoints(point1, point2) {
  const x = point2.x - point1.x;
  const y = point2.y - point1.y;

  return {
    distance: Math.sqrt(x * x + y * y),
    angle: (Math.atan2(y, x) * 180) / Math.PI,
  };
}

function generateRandomString(length, ...ranges) {
  let str = ""; // the string (initialized to "")
  while (length--) {
    // repeat this length of times
    const ind = Math.floor(Math.random() * ranges.length); // get a random range from the ranges object
    const min = ranges[ind][0].charCodeAt(0), // get the minimum char code allowed for this range
      max = ranges[ind][1].charCodeAt(0); // get the maximum char code allowed for this range
    const c = Math.floor(Math.random() * (max - min + 1)) + min; // get a random char code between min and max
    str += String.fromCharCode(c); // convert it back into a character and append it to the string str
  }
  return str; // return str
}

// SHIPS
export function getShipName() {
  return `${getRandomArrayElement(shipTypes)} ${getRandomArrayElement(
    shipNames
  )}`;
}

export function convertTime(seconds) {
  let remainingSeconds = seconds;
  const years = Math.floor(remainingSeconds / (3600 * 24 * 365));
  const yearDisplay = years < 10 ? `0${years}` : years;
  remainingSeconds -= years * 3600 * 24 * 365;
  const days = Math.floor(remainingSeconds / (3600 * 24));
  const dayDisplay = days < 10 ? `0${days}` : days;
  remainingSeconds -= days * 3600 * 24;
  const hours = Math.floor(remainingSeconds / 3600);
  const hourDisplay = hours < 10 ? `0${hours}` : hours;
  remainingSeconds -= hours * 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const minuteDisplay = minutes < 10 ? `0${minutes}` : minutes;
  remainingSeconds -= minutes * 60;
  const remainingSecondDisplay =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${yearDisplay}y ${dayDisplay}d ${hourDisplay}h ${minuteDisplay}m ${remainingSecondDisplay
    .toString()
    .substring(0, 5)}s`;
}

export function renderDistance(distance, pixelsPerLightyear, short) {
  const convertedDistance = (distance / pixelsPerLightyear) * lightYear;
  const distanceString = `${convertedDistance.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
  if (short) {
    const distanceArray = distanceString.split(",");
    switch (distanceArray.length) {
      case 1:
        return `${distanceArray[0]} m`;
      case 2:
        return `${parseInt([distanceArray[0], distanceArray[1]].join(""))} MI`;
      case 3:
        return `${distanceArray[0]}.${distanceArray[1]}M M`;
      case 4:
        return `${distanceArray[0]}.${distanceArray[1]}B M`;
      case 5:
        return `${distanceArray[0]}.${distanceArray[1]}T M`;
      default:
        break;
    }
  } else {
    return distanceString + " M";
  }
}

// STARS

export function getClass(starClass = null) {
  // 5 O
  // 20 B
  // 60 A
  // 300 F
  // 760 G
  // 1210 K
  // 7645 M
  // stars out of 10000 ^
  // const classNumber = randomIntFromInterval(0, 10000);
  // if (classNumber >= 9995) {
  //   return "O";
  // } else if (classNumber >= 9980) {
  //   return "B";
  // } else if (classNumber >= 9940) {
  //   return "A";
  // } else if (classNumber >= 9700) {
  //   return "F";
  // } else if (classNumber >= 9240) {
  //   return "G";
  // } else if (classNumber >= 8790) {
  //   return "K";
  // }
  // // if (classNumber > 1210 && classNumber <= 7645) {
  // //   return "M";
  // // }
  // else {
  //   return "M";
  // }
  // if (classNumber > 7645) {
  // }
  if (starClass) {
    return starClass;
  } else {
    const rand = Math.random() * (1 - 0.0000003) + 0.0000003;
    if (rand >= 0.121) {
      return "M";
    } else if (rand < 0.121 && rand >= 0.076) {
      return "K";
    } else if (rand < 0.076 && rand >= 0.03) {
      return "G";
    } else if (rand < 0.03 && rand >= 0.006) {
      return "F";
    } else if (rand < 0.006 && rand >= 0.0013) {
      return "A";
    } else if (rand < 0.0013 && rand >= 0.0000005) {
      return "B";
    } else if (rand < 0.0000003) {
      return "O";
    }
  }
}

export function getStarRadius(size) {
  return Math.floor((size / randomFloatFromInterval(9, 11)) * 695700);
}

export function getStarMass(size) {
  return (size / randomFloatFromInterval(9, 11)).toFixed(2);
}

// export function getStarSize(starClass, baseStarSize) {
//   // return 6;
//   switch (starClass) {
//     case "I":
//       return parseInt((baseStarSize * 2.4).toFixed(0));
//     case "II":
//       return parseInt((baseStarSize * 2.0).toFixed(0));
//     case "III":
//       return parseInt((baseStarSize * 1.6).toFixed(0));
//     case "IV":
//       return parseInt((baseStarSize * 1.2).toFixed(0));
//     case "V":
//       return parseInt((baseStarSize * 0.8).toFixed(0));
//     case "D":
//       return parseInt((baseStarSize * 0.4).toFixed(0));
//   }
// }

export function getStarSize(starClass, baseStarSize) {
  // TESTING
  // return 8;
  // return randomIntFromInterval(100, 200);

  // ORIGINAL
  switch (starClass) {
    case "O":
      // return 30;
      return randomIntFromInterval(56, 64);
    // return parseInt((baseStarSize * 6).toFixed(0));
    case "B":
      // return 26;
      return randomIntFromInterval(48, 54);
    // return parseInt((baseStarSize * 5).toFixed(0));
    case "A":
      // return 22;
      return randomIntFromInterval(36, 44);
    // return parseInt((baseStarSize * 4).toFixed(0));
    case "F":
      // return 18;
      return randomIntFromInterval(28, 34);
    // return parseInt((baseStarSize * 4).toFixed(0));
    case "G":
      // return 14;
      return randomIntFromInterval(20, 26);
    // return parseInt((baseStarSize * 3).toFixed(0));
    case "K":
      // return 10;
      return randomIntFromInterval(12, 18);
    // return parseInt((baseStarSize * 2).toFixed(0));
    case "M":
      // return 6;
      return randomIntFromInterval(4, 10);
    // return parseInt((baseStarSize * 0.5).toFixed(0));
  }
}

export function getTemp(starClass) {
  switch (starClass) {
    case "O":
      return randomFloatFromInterval(30000, 210000);
    case "B":
      return randomFloatFromInterval(10000, 29999);
    case "A":
      return randomFloatFromInterval(7500, 9999);
    case "F":
      return randomFloatFromInterval(6000, 7499);
    case "G":
      return randomFloatFromInterval(5200, 5999);
    case "K":
      return randomFloatFromInterval(3700, 5199);
    case "M":
      return randomFloatFromInterval(2400, 3699);
  }
}

export function getType() {
  const starTypes = ["I", "II", "III", "IV", "V", "D"];

  return starTypes[randomIntFromInterval(0, starTypes.length - 1)];
}

export function generateStarName(sector, stars) {
  // return `${generateRandomString(3, ["A", "Z"])}-${generateRandomString(
  //   4,
  //   ["G", "K"],
  //   ["0", "9"]
  // )}-${generateRandomString(2, ["A", "Z"])}`;
  return `${sector}-${stars}-${generateRandomString(
    4,
    ["G", "K"],
    ["0", "9"]
  )}`;
}

export function getStarAge(type) {
  switch (type) {
    case "O":
      return randomIntFromInterval(0, 13800000000);
    case "B":
      return randomIntFromInterval(0, 13800000000);
    case "A":
      return randomIntFromInterval(0, 13800000000);
    case "F":
      return randomIntFromInterval(0, 13800000000);
    case "G":
      return randomIntFromInterval(0, 13800000000);
    case "K":
      return randomIntFromInterval(0, 13800000000);
    case "M":
      return randomIntFromInterval(0, 13800000000);
  }
}

// export function generateCircle(x, y, radius, container) {
//   const circle = new PIXI.Graphics();
//   circle.interactive = false;
//   circle.lineStyle(2, 0xff0000);
//   circle.drawCircle(x, y, radius);
//   container.addChild(circle);
// }

// export function getRandomStar(stars, limit) {
//   if (limit && limit.distance > 0) {
//     const limitedStars = stars.filter((limitStar, index) => {
//       const starDistance = getDistanceAndAngleBetweenTwoPoints(
//         limitStar,
//         limit.origin
//       ).distance;
//       return starDistance <= limit.distance;
//     });
//     let newStar;
//     // newStar = limitedStars[randomIntFromInterval(0, limitedStars.length - 1)];
//     newStar = getRandomArrayElement(limitedStars);
//     return newStar;
//   }
//   return stars[randomIntFromInterval(0, stars.length - 1)];
// }

// export function getStarsInSectors(x, y, sectorGrid) {
//   // const { sectorGrid } = universe;
//   // const { x, y } = ev.world;
//   const thisSector = getGridSector(sectorGrid, x, y);
//   const starsInSector = getStarsInSector(sectorGrid, thisSector);
//   const adjacentSectors = getAdjacentSectors(sectorGrid, thisSector, true);
//   const starsInAdjacentSectors = [];
//   adjacentSectors.forEach((sector) => {
//     sectorGrid.sectors[sector].starCoordinates.forEach((star) =>
//       starsInAdjacentSectors.push(star)
//     );
//   });
//   // console.log(
//   //   `${starsInSector.length} stars found in the ${thisSector} sector.`
//   // );
//   // console.log(
//   //   `${starsInAdjacentSectors.length} stars found in this and the adjacent sectors.`
//   // );
//   // console.log(starsInAdjacentSectors);
//   return starsInAdjacentSectors;
// }

// export function getRandomStar(stars, limit) {
//   let randomStar;
//   if (limit && limit.distance > 0) {
//     const limitedStars = getStarsInSectors(
//       limit.origin.x,
//       limit.origin.y,
//       limit.sectorGrid
//     );
//     // const limitedStars = starArray
//     const closeStars = limitedStars.filter((limitStar, index) => {
//       const starDistance = getDistanceAndAngleBetweenTwoPoints(
//         { x: limitStar.position.x, y: limitStar.position.y },
//         limit.origin
//       ).distance;
//       return starDistance <= limit.distance;
//     });
//     randomStar = getRandomArrayElement(closeStars);
//   } else {
//     randomStar = getRandomArrayElement(stars);
//   }
//   return randomStar;
// }

// sector generation
// function makeSectors(size, delimiter) {
//   const rowsAndColumns = size / delimiter;
//   const sectorGrid = {
//     delimiter,
//     size,
//     firstRow: "A",
//     firstColumn: 1,
//     lastColumn: rowsAndColumns,
//     rows: rowsAndColumns,
//     columns: rowsAndColumns,
//     totalSectors: rowsAndColumns * rowsAndColumns,
//     sectors: {},
//   };
//   for (let r = 0; r < rowsAndColumns; r++) {
//     for (let c = 1; c <= rowsAndColumns; c++) {
//       const row = String.fromCharCode(65 + r);
//       if (c === rowsAndColumns) {
//         sectorGrid.lastRow = row;
//       }
//       sectorGrid.sectors[`${row}${c}`] = {
//         center: {
//           x: c * delimiter + delimiter / 2,
//           y: r * delimiter + delimiter / 2,
//         },
//         starCoordinates: [],
//       };
//     }
//   }
//   return sectorGrid;
// }
//
// function getGridRow(grid, y) {
//   // starts at A
//   const row = String.fromCharCode(
//     65 + Math.floor((grid.size - (grid.size - y)) / grid.delimiter)
//   );
//   return row;
// }
//
// function getGridColumn(grid, x) {
//   // starts at 1
//   // need to add 1 because the sectors start at 1
//   const column = Math.floor((grid.size - (grid.size - x)) / grid.delimiter) + 1;
//   return column;
// }
//
// export function getGridSector(grid, x, y) {
//   const row = getGridRow(grid, y);
//   const column = getGridColumn(grid, x);
//   return `${row}${column}`;
// }
//
// export function getAdjacentSectors(grid, sector, includeSector = false) {
//   const { sectors, rows, columns } = grid;
//   const row = sector.substring(0, 1);
//   const rowsToCapture =
//     row === grid.firstRow
//       ? [row, String.fromCharCode(grid.firstRow.charCodeAt(0) + 1)]
//       : row === grid.lastRow
//       ? [String.fromCharCode(grid.lastRow.charCodeAt(0) - 1), row]
//       : [
//           String.fromCharCode(row.charCodeAt(0) - 1),
//           row,
//           String.fromCharCode(row.charCodeAt(0) + 1),
//         ];
//   const column = parseInt(sector.substring(1));
//   const columnsToCapture =
//     column === 1
//       ? [column, 2]
//       : column === columns
//       ? [column - 1, column]
//       : [column - 1, column, column + 1];
//   const adjacentSectors = [];
//   for (let r = 0; r < rowsToCapture.length; r++) {
//     for (let c = 0; c < columnsToCapture.length; c++) {
//       adjacentSectors.push(`${rowsToCapture[r]}${columnsToCapture[c]}`);
//     }
//   }
//   if (!includeSector) {
//     const filteredAdjacentSectors = adjacentSectors.filter((e) => e !== sector);
//     return filteredAdjacentSectors;
//   } else {
//     return adjacentSectors;
//   }
// }
//
// export function getStarsInSector(grid, sector) {
//   return grid.sectors[sector].starCoordinates;
// }
//
// export function getStarsFromSectorArray(grid, sectors) {
//   const stars = [];
//   sectors.forEach((sector) => {
//     grid.sectors[sector].starCoordinates.forEach((star) => stars.push(star));
//   });
//   return stars;
// }
//
// export function generateUniverse(options) {
//   console.log("Generating universe...");
//   // get start time to measure performance
//   const start = performance.now();
//
//   // options
//   const {
//     maxExtraGenerationLoops,
//     maxStars,
//     edgeDistance,
//     size,
//     minimumStarDistance,
//     maxGenTime,
//     radial,
//   } = options;
//
//   // center center of universe
//   const center = {
//     x: size / 2,
//     y: size / 2,
//   };
//
//   // create sector grid and array for storing coordinates
//   const sectorGrid = makeSectors(size, 2000);
//   console.log(sectorGrid);
//   const starCoordinates = [];
//
//   // generation loop
//   // keep generating until one threshold is hit
//   let extraGenerationLoops = 0;
//   let proximityMax = 0;
//   while (
//     starCoordinates.length < maxStars &&
//     extraGenerationLoops < maxExtraGenerationLoops &&
//     performance.now() - start < maxGenTime
//   ) {
//     // create a random star coordinate
//     let newStarCoordinate = {
//       x: randomIntFromInterval(edgeDistance, size - edgeDistance),
//       y: randomIntFromInterval(edgeDistance, size - edgeDistance),
//     };
//
//     // get the new coordinate sector
//     let coordinateSector = getGridSector(
//       sectorGrid,
//       newStarCoordinate.x,
//       newStarCoordinate.y
//     );
//
//     const adjacentSectors = getAdjacentSectors(
//       sectorGrid,
//       coordinateSector,
//       true
//     );
//
//     const closeStars = getStarsFromSectorArray(sectorGrid, adjacentSectors);
//     proximityMax =
//       proximityMax > closeStars.length ? proximityMax : closeStars.length;
//
//     // variables for radial generation
//     const maxDistanceFromCenter = size / 2;
//     const distanceFromCenter = getDistanceAndAngleBetweenTwoPoints(
//       newStarCoordinate,
//       center
//     ).distance;
//     const percentOfMaxDistance = distanceFromCenter / maxDistanceFromCenter;
//
//     // minimum distance from other existing coordinates
//     // calculated if radial
//     // fixed for non-radial
//     const minimumAdjacentDistance = radial
//       ? minimumStarDistance * percentOfMaxDistance
//       : minimumStarDistance;
//
//     if (radial && percentOfMaxDistance > 1) {
//       // throw away coordinates that are outside the radial limit
//       newStarCoordinate = null;
//     } else if (starCoordinates.length === 0) {
//       // place first coordinate at the center
//       newStarCoordinate = center;
//       coordinateSector = getGridSector(
//         sectorGrid,
//         newStarCoordinate.x,
//         newStarCoordinate.y
//       );
//     } else {
//       // loop over existing coordinates to check minimum distance
//       // for (let s = 0; s < starCoordinates.length; s++) {
//       for (let s = 0; s < closeStars.length; s++) {
//         // get distance between new and existing coordinates
//         const coordinateDistance = getDistanceAndAngleBetweenTwoPoints(
//           newStarCoordinate,
//           // starCoordinates[s]
//           closeStars[s]
//         ).distance;
//
//         // throw out the new coordinate and break the loop if a close neighbor is found
//         if (coordinateDistance < minimumAdjacentDistance) {
//           extraGenerationLoops++;
//           newStarCoordinate = null;
//           break;
//         }
//       }
//     }
//
//     // finalize the coordinate if it didn't get thrown out
//     if (newStarCoordinate !== null) {
//       // give it a name
//       newStarCoordinate.name = generateStarName();
//       // assign it to a sector
//
//       newStarCoordinate.sector = coordinateSector;
//       // push the coordinate to the list
//       starCoordinates.push(newStarCoordinate);
//       // push the coordinate to it's sector
//       sectorGrid.sectors[coordinateSector].starCoordinates.push(
//         newStarCoordinate
//       );
//     }
//   }
//   // calculate the generation time
//   const generationTime = performance.now() - start;
//   // log if loop limit is hit
//   if (extraGenerationLoops >= maxExtraGenerationLoops) {
//     console.log(
//       `Generation stopped. Hit loop limit of ${maxExtraGenerationLoops.toLocaleString()}.`
//     );
//   }
//   // log if max star limit is hit
//   if (starCoordinates.length >= maxStars) {
//     console.log(
//       `Generation stopped. Hit star limit of ${maxStars.toLocaleString()}.`
//     );
//   }
//   // log if max generation time is hit
//   if (generationTime >= maxGenTime) {
//     console.log(
//       `Generation stopped. Hit max gen time of ${maxGenTime.toLocaleString()}ms.`
//     );
//   }
//   // log generation time
//   console.log(
//     `${starCoordinates.length.toLocaleString()} stars generated in ${generationTime.toLocaleString()}ms.`
//   );
//   // log number of loops required
//   console.log(
//     `It took ${extraGenerationLoops.toLocaleString()} extra generation loops to meet the ${minimumStarDistance.toLocaleString()} pixel star distance criteria.`
//   );
//   // log max proximity loop
//   console.log(
//     `Max of ${proximityMax.toLocaleString()} calculations per star coordinate reached to verify minimum distance of ${minimumStarDistance.toLocaleString()}`
//   );
//   const universe = new Universe(
//     starCoordinates,
//     sectorGrid,
//     size,
//     generationTime,
//     extraGenerationLoops
//   );
//   console.log(universe);
//   return universe;
// }
