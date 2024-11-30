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

/**
 * Applica un'ombra in base ai parametri
 */
function applyShadow({ color, blur, offsetX, offsetY }) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
}

/**
 * Resetta l'ombra e la rimuove dal contesto
 */
function resetShadow() {
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * Restituisce la lunghezza del testo in px
 * @param {string} text il testo di cui calcolare la lunghezza
 * @returns un valore in px che rappresenta la dimensione del testo in lunghezza
 */
function textWidth(text) {
  return ctx.measureText(text).width;
}

function drawBullet({ x, y, radius, startAngle, endAngle, color }) {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  ctx.fillStyle = CONFIG.typography.textColor;
}
