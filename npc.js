class NPC extends Sprite {
  constructor({
    spriteImages,
    startDirection = "right",
    mapPositionCell = { cellX: 0, cellY: 0 },
    background,
    dialogue = null,
  }) {
    super({ spriteImages, startDirection });
    this.mapPositionCell = mapPositionCell;
    this.mapCoords = getCoordsByCell(
      mapPositionCell.cellX,
      mapPositionCell.cellY
    );
    this.background = background;
    this.dialogue = dialogue;

    this.updatePosition();
  }

  updatePosition() {
    // Calcola lo shift relativo al background senza Math.abs
    const shiftX = this.background.position.x - this.mapCoords.x;
    const shiftY = this.background.position.y - this.mapCoords.y;

    // Calcola la posizione dell'NPC sulla canvas
    this.position = {
      x: TILES_FROM_CENTER_X * TILE_DIM + shiftX,
      y: TILES_FROM_CENTER_Y * TILE_DIM + shiftY,
    };
  }

  draw() {
    const image = this.image[this.currentDirection];

    this.updatePosition();

    let xPos = this.position.x;
    let yPos = this.position.y;

    ctx.drawImage(
      image,
      this.currentFrame * (image.width / 4),
      0,
      image.width / 4,
      image.height,
      xPos,
      yPos,
      image.width / 4,
      image.height
    );
  }

  drawDialogue() {
    const boxHeight = 60;
    const boxX = this.position.x + 20;
    const boxY = this.position.y - boxHeight;
    ctx.fillStyle = "white";
    ctx.fillRect(boxX, boxY, 100, boxHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(boxX, boxY, 100, boxHeight);

    ctx.font = `12px Comic Sans MS`; // Font Comic Sans
    ctx.fillStyle = "black"; // Colore del testo
    ctx.textAlign = "center"; // Allineamento centrale
    ctx.textBaseline = "middle"; // Allinea il testo verticalmente
    ctx.fillText(
      this.dialogue.text,
      boxX + 20,
      boxY + 20,
      boxY + boxHeight / 2
    );
  }
}
