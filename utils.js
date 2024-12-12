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

/**
 * Disegna un pallino pieno
 * @param {*} params parametri necessari per disegnare il pallino
 */
function drawBullet({ x, y, radius, startAngle, endAngle, color }) {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  ctx.fillStyle = CONFIG.typography.textColor;
}

function wrapText(text, maxWidth) {
  const words = text.split(" "); // Dividi la stringa in parole
  let line = ""; // Riga temporanea
  const lines = []; // Contiene tutte le righe finali

  words.forEach((word) => {
    const testLine = line + word + " ";
    const testWidth = textWidth(testLine);

    if (testWidth > maxWidth) {
      // Se la riga supera la larghezza massima, aggiungila e inizia una nuova
      lines.push(line);
      line = word + " ";
    } else {
      line = testLine; // Altrimenti, aggiungi la parola alla riga corrente
    }
  });

  lines.push(line.trim()); // Aggiungi l'ultima riga
  return lines;
}

/**
 * Data una lista restituisce un indice a caso
 * @param {*} list la lista di cui prendere l'indice
 * @returns un indice casuale della lista
 */
function getRandomIndex(list) {
  return Math.floor(Math.random() * list.length);
}

/**
 * Disegna un arco tra due punti A e B
 * @param {number} startX - Coordinata X del punto di partenza
 * @param {number} startY - Coordinata Y del punto di partenza
 * @param {number} endX - Coordinata X del punto di arrivo
 * @param {number} endY - Coordinata Y del punto di arrivo
 * @param {number} height - Altezza massima dell'arco
 */
function drawArc({ startX, startY, endX, endY, height }) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);

  // Calcola il punto di controllo per la curva quadratica
  const controlX = (startX + endX) / 2;
  const controlY = Math.min(startY, endY) - height;

  // Disegna una curva quadratica
  ctx.quadraticCurveTo(controlX, controlY, endX, endY);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function getOtherPlayer(playerId) {
  if (playerId === CONFIG.player.fabrissazzo) {
    return GLOBALS.players[CONFIG.player.gianni];
  }
  if (playerId === CONFIG.player.gianni) {
    return GLOBALS.players[CONFIG.player.fabrissazzo];
  }
}

/**
 * Disegna un rettangolo dai bordi arrotondati
 * @param {*} ctx il contesto
 * @param {*} x posizione x
 * @param {*} y posizione y
 * @param {*} width larghezza del rettangolo
 * @param {*} height altezza del rettangolo
 * @param {*} radius border radius
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawHotkey(ctx, x, y, button) {
  const rectWidth = button.width;

  const rectHeight = CONFIG.dialogue.hotkeys.height;
  const borderRadius = 10;

  // Disegna il rettangolo arrotondato di sfondo
  ctx.fillStyle = "black";
  drawRoundedRect(ctx, x, y, rectWidth, rectHeight, borderRadius);

  // Disegna il pallino bianco per il tasto
  const circleRadius = 7;
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(x + 10, y + rectHeight / 2, circleRadius, 0, Math.PI * 2);
  ctx.fill();

  // Scrivi il nome del tasto dentro il pallino
  ctx.fillStyle = "black";
  ctx.font = "bold 13px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(button.key.toUpperCase(), x + 10, y + rectHeight / 2 + 1);

  // Scrivi l'azione accanto al pallino
  ctx.fillStyle = "white";
  ctx.font = "13px Arial";
  ctx.textAlign = "left";
  ctx.fillText(button.label, x + 25, y + rectHeight / 2 + 1);
}
