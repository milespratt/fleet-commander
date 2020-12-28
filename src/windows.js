export default () => {
  const windows = document.querySelectorAll(".window");
  let dragging = false;
  const config = {
    canDrag: false,
    cursorOffsetX: null,
    cursorOffsetY: null,
  };

  function adjustPostion(event) {
    if (event.clientX <= 0 || event.clientY <= 0) {
      console.log("skipped");
      return;
    }
    var elm = event.target;
    elm.style.left = event.clientX - 2 - config.cursorOffsetX + "px";
    elm.style.top = event.clientY - 2 - config.cursorOffsetY + "px";
    // console.log(event.pageX);
    // console.log(event.pageY);
  }

  function reset() {
    config.cursorOffsetX = null;
    config.cursorOffsetY = null;
  }

  function isDraggable(element) {
    return element.classList.contains("draggable");
  }
  windows.forEach((draggableWindow, index) => {
    draggableWindow.style.top = `${(index + 1) * 35}px`;
    draggableWindow.style.left = `${(index + 1) * 35}px`;
    draggableWindow.style.zIndex = 1000;
    draggableWindow.addEventListener("pointerdown", function (event) {
      event.stopPropagation();
      if (isDraggable(event.target)) {
        // console.log("+++++++++++++ dragstart");
        dragging = true;
        config.cursorOffsetX = event.offsetX;
        config.cursorOffsetY = event.offsetY;
        adjustPostion(event);
        event.target.style.cursor = "grabbing";
        event.target.classList.add("bordered--white");

        event.target.classList.add("dragging");
        let index = 0;
        windows.forEach((indexedWindow) => {
          const indexedWindowIndex = parseInt(indexedWindow.style["z-index"]);
          index = index > indexedWindowIndex ? index : indexedWindowIndex;
        });
        event.target.style.zIndex = index + 5;
      }
    });
    draggableWindow.addEventListener("pointermove", function (event) {
      event.stopPropagation();
      if (isDraggable(event.target)) {
        if (dragging) {
          // console.log("+++++++++++++ drag");

          adjustPostion(event);
        }
      }
    });
    draggableWindow.addEventListener("pointerup", function (event) {
      event.stopPropagation();
      if (isDraggable(event.target)) {
        // console.log("+++++++++++++ dragend");
        dragging = false;
        event.target.style.cursor = "grab";
        event.target.classList.remove("bordered--white");
        reset();
        event.target.classList.remove("dragging");
      }
    });
  });
};
