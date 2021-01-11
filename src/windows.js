export default () => {
  const windows = document.querySelectorAll(".window");
  let dragging = false;
  const config = {
    canDrag: false,
    cursorStartX: null,
    cursorStartY: null,
    windowStartX: null,
    windowStartY: null,
  };

  function adjustPostion(event) {
    if (event.clientX <= 0 || event.clientY <= 0) {
      console.log("skipped");
      return;
    }
    // var elm = event.target;
    const elm = dragging;

    const xTranslate = event.pageX - config.cursorStartX + config.windowStartX;
    const yTranslate = event.pageY - config.cursorStartY + config.windowStartY;

    elm.style.transform = `translate(${xTranslate}px,${yTranslate}px)`;
  }

  function reset() {
    config.cursorOffsetX = null;
    config.cursorOffsetY = null;
  }

  function isDraggable(element) {
    return element.classList.contains("draggable");
  }
  windows.forEach((draggableWindow, index) => {
    draggableWindow.style.top = `${
      window.innerHeight / 2 -
      draggableWindow.getBoundingClientRect().height / 2
    }px`;
    draggableWindow.style.left = `${
      window.innerWidth / 2 - draggableWindow.getBoundingClientRect().width / 2
    }px`;
    draggableWindow.style.zIndex = 1000;
    draggableWindow.addEventListener("pointerdown", function (event) {
      event.stopPropagation();

      if (isDraggable(event.target)) {
        // console.log("+++++++++++++ dragstart");
        dragging = event.target;

        const windowElementStyle = window.getComputedStyle(event.target);
        const transformMatrix = new WebKitCSSMatrix(
          windowElementStyle.transform
        );
        config.cursorStartX = event.pageX;
        config.cursorStartY = event.pageY;
        config.windowStartX = transformMatrix.m41;
        config.windowStartY = transformMatrix.m42;
        // adjustPostion(event);
        event.target.style.cursor = "grabbing";
        event.target.classList.add("bordered--white");

        event.target.classList.add("dragging");
        let index = 0;
        windows.forEach((indexedWindow) => {
          const indexedWindowIndex = parseInt(indexedWindow.style["z-index"]);
          index = index > indexedWindowIndex ? index : indexedWindowIndex;
          indexedWindow.classList.remove("window--active");
        });
        event.target.style.zIndex = index + 5;
        event.target.classList.add("window--active");
        document
          .querySelectorAll(".toggle")
          .forEach((toggle) => toggle.classList.remove("toggle--active"));
        document
          .getElementById(`${draggableWindow.id}-control`)
          .classList.add("toggle--active");
      }
    });
    window.addEventListener("pointermove", function (event) {
      event.stopPropagation();
      // if (isDraggable(event.target)) {
      if (dragging) {
        // console.log("+++++++++++++ drag");

        adjustPostion(event);
      }
      // }
    });
    window.addEventListener("pointerup", function (event) {
      event.stopPropagation();
      if (dragging) {
        // console.log("+++++++++++++ dragend");
        dragging.style.cursor = "grab";
        dragging.classList.remove("bordered--white");
        reset();
        dragging.classList.remove("dragging");
        dragging = null;
      }
    });
  });
};
