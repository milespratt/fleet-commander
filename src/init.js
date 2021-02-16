// babel dependencies
import "regenerator-runtime/runtime"; // async-await
import { io } from "socket.io-client";

// loaders
import loadData from "./loadData";
import loadRenderer from "./loadRenderer";
import fontLoader from "./fontLoader";
import loadWindows from "./loadWindows";
import loadControls from "./loadControls";
// import loadAudio from "./audio";
import profileApp from "./user";

async function init() {
  await fontLoader();
  await profileApp();

  const universe = await loadData();
  loadWindows();
  loadControls();
  // loadAudio();
  loadRenderer(universe);
}

init();
