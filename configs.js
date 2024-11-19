// --- CONFIGS ---
// Zoom percentage
const ZOOM = 500;
const REAL_TILE_DIM = 12; // Dimension of a single tile
const TILES_PER_X = 17; // Number of tiles to display in the canvas in the x axis
const TILES_PER_Y = 11; // Number of tiles to display in the canvas in the y axis

// --- CALCULATED ---
const TILE_DIM = (REAL_TILE_DIM * ZOOM) / 100; // The dim of the zoomed tile
const CANVAS_WIDTH = TILE_DIM * TILES_PER_X;
const CANVAS_HEIGHT = TILE_DIM * TILES_PER_Y;
const TILES_FROM_CENTER_X = Math.floor(TILES_PER_X / 2);
const TILES_FROM_CENTER_Y = Math.floor(TILES_PER_Y / 2);
const ASSETS_FOLDER = "./assets";

const CONFIG = {
  player: {
    movementFrames: 12,
    get frameVelocity() {
      return TILE_DIM / this.movementFrames;
    },
    velocity: null,
    interactionArea: null,
    distanceBetweenPartners: 50,
    fabrissazzo: "fabrissazzo",
    gianni: "gianni",
    main: null,
    partner: null,
  },
  keyboard: {
    interactionCooldown: 300,
    choicesCooldown: 100,
    switchKey: "s",
    interactKey: "a",
  },
  dialogue: {
    fontSize: 13,
    fontFamily: "Comic Sans MS",
    textAlign: "left",
    fontNormal: null, // calcolato dopo
    fontBold: null, // calcolato dopo
    nameColor: "red",
    textColor: "black",
    balloon: {
      backgroundColor: "white",
      borderColor: "black",
      height: 75,
      width: 150,
    },
  },
};

CONFIG.dialogue.fontNormal = `${CONFIG.dialogue.fontSize}px ${CONFIG.dialogue.fontFamily}`;
CONFIG.dialogue.fontBold = `bold ${CONFIG.dialogue.fontSize}px ${CONFIG.dialogue.fontFamily}`;

CONFIG.player.velocity = CONFIG.player.frameVelocity;
CONFIG.player.interactionArea = TILE_DIM;
CONFIG.player.main = CONFIG.player.gianni;
CONFIG.player.partner = CONFIG.player.fabrissazzo;

let mainPlayer = CONFIG.player.main;
let partnerPlayer = CONFIG.player.partner;
