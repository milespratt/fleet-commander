// babel dependencies
import "regenerator-runtime/runtime"; // async-await

// loaders
import loadData from "./loadData";
import loadRenderer from "./loadRenderer";
import fontLoader from "./fontLoader";

async function init() {
  const universe = await loadData();
  await fontLoader();
  loadRenderer(universe);
}

init();
