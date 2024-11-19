/**
 * Calculate the coordinates of the upper left corner so that the desired box is in the center
 * @param {number} cellX the x coord of the tile
 * @param {number} cellY the y coord of the tile
 * @returns {x: number, y: number} the position object
 */
function getCoordsByCell(cellX, cellY) {
  return {
    x: -CONFIG.tile.tileDim * (cellX - CONFIG.tile.tilesFromCenterX),
    y: -CONFIG.tile.tileDim * (cellY - CONFIG.tile.tilesFromCenterY),
  };
}

function getCellByCoords(x, y) {
  const realXCenter = CONFIG.tile.tilesFromCenterX * CONFIG.tile.tileDim;
  const realYCenter = CONFIG.tile.tilesFromCenterY * CONFIG.tile.tileDim;

  let cellX = 0;
  if (x >= 0) {
    cellX = Math.round(Math.abs(realXCenter - x) / CONFIG.tile.tileDim);
  } else {
    cellX = Math.round(
      Math.abs(x) / CONFIG.tile.tileDim + CONFIG.tile.tilesFromCenterX
    );
  }

  let cellY = 0;
  if (y >= 0) {
    cellY = Math.round(Math.abs(realYCenter - y) / CONFIG.tile.tileDim);
  } else {
    cellY = Math.round(
      Math.abs(y) / CONFIG.tile.tileDim + CONFIG.tile.tilesFromCenterY
    );
  }

  return {
    cellX,
    cellY,
  };
}
