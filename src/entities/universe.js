class Universe {
  constructor(
    starCoordinates,
    sectorGrid,
    size,
    generationTime,
    extraGenerationLoops
  ) {
    this.starCoordinates = starCoordinates;
    this.sectorGrid = sectorGrid;
    this.size = size;
    this.generationTime = generationTime;
    this.extraGenerationLoops = extraGenerationLoops;
  }
}

export default Universe;
