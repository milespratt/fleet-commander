import controls from "./config/controls";

function toggleWindow(control, windowElement) {
  if (control.classList.contains("control--faded")) {
    control.classList.remove("control--faded");
    if (windowElement) {
      windowElement.classList.remove("faded");
    }
  } else {
    control.classList.add("control--faded");
    if (windowElement) {
      windowElement.classList.add("faded");
    }
  }
}

function makeControl(control) {
  const windowElement = document.getElementById(control.windowID);
  let windowCloseButton;
  if (windowElement) {
    windowElement.classList.add("faded");
    windowCloseButton = document.getElementById(`${control.windowID}-close`);
  }
  const newControl = document.createElement("BUTTON");
  const classes = [
    "control",
    "control--faded",
    "global",
    "bordered",
    "blue__glow",
    "padded--light",
    // "control--notify",
  ];
  newControl.classList.add(...classes);
  newControl.innerHTML = ` <i class="fal ${control.icon}"></i>
	<span class="global__label">${control.name}</span>`;
  if (windowElement) {
    newControl.addEventListener("click", () => {
      toggleWindow(newControl, windowElement);
    });

    windowCloseButton.addEventListener("click", () => {
      toggleWindow(newControl, windowElement);
    });
  }
  return newControl;
}

function makeControlGroup(group, container) {
  const newGroupClasses = ["control__group", "grid", "grid--r"];
  const newGroup = document.createElement("DIV");
  newGroup.classList.add(...newGroupClasses);

  const newGroupControlsClasses = [
    "control__group__controls",
    "grid",
    "grid--c",
  ];
  const newGroupControls = document.createElement("DIV");
  newGroupControls.classList.add(...newGroupControlsClasses);

  const newGroupLabelClasses = ["control__group__label", "blue__glow"];
  const newGroupLabel = document.createElement("SPAN");
  newGroupLabel.innerText = group.name;
  newGroupLabel.classList.add(...newGroupLabelClasses);

  newGroup.appendChild(newGroupControls);
  newGroup.appendChild(newGroupLabel);

  group.controls.forEach((control) => {
    newGroupControls.appendChild(makeControl(control));
  });
  container.appendChild(newGroup);
}

export default () => {
  const globalContainer = document.getElementById("globals");
  let windows;
  controls.categories.forEach((category) => {
    makeControlGroup(category, globalContainer);
  });
};
