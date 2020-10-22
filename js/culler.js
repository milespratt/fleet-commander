// PIXI
import * as PIXI from "pixi.js";
import Cull from "pixi-cull";
// import { Cull as NewCull } from "@pixi-essentials/cull";

export function startCulling(viewport) {
  const cull = new Cull.Simple();
  cull.addList(viewport.children);
  cull.cull(viewport.getVisibleBounds());
  console.log("started culling");

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
      viewport.dirty = false;
    }
  });
}
