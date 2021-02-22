import Ship from "./ship";

import { statuses, calculationMultiplier } from "../config";

class MiningShip extends Ship {
  constructor(name, id, range, x, y, origin, destination, universe) {
    super(name, id, range, x, y, origin, destination, universe);
    this.miningSpeed = 1 / 60; // 1kg per second
    this.cargo = 0;
    this.maxCargo = 100000; // kg
    this.type = "Mining Ship";
    this.mine = this.mine.bind(this);
  }
  startMining() {
    if (this.status === statuses.idle && this.cargo < this.maxCargo) {
      console.log("Mining Started");
      this.status = statuses.mining;
      this.actions.mine = this.mine;
    } else if (this.status !== statuses.idle) {
      console.log("Ship must be idle to begin mining");
    } else if (this.cargo >= this.maxCargo) {
      console.log("Not enough cargo space to mine");
    }
  }
  stopMining() {
    console.log("Mining Stopped");
    this.status = statuses.idle;
    delete this.actions.mine;
  }
  mine(delta) {
    if (
      this.cargo < this.maxCargo &&
      this.status === statuses.mining &&
      this.location.resources.hydrogen >= this.miningSpeed * delta
    ) {
      const mineQuantity = this.miningSpeed * delta;
      this.cargo += mineQuantity;
      this.location.resources.hydrogen -= mineQuantity;
    } else if (this.cargo >= this.maxCargo) {
      console.log("Cargo is full");
      this.stopMining();
    } else if (this.status !== statuses.mining) {
      console.log("Ship taking another action");
      this.stopMining();
    } else if (this.location.resources.hydrogen < this.miningSpeed * delta) {
      if (this.location.resources.hydrogen > 0) {
        const mineQuantity = this.location.resources.hydrogen;
        this.cargo += mineQuantity;
        this.location.resources.hydrogen -= mineQuantity;
      } else {
        console.log("No more resources to mine");
        this.stopMining();
      }
    }
  }
}

export default MiningShip;
