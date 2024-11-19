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

// --- KEYBOARD ---
const INTERACTION_COOLDOWN_TIME = 300;
const INTERACTION_CHOICES_COOLDOWN_TIME = 100;
const KEYBOARD_SWITCH_KEY = "s";
const KEYBOARD_INTERACT_KEY = "a";

// --- NPC ---
const NPC_DIALOGUE_FONT_SIZE = 12;
const NPC_DIALOGUE_FONT_FAMILY = "Comic Sans MS";
const NPC_DIALOGUE_FONT_NORMAL = `${NPC_DIALOGUE_FONT_SIZE}px ${NPC_DIALOGUE_FONT_FAMILY}`;
const NPC_DIALOGUE_FONT_BOLD = `bold ${NPC_DIALOGUE_FONT_SIZE}px ${NPC_DIALOGUE_FONT_FAMILY}`;
const NPC_DIALOGUE_NAME_COLOR = "red";
const NPC_DIALOGUE_TEXT_COLOR = "black";
const NPC_DIALOGUE_BALLOON_COLOR = "white";
const NPC_DIALOGUE_BALLOON_BORDER_COLOR = "black";
