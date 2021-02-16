import controls from "./config/controls";

function bringToFront(windowElement) {
  let index = 0;
  document.querySelectorAll(".window").forEach((indexedWindow) => {
    const indexedWindowIndex = parseInt(indexedWindow.style["z-index"]);
    index = index > indexedWindowIndex ? index : indexedWindowIndex;
    indexedWindow.classList.remove("window--active");
  });
  windowElement.style.zIndex = index + 5;
  windowElement.classList.add("window--active");
}

function deactivateWindows() {
  document
    .querySelectorAll(".window")
    .forEach((windowElement) =>
      windowElement.classList.remove("window--active")
    );
}

function fadeWindow(control, windowElement) {
  control.classList.add("control--faded");
  control.classList.remove("toggle--active");
  if (windowElement) {
    windowElement.classList.add("faded");
  }
}

function showWindow(control, windowElement) {
  control.classList.remove("control--faded");
  document
    .querySelectorAll(".toggle")
    .forEach((toggle) => toggle.classList.remove("toggle--active"));
  control.classList.add("toggle--active");
  if (windowElement) {
    bringToFront(windowElement);
    windowElement.classList.remove("faded");
    windowElement.classList.add("window--active");
  }
}

function toggleWindow(control, windowElement) {
  if (control.classList.contains("control--faded")) {
    showWindow(control, windowElement);
  } else {
    fadeWindow(control, windowElement);
    if (windowElement.classList.contains("window--active")) {
      fadeWindow(control, windowElement);
    } else {
      showWindow(control, windowElement);
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
    "toggle",
    // "pic__control",
    "bordered",
    "blue__glow",
    "padded",
    // "control--notify",
    "toggle",
  ];
  newControl.classList.add(...classes);
  newControl.innerHTML = `<i class="fal ${control.icon} control__icon"></i>
	<span class="toggle__label">${control.name}</span>`;
  newControl.id = `${control.windowID}-control`;
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
  const toggleContainer = document.getElementById("toggles");
  controls.categories.forEach((category) => {
    makeControlGroup(category, toggleContainer);
  });
  const domControls = document.querySelectorAll(".control");
  domControls.forEach((domControl) => {
    domControl.addEventListener("pointerdown", (ev) => {
      // domControl.classList.add("bordered--white");
      // domControl.classList.add("white__glow");
      domControl.classList.add("control--active");
    });
    domControl.addEventListener("pointerup", (ev) => {
      // domControl.classList.remove("bordered--white");
      // domControl.classList.remove("white__glow");
      domControl.classList.remove("control--active");
    });
    domControl.addEventListener("pointerout", (ev) => {
      // domControl.classList.remove("bordered--white");
      // domControl.classList.remove("white__glow");
      domControl.classList.remove("control--active");
    });
  });
  toggleContainer.classList.remove("hidden");
};
