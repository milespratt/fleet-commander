function defaultOnClick() {
  console.log("Interaction manager no on click handler...");
}

function defaultOnHover() {
  console.log("Interaction manager no on hover handler...");
}

function defaultOnBlur() {
  console.log("Interaction manager no on blur handler...");
}

class Interaction {
  constructor(
    entity,
    onClick = defaultOnClick,
    onHover = defaultOnHover,
    onBlur = defaultOnBlur
  ) {
    this.entity = entity;
    this.onClick = onClick;
    this.onHover = onHover;
    this.onBlur = onBlur;
  }
  click() {
    this.onClick();
  }
  hover() {
    this.onHover();
  }
  blur() {
    this.onBlur();
  }
}

export default Interaction;
