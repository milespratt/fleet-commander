// PIXI
import * as PIXI from "pixi.js";
import Cull from "pixi-cull";

export function startCulling(containers, viewport, stats) {
  const cull = new Cull.Simple();
  containers.forEach((container) => cull.addList(container.children));
  cull.cull(viewport.getVisibleBounds());
  console.log("Culling started!");

  // cull whenever the viewport moves
  PIXI.Ticker.shared.add(() => {
    if (viewport.dirty) {
      const boundingBox = viewport.getVisibleBounds();
      const cullingBounds = {
        width: boundingBox.width,
        height: boundingBox.height,
        x: boundingBox.x,
        y: boundingBox.y,
      };
      cull.cull(cullingBounds);
      if (stats) {
        console.log(cull.stats());
      }
      viewport.dirty = false;
    }
  });
}
