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

export function intersection(x0, y0, r0, x1, y1, r1) {
  var a, dx, dy, d, h, rx, ry;
  var x2, y2;

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0;
  dy = y1 - y0;

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt(dy * dy + dx * dx);

  /* Check for solvability. */
  if (d > r0 + r1) {
    /* no solution. circles do not intersect. */
    return false;
  }
  if (d < Math.abs(r0 - r1)) {
    /* no solution. one circle is contained in the other */
    return false;
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.
   */

  /* Determine the distance from point 0 to point 2. */
  a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d);

  /* Determine the coordinates of point 2. */
  x2 = x0 + (dx * a) / d;
  y2 = y0 + (dy * a) / d;

  /* Determine the distance from point 2 to either of the
   * intersection points.
   */
  h = Math.sqrt(r0 * r0 - a * a);

  /* Now determine the offsets of the intersection points from
   * point 2.
   */
  rx = -dy * (h / d);
  ry = dx * (h / d);

  /* Determine the absolute intersection points. */
  var xi = x2 + rx;
  var xi_prime = x2 - rx;
  var yi = y2 + ry;
  var yi_prime = y2 - ry;

  return [xi, xi_prime, yi, yi_prime];
}
