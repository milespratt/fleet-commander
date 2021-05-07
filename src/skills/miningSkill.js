import Skill from "./skill";
import { statuses } from "../config";

class MiningSkill extends Skill {
  constructor(entity) {
    super("Mine", "Mining", 1, entity);
    this.speed = 1 / 60; // 1kg per second
    this.start = this.startMining.bind(this);
    this.stop = this.stopMining.bind(this);
    this.tick = this.mine.bind(this);
  }
  startMining() {
    if (!this.entity.location) {
      console.log("Nothing to mine!");
      return;
    }
    this.active = true;
    this.entity.status = statuses.mining;
  }
  stopMining() {
    this.active = false;
    this.entity.status = statuses.idle;
  }
  mine(astronomicalObject, delta) {
    if (
      this.entity.cargo < this.entity.maxCargo &&
      this.entity.status === statuses.mining &&
      this.entity.location.resources.hydrogen >= this.speed * delta
    ) {
      const mineQuantity = this.speed * delta;
      this.entity.cargo += mineQuantity;
      this.entity.location.resources.hydrogen -= mineQuantity;
    } else if (this.entity.cargo >= this.entity.maxCargo) {
      console.log("Cargo is full");
      this.stopMining();
    } else if (this.entity.status !== statuses.mining) {
      console.log("Ship taking another action");
      this.stopMining();
    } else if (this.entity.location.resources.hydrogen < this.speed * delta) {
      if (this.entity.location.resources.hydrogen > 0) {
        const mineQuantity = this.entity.location.resources.hydrogen;
        this.entity.cargo += mineQuantity;
        this.entity.location.resources.hydrogen -= mineQuantity;
      } else {
        console.log("No more resources to mine");
        this.stopMining();
      }
    }
  }
}

export default MiningSkill;
