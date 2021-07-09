// ENTITIES
import { Star, MiningShip, Ship, Universe } from "./entities";
import { MiningSkill } from "./skills";
// import { getRandomStar } from "./helpers";

import {
  baseAPIurl,
  generationParameters,
  shipNames,
  lightSpeed,
  lightYear,
} from "./config";

export default () => {
  return new Promise(async (resolve, reject) => {
    const baseGenerationParameters = {
      // maxExtraGenerationLoops: 1000000,
      maxStars: 10000, // 50,000
      maxGenTime: 1000 * 10, // milliseconds base
      edgeDistance: 100, // pixels from edge
      // 100 pixels per light year
      // numbers below in pixels
      size: 25000,
      minimumStarDistance: 100, // 100 default
      radial: false,
    };
    const storedGenerationParameters = localStorage.getItem(
      "generation_parameters"
    );
    if (storedGenerationParameters) {
      const parsedGenerationParameters = JSON.parse(storedGenerationParameters);
      generationParameters.size = parseInt(parsedGenerationParameters.size);
      generationParameters.maxStars = parseInt(
        parsedGenerationParameters.maxStars
      );
      generationParameters.maxGenTime = parseInt(
        parsedGenerationParameters.maxGenTime
      );
      generationParameters.minimumStarDistance = parseInt(
        parsedGenerationParameters.minimumStarDistance
      );
      generationParameters.edgeDistance = parseInt(
        parsedGenerationParameters.edgeDistance
      );
      generationParameters.radial = parsedGenerationParameters.radial;
    }
    localStorage.setItem(
      "generation_parameters",
      JSON.stringify(generationParameters)
    );
    var generationApp = new Vue({
      el: "#generation-window",
      data: {
        size: generationParameters.size,
        maxStars: generationParameters.maxStars,
        maxGenTime: generationParameters.maxGenTime,
        minimumStarDistance: generationParameters.minimumStarDistance,
        edgeDistance: generationParameters.edgeDistance,
        radial: generationParameters.radial,
        universe: null,
      },
      methods: {
        generate: function (ev) {
          ev.preventDefault();
          const newGenerationParameters = {
            size: this.size,
            maxStars: this.maxStars,
            minimumStarDistance: this.minimumStarDistance,
            maxGenTime: this.maxGenTime,
            edgeDistance: this.edgeDistance,
            radial: this.radial,
          };
          localStorage.setItem(
            "generation_parameters",
            JSON.stringify(newGenerationParameters)
          );
          location.reload();
        },
        reset: function (ev) {
          ev.preventDefault();
          this.size = baseGenerationParameters.size;
          this.maxGenTime = baseGenerationParameters.maxGenTime;
          this.maxStars = baseGenerationParameters.maxStars;
          this.minimumStarDistance =
            baseGenerationParameters.minimumStarDistance;
          this.edgeDistance = baseGenerationParameters.edgeDistance;
          this.radial = baseGenerationParameters.radial;
          localStorage.setItem(
            "generation_parameters",
            JSON.stringify(baseGenerationParameters)
          );
          // location.reload();
        },
      },
      mounted: function () {
        // GENERATION
        const newUniverse = new Universe();
        newUniverse.generate(generationParameters);
        newUniverse.ships = [];

        // create ships
        // const shipOrigin = newUniverse.getRandomStar();

        // const shipList = [
        //   {
        //     name: "Test Ship",
        //     range: 300,
        //     speed: 0.1,
        //     x: shipOrigin.x,
        //     y: shipOrigin.y,
        //     origin: shipOrigin,
        //     // destination,
        //   },
        // ];
        const shipList = shipNames.map((name, i) => {
          // const shipList = new Array(0).fill(undefined).map((e, i) => {
          const shipOrigin = newUniverse.getRandomStar();
          return {
            // name: `Ship-${i + 1}`,
            name,
            range: 300,
            speed: (lightSpeed / lightYear) * 1,
            x: shipOrigin.position.x,
            y: shipOrigin.position.y,
            origin: shipOrigin,
            // destination,
          };
        });
        const shortList = [shipList[0]];
        for (const ship of shipList) {
          const { name, range, speed, x, y, origin } = ship;
          const destination = newUniverse.getRandomStar({
            distance: range,
            origin,
          });
          const newShip = new Ship(
            name,
            ship._id || name,
            range,
            x,
            y,
            { ...origin, id: origin._id || origin.name },
            { ...destination, id: destination._id || destination.name },
            newUniverse
          );
          const newMiningSkill = new MiningSkill(newShip);
          newShip.skills[newMiningSkill.skillName] = newMiningSkill;
          newUniverse.ships.push(newShip);
        }
        this.universe = {
          size: newUniverse.size,
          stars: newUniverse.stars.length,
          sectors: newUniverse.sectorGrid.totalSectors,
          generationTime: newUniverse.generationTime,
          extraGenerationLoops: newUniverse.extraGenerationLoops,
          sectorSize: newUniverse.sectorGrid.delimiter,
          biggestStar: newUniverse.biggestStar,
          starStats: {
            ...newUniverse.starStats,
          },
        };
        resolve(newUniverse);
      },
    });
  });
};
