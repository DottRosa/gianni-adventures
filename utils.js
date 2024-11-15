const DIRECTION_KEYS = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
};

/**
 * Calculate the coordinates of the upper left corner so that the desired box is in the center
 * @param {number} cellX the x coord of the tile
 * @param {number} cellY the y coord of the tile
 * @returns {x: number, y: number} the position object
 */
function getCoordsByCell(cellX, cellY) {
  return {
    x: -TILE_DIM * (cellX - TILES_FROM_CENTER_X),
    y: -TILE_DIM * (cellY - TILES_FROM_CENTER_Y),
  };
}
