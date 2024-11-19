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

// --- PLAYERS ---
const MOVEMENT_FRAMES = 12;
const FRAME_VELOCITY = TILE_DIM / MOVEMENT_FRAMES;
const PLAYER_VELOCITY = FRAME_VELOCITY;
const PLAYER_INTERACTION_AREA = TILE_DIM;
const DISTANCE_BETWEEN_PARTNERS = 50;
const PLAYER_FABRISSAZZO = "fabrissazzo";
const PLAYER_GIANNI = "gianni";

let mainPlayer = PLAYER_GIANNI;
let partnerPlayer = PLAYER_FABRISSAZZO;

const CONFIG = {
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
