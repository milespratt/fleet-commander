const {
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Renderer,
  Container,
  Ticker,
  ParticleContainer
} = PIXI;

const Loader = PIXI.Loader.shared;
const Resources = PIXI.Loader.shared.resources;

// create renderer
const renderer = new Renderer({
  width: gamesize.width,
  height: gamesize.height,
  antialias: true,
  transparent: true,
  resolution: 1
});

// create containers
const shipContainer = new ParticleContainer();
const stage = new Container();
const starContainer = new Container();
const voyageLayer = new Container();

// create graphics and text
const textStyle = new PIXI.TextStyle({
  fontFamily: "Inconsolata",
  letterSpacing: 1.75,
  fontSize: 12,
  fontWeight: 700,
  fill: "white"
});
const voyageLine = new Graphics();
voyageLine.resolution = 1;
voyageLine.alpha = 1;

// attach canvas and containers
canvasWrapper.appendChild(renderer.view);
voyageLayer.addChild(voyageLine);
stage.addChild(starContainer);
stage.addChild(shipContainer);
stage.addChild(voyageLayer);

// start ticker
const ticker = new Ticker();
ticker.add(() => {
  renderer.render(stage);
}, PIXI.UPDATE_PRIORITY.LOW);
ticker.start();

// add event listeners
renderer.view.addEventListener("mousemove", function(event) {
  const bounds = event.target.getBoundingClientRect();
  const newMouse = {
    x: event.x - bounds.left,
    y: event.y - bounds.top
  };
  mouse = newMouse;
});
renderer.view.addEventListener("mouseleave", function(event) {
  mouse = {
    x: undefined,
    y: undefined
  };
});
renderer.view.addEventListener("click", function(event) {
  const bounds = event.target.getBoundingClientRect();
  const clickCoords = {
    x: event.x - bounds.left,
    y: event.y - bounds.top
  };
  const clickedShip = fleet.filter(ship => {
    return (
      distanceAndAngleBetweenTwoPoints(
        clickCoords.x,
        clickCoords.y,
        ship.coordinates.x,
        ship.coordinates.y
      ).distance < mouseProximity
    );
  })[0];
  if (clickedShip) {
    voyageLine.clear();
    lockShip = false;
    selectedShip = clickedShip;
    centerView(clickedShip.coordinates, clickedShip);
  } else {
    voyageLine.clear();
    selectedShip = undefined;
  }
});

// load assets
Loader.add([
  "assets/sprites/ship.png",
  "assets/sprites/ship-selected.png",
  "assets/sprites/ship-selection-ring.png",
  "assets/sprites/star.png"
]).load(setup);

// declate textures
let unselectShipTexture;
let selectedShipTexture;
let selectionRingTexture;
let starTexture;

// declare sprites
let destinationSprite;
let selectionSprite;
let hoverSprite;
let selectedShipSprite;

function setup() {
  // define textures
  unselectShipTexture = Resources["assets/sprites/ship.png"].texture;
  selectedShipTexture = Resources["assets/sprites/ship-selected.png"].texture;
  selectionRingTexture =
    Resources["assets/sprites/ship-selection-ring.png"].texture;
  starTexture = Resources["assets/sprites/star.png"].texture;

  // generate the universe
  universe = generateUniverse(gamesize, starDensity);
  starCount.innerText = `STARS ${universe.length.toLocaleString()}`;

  // place star sprites
  universe.forEach(starCoordinate => {
    const star = new Sprite(starTexture);
    star.anchor.set(0.5);
    const starSize = getStarRadius();
    star.x = starCoordinate.x;
    star.y = starCoordinate.y;
    star.height = starSize;
    star.width = starSize;
    star.resolution = 1;
    starContainer.addChild(star);
  });
  starContainer.cacheAsBitmap = true;

  fleet = generateFleet();
  fleet.forEach(ship => {
    // assign starting sprite and starting texture
    ship.sprite = new Sprite();
    ship.sprite.anchor.set(0.5);
    ship.sprite.texture = unselectShipTexture;
    ship.sprite.height = 6;
    ship.sprite.width = 6;

    // add message
    ship.message = new Text(ship.name, textStyle);
    ship.statsText = new Text("STATS: THIS IS A STAT", textStyle);
    ship.message.resolution = 2;
    ship.statsText.resolution = 2;

    shipContainer.addChild(ship.sprite);
  });

  // create sprites
  destinationSprite = new Sprite(selectedShipTexture);
  destinationSprite.anchor.set(0.5);
  destinationSprite.height = 6;
  destinationSprite.width = 6;
  destinationSprite.visible = false;

  selectionSprite = new Sprite(selectionRingTexture);
  selectionSprite.anchor.set(0.5);
  selectionSprite.visible = false;

  hoverSprite = new Sprite(selectedShipTexture);
  hoverSprite.anchor.set(0.5);
  hoverSprite.height = 20;
  hoverSprite.width = 20;
  hoverSprite.visible = false;

  selectedShipSprite = new Sprite(selectedShipTexture);
  selectedShipSprite.anchor.set(0.5);
  selectedShipSprite.height = 10;
  selectedShipSprite.width = 10;
  selectedShipSprite.visible = false;

  // attach all sprites
  stage.addChild(selectionSprite);
  stage.addChild(destinationSprite);
  stage.addChild(hoverSprite);
  stage.addChild(selectedShipSprite);

  //Start the game loop
  ticker.add(delta => gameLoop(delta));
}