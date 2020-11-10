// babel dependencies
import "regenerator-runtime/runtime"; // async-await

// loaders
import loadData from "./loadData";
import loadRenderer from "./loadRenderer";

async function init() {
  const universe = await loadData();
  loadRenderer(universe);
}
init();
