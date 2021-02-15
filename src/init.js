// babel dependencies
import "regenerator-runtime/runtime"; // async-await
import { io } from "socket.io-client";

// loaders
import loadData from "./loadData";
import loadRenderer from "./loadRenderer";
import fontLoader from "./fontLoader";
import windows from "./windows";
import loadControls from "./loadControls";
// import loadAudio from "./audio";

async function init() {
  const universe = await loadData();
  await fontLoader();
  windows();
  // loadAudio();
  loadControls();
  loadRenderer(universe);
}

init();
