class NPC extends Sprite {
  constructor({
    spriteImages,
    startDirection = "right",
    mapPositionCell = { cellX: 0, cellY: 0 },
    background,
    dialogueManager = null,
    name = "Unknown",
  }) {
    super({ spriteImages, startDirection });
    this.mapPositionCell = mapPositionCell;
    this.mapCoords = getCoordsByCell(
      mapPositionCell.cellX,
      mapPositionCell.cellY
    );
    this.background = background;
    this.dialogueManager = dialogueManager;
    this.name = name;

    this.updatePosition();
  }

  updatePosition() {
    const shiftX = this.background.position.x - this.mapCoords.x;
    const shiftY = this.background.position.y - this.mapCoords.y;

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

  startDialogue() {
    this.dialogueManager.start();
  }

  continueDialogue() {
    return this.dialogueManager.next();
  }

  get dialogIsEnded() {
    return this.dialogueManager.ended;
  }

  drawDialogue() {
    this.dialogueManager.draw(this.position, this.name);
  }
}
