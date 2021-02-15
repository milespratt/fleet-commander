class AstronomicalObject {
  constructor(name, id, universe, sector, resources) {
    this.name = name;
    this.id = id;
    this.universe = universe;
    this.sector = sector;
    this.owner = null;
    this.resources = resources;
  }
  claim(owner) {
    console.log("claiming!");
    // this.owner = owner;
  }
  mine(resource, amount) {
    this.resrouces[resource] -= amount;
  }
}

export default AstronomicalObject;
