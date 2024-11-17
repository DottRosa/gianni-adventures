// --- CONFIGS ---
// Zoom percentage
const ZOOM = 500;

// Dimension of a single tile
const REAL_TILE_DIM = 12;

// Number of tiles to display in the canvas in the x axis
const TILES_PER_X = 17;
// Number of tiles to display in the canvas in the y axis
const TILES_PER_Y = 11;

// --- CALCULATED ---
// The dim of the zoomed tile
const TILE_DIM = (REAL_TILE_DIM * ZOOM) / 100;

const CANVAS_WIDTH = TILE_DIM * TILES_PER_X;
const CANVAS_HEIGHT = TILE_DIM * TILES_PER_Y;

const TILES_FROM_CENTER_X = Math.floor(TILES_PER_X / 2);
const TILES_FROM_CENTER_Y = Math.floor(TILES_PER_Y / 2);

const ASSETS_FOLDER = "./assets";

const PLAYER_INTERACTION_AREA = TILE_DIM;
