import {
  randomIntFromInterval,
  getDistanceAndAngleBetweenTwoPoints,
  generateStarName,
  getRandomArrayElement,
} from "../helpers";

import Star from "./star";

class Universe {
  constructor() {
    this.starCoordinates = [];
    this.stars = [];
    this.sectorGrid = {};
    this.size = null;
    this.generationTime = null;
    this.extraGenerationLoops = null;
  }
  // return sector grid row from y coordinate
  getGridRow(y) {
    const row = String.fromCharCode(
      65 +
        Math.floor(
          (this.sectorGrid.size - (this.sectorGrid.size - y)) /
            this.sectorGrid.delimiter
        )
    );
    return row;
  }
  // return sector grid column from x coordinate
  getGridColumn(x) {
    const column =
      Math.floor(
        (this.sectorGrid.size - (this.sectorGrid.size - x)) /
          this.sectorGrid.delimiter
      ) + 1;
    return column;
  }
  // return sector grid sector from x and y coordinates
  getGridSector(x, y) {
    const row = this.getGridRow(y);
    const column = this.getGridColumn(x);
    return `${row}${column}`;
  }
  // return an array of all grid sectors adjacent to supplied sector (optionally include supplied sector)
  getAdjacentSectors(sector, includeSector = false) {
    const { sectors, rows, columns } = this.sectorGrid;
    const row = sector.substring(0, 1);
    const rowsToCapture =
      row === this.sectorGrid.firstRow
        ? [row, String.fromCharCode(this.sectorGrid.firstRow.charCodeAt(0) + 1)]
        : row === this.sectorGrid.lastRow
        ? [String.fromCharCode(this.sectorGrid.lastRow.charCodeAt(0) - 1), row]
        : [
            String.fromCharCode(row.charCodeAt(0) - 1),
            row,
            String.fromCharCode(row.charCodeAt(0) + 1),
          ];
    const column = parseInt(sector.substring(1));
    const columnsToCapture =
      column === 1
        ? [column, 2]
        : column === columns
        ? [column - 1, column]
        : [column - 1, column, column + 1];
    const adjacentSectors = [];
    for (let r = 0; r < rowsToCapture.length; r++) {
      for (let c = 0; c < columnsToCapture.length; c++) {
        adjacentSectors.push(`${rowsToCapture[r]}${columnsToCapture[c]}`);
      }
    }
    if (!includeSector) {
      const filteredAdjacentSectors = adjacentSectors.filter(
        (e) => e !== sector
      );
      return filteredAdjacentSectors;
    } else {
      return adjacentSectors;
    }
  }
  // return array of all stars in supplied sector
  getStarsInSector(sector) {
    return this.sectorGrid.sectors[sector].stars;
  }
  // return an array of all stars from supplied array of sectors
  getStarsFromSectorArray(sectors) {
    const stars = [];
    sectors.forEach((sector) => {
      this.sectorGrid.sectors[sector].stars.forEach((star) => stars.push(star));
    });
    return stars;
  }
  // return array of all stars in this sector and adjacent sector from x and y coordinate
  getStarsInThisAndAdjacentSectors(x, y) {
    const sector = this.getGridSector(x, y);
    const adjacentSectors = this.getAdjacentSectors(sector, true);
    const starsInThisAndAdjacentSectors = [];
    adjacentSectors.forEach((sector) => {
      this.sectorGrid.sectors[sector].stars.forEach((star) =>
        starsInThisAndAdjacentSectors.push(star)
      );
    });
    return starsInThisAndAdjacentSectors;
  }
  // get a random star, optionally supply a limit (pixel distance)
  getRandomStar(limit) {
    let randomStar;
    if (limit && limit.distance > 0) {
      const limitedStars = this.getStarsInThisAndAdjacentSectors(
        limit.origin.position.x,
        limit.origin.position.y
      );
      // const limitedStars = starArray
      const closeStars = limitedStars.filter((limitStar, index) => {
        const starDistance = getDistanceAndAngleBetweenTwoPoints(
          { x: limitStar.position.x, y: limitStar.position.y },
          limit.origin.position
        ).distance;
        return starDistance <= limit.distance;
      });
      randomStar = getRandomArrayElement(closeStars);
    } else {
      randomStar = getRandomArrayElement(this.stars);
    }
    return randomStar;
  }
  // generate universe sector grid
  generateSectorGrid(delimiter) {
    const rowsAndColumns = this.size / delimiter;
    const sectorGrid = {
      delimiter,
      size: this.size,
      firstRow: "A",
      firstColumn: 1,
      lastColumn: rowsAndColumns,
      rows: rowsAndColumns,
      columns: rowsAndColumns,
      totalSectors: rowsAndColumns * rowsAndColumns,
      sectors: {},
    };
    for (let r = 0; r < rowsAndColumns; r++) {
      for (let c = 1; c <= rowsAndColumns; c++) {
        const row = String.fromCharCode(65 + r);
        if (c === rowsAndColumns) {
          sectorGrid.lastRow = row;
        }
        sectorGrid.sectors[`${row}${c}`] = {
          center: {
            x: c * delimiter + delimiter / 2,
            y: r * delimiter + delimiter / 2,
          },
          starCoordinates: [],
          stars: [],
        };
      }
    }
    this.sectorGrid = sectorGrid;
  }
  // generate universe
  generate(options) {
    console.log(``);
    console.log("Generating universe...");
    // get start time to measure performance
    const start = performance.now();

    // options
    const {
      maxExtraGenerationLoops,
      maxStars,
      edgeDistance,
      size,
      minimumStarDistance,
      maxGenTime,
      radial,
    } = options;
    this.size = size;

    // center center of universe
    const center = {
      x: this.size / 2,
      y: this.size / 2,
    };

    // create sector grid
    this.generateSectorGrid(2000);

    // generation loop
    // keep generating until one threshold is hit
    this.extraGenerationLoops = 0;
    let proximityMax = 0;
    while (
      this.starCoordinates.length < maxStars &&
      this.extraGenerationLoops < maxExtraGenerationLoops &&
      performance.now() - start < maxGenTime
    ) {
      // create a random star coordinate
      let newStarCoordinate = {
        x: randomIntFromInterval(edgeDistance, this.size - edgeDistance),
        y: randomIntFromInterval(edgeDistance, this.size - edgeDistance),
      };

      // get the new coordinate sector
      let coordinateSector = this.getGridSector(
        newStarCoordinate.x,
        newStarCoordinate.y
      );

      const adjacentSectors = this.getAdjacentSectors(coordinateSector, true);

      const closeStars = this.getStarsFromSectorArray(adjacentSectors);
      proximityMax =
        proximityMax > closeStars.length ? proximityMax : closeStars.length;

      // variables for radial generation
      const maxDistanceFromCenter = this.size / 2;
      const distanceFromCenter = getDistanceAndAngleBetweenTwoPoints(
        newStarCoordinate,
        center
      ).distance;
      const percentOfMaxDistance = distanceFromCenter / maxDistanceFromCenter;

      // minimum distance from other existing coordinates
      // calculated if radial
      // fixed for non-radial
      const minimumAdjacentDistance = radial
        ? minimumStarDistance * percentOfMaxDistance
        : minimumStarDistance;

      if (radial && percentOfMaxDistance > 1) {
        // throw away coordinates that are outside the radial limit
        newStarCoordinate = null;
      } else if (this.starCoordinates.length === 0) {
        // place first coordinate at the center
        newStarCoordinate = center;
        coordinateSector = this.getGridSector(
          newStarCoordinate.x,
          newStarCoordinate.y
        );
      } else {
        // loop over existing coordinates to check minimum distance
        // for (let s = 0; s < starCoordinates.length; s++) {
        for (let s = 0; s < closeStars.length; s++) {
          // get distance between new and existing coordinates
          const coordinateDistance = getDistanceAndAngleBetweenTwoPoints(
            newStarCoordinate,
            // starCoordinates[s]
            closeStars[s].position
          ).distance;

          // throw out the new coordinate and break the loop if a close neighbor is found
          if (coordinateDistance < minimumAdjacentDistance) {
            this.extraGenerationLoops++;
            newStarCoordinate = null;
            break;
          }
        }
      }

      // finalize the coordinate if it didn't get thrown out
      if (newStarCoordinate !== null) {
        // give it a name
        newStarCoordinate.name = generateStarName();
        // assign it to a sector
        newStarCoordinate.sector = coordinateSector;
        // create a Star object
        const newStar = new Star(
          newStarCoordinate.x,
          newStarCoordinate.y,
          newStarCoordinate.name,
          newStarCoordinate._id || newStarCoordinate.name,
          newStarCoordinate.sector
        );

        // push the coordinate to the list
        this.starCoordinates.push(newStarCoordinate);
        this.stars.push(newStar);
        // push the coordinate to it's sector
        this.sectorGrid.sectors[coordinateSector].starCoordinates.push(
          newStarCoordinate
        );
        this.sectorGrid.sectors[coordinateSector].stars.push(newStar);
      }
    }
    // calculate the generation time
    this.generationTime = performance.now() - start;
    // log if loop limit is hit
    if (this.extraGenerationLoops >= maxExtraGenerationLoops) {
      console.log(
        `Generation stopped. Hit loop limit of ${maxExtraGenerationLoops.toLocaleString()}.`
      );
    }
    // log if max star limit is hit
    if (this.starCoordinates.length >= maxStars) {
      console.log(
        `Generation stopped. Hit star limit of ${maxStars.toLocaleString()}.`
      );
    }
    // log if max generation time is hit
    if (this.generationTime >= maxGenTime) {
      console.log(
        `Generation stopped. Hit max gen time of ${maxGenTime.toLocaleString()}ms.`
      );
    }
    // log generation time
    console.log(
      `${this.starCoordinates.length.toLocaleString()} stars generated in ${this.generationTime.toLocaleString()}ms.`
    );
    // log number of loops required
    console.log(
      `It took ${this.extraGenerationLoops.toLocaleString()} extra generation loops to meet the ${minimumStarDistance.toLocaleString()} pixel star distance criteria.`
    );
    // log max proximity loop
    console.log(
      `Max of ${proximityMax.toLocaleString()} calculations per star coordinate reached to verify minimum distance of ${minimumStarDistance.toLocaleString()}`
    );
    console.log(this);
    console.log(``);
  }
}

export default Universe;
