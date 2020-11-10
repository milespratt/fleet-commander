import * as PIXI from "pixi.js";
import { v4 as uuidv4, version } from "uuid";
import {
  calculationMultiplier,
  lightYear,
  shipTypes,
  shipNames,
} from "../config";

export function getID() {
  return uuidv4();
}

export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloatFromInterval(min, max) {
  // min and max included
  return Math.random() * (max - min + 1) + min;
}

function getRandomArrayElement(array) {
  return array[randomIntFromInterval(0, array.length - 1)];
}

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

function rand(length, ...ranges) {
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

export function getType() {
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

export function generateCircle(x, y, radius, container) {
  const circle = new PIXI.Graphics();
  circle.interactive = false;
  circle.lineStyle(2, 0xff0000);
  circle.drawCircle(x, y, radius);
  container.addChild(circle);
}

export function getStarRadius(size) {
  return Math.floor((size / randomFloatFromInterval(9, 11)) * 695700);
}

export function getStarMass(size) {
  return (size / randomFloatFromInterval(9, 11)).toFixed(2);
}

export function getStarSize(starClass, baseStarSize) {
  return 6;
  switch (starClass) {
    case "I":
      return parseInt((baseStarSize * 2.4).toFixed(0));
    case "II":
      return parseInt((baseStarSize * 2.0).toFixed(0));
    case "III":
      return parseInt((baseStarSize * 1.6).toFixed(0));
    case "IV":
      return parseInt((baseStarSize * 1.2).toFixed(0));
    case "V":
      return parseInt((baseStarSize * 0.8).toFixed(0));
    case "D":
      return parseInt((baseStarSize * 0.4).toFixed(0));
  }
}

export function getTemp(type) {
  switch (type) {
    case "O":
      return randomIntFromInterval(30000, 60000);
    case "B":
      return randomIntFromInterval(10000, 29999);
    case "A":
      return randomIntFromInterval(7500, 9999);
    case "F":
      return randomIntFromInterval(6000, 7499);
    case "G":
      return randomIntFromInterval(5000, 5999);
    case "K":
      return randomIntFromInterval(3500, 4999);
    case "M":
      return randomIntFromInterval(2000, 3499);
  }
}

export function getClass() {
  const starClasses = ["I", "II", "III", "IV", "V", "D"];
  return starClasses[randomIntFromInterval(0, starClasses.length - 1)];
}

export function generateStarName() {
  return `${rand(3, ["A", "Z"])}-${rand(4, ["G", "K"], ["0", "9"])}-${rand(2, [
    "A",
    "Z",
  ])}`;
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

export function getRandomStar(stars, limit) {
  const starArray = Object.keys(stars).map((id) => stars[id]);
  let randomStar;
  if (limit && limit.distance > 0) {
    const limitedStars = starArray.filter((limitStar, index) => {
      const starDistance = getDistanceAndAngleBetweenTwoPoints(
        limitStar.position,
        limit.origin
      ).distance;
      return starDistance <= limit.distance;
    });
    randomStar = getRandomArrayElement(limitedStars);
  } else {
    randomStar = getRandomArrayElement(starArray);
  }
  return randomStar;
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

export function generateUniverse(options) {
  console.log("Generating universe...");
  const start = performance.now();
  const {
    maxStarGenLoops,
    maxStars,
    edgeDistance,
    size,
    minimumStarDistance,
    maxGenTime,
    radial,
  } = options;
  const center = {
    x: size.width / 2,
    y: size.height / 2,
  };
  const maxDistanceFromCenter = size.width / 2;
  let starGenLoops = 0;
  let starSprites = [];
  // for (let i = 0; i < maxStars; i++) {
  while (
    starSprites.length < maxStars &&
    starGenLoops < maxStarGenLoops &&
    performance.now() - start < maxGenTime
  ) {
    let starCoordinate = {
      x: randomIntFromInterval(edgeDistance, size.width - edgeDistance),
      y: randomIntFromInterval(edgeDistance, size.height - edgeDistance),
    };

    const distanceFromCenter = getDistanceAndAngleBetweenTwoPoints(
      starCoordinate,
      center
    ).distance;
    // percentage is used for creating radial galaxies
    const percentOfMaxDistance = distanceFromCenter / maxDistanceFromCenter;
    const minDistance = radial
      ? minimumStarDistance * percentOfMaxDistance
      : minimumStarDistance;

    if (radial && percentOfMaxDistance > 1) {
      starCoordinate = null;
    } else if (starSprites.length === 0) {
      starCoordinate = center;
    } else {
      // check all existing stars to see if they are close
      for (let s = 0; s < starSprites.length; s++) {
        if (starSprites.length > 0) {
          const coordinateToTest = starSprites[s];
          const coordinateDistance = getDistanceAndAngleBetweenTwoPoints(
            starCoordinate,
            coordinateToTest
          ).distance;

          if (coordinateDistance < minDistance) {
            starGenLoops++;
            starCoordinate = null;
            break;
          }
        }
      }
    }
    if (starCoordinate !== null) {
      starCoordinate.name = generateStarName();
      starSprites.push(starCoordinate);
    }
  }
  if (starGenLoops >= maxStarGenLoops) {
    console.log(
      `Generation stopped. Hit loop limit of ${maxStarGenLoops.toLocaleString()}.`
    );
  }
  if (starSprites.length >= maxStars) {
    console.log(
      `Generation stopped. Hit star limit of ${maxStars.toLocaleString()}.`
    );
  }
  if (performance.now() - start >= maxGenTime) {
    console.log(
      `Generation stopped. Hit max gen time of ${maxGenTime.toLocaleString()}ms.`
    );
  }
  const genSpeed = (performance.now() - start).toLocaleString();
  console.log(
    `${starSprites.length.toLocaleString()} stars generated in ${genSpeed}ms.`
  );
  console.log(
    `It took ${starGenLoops} attempts to meet the ${minimumStarDistance.toLocaleString()} pixel star distance criteria`
  );
  const universe = {
    stars: starSprites,
    size,
    genSpeed,
    genLoops: starGenLoops,
  };
  return universe;
}
