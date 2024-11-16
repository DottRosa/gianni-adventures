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

function getCellByCoords(x, y) {
  const realXCenter = TILES_FROM_CENTER_X * TILE_DIM;
  const realYCenter = TILES_FROM_CENTER_Y * TILE_DIM;

  let cellX = 0;
  if (x >= 0) {
    cellX = Math.round(Math.abs(realXCenter - x) / TILE_DIM);
  } else {
    cellX = Math.round(Math.abs(x) / TILE_DIM + TILES_FROM_CENTER_X);
  }

  let cellY = 0;
  if (y >= 0) {
    cellY = Math.round(Math.abs(realYCenter - y) / TILE_DIM);
  } else {
    cellY = Math.round(Math.abs(y) / TILE_DIM + TILES_FROM_CENTER_Y);
  }

  return {
    cellX,
    cellY,
  };
}
