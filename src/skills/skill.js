class Skill {
  constructor(actionName, skillName, cost, entity) {
    this.actionName = actionName;
    this.skillName = skillName;
    this.cost = cost;
    this.entity = entity;
    this.active = false;
  }
}

export default Skill;
