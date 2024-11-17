class NPC extends Sprite {
  constructor({
    spriteImages,
    startDirection = "right",
    mapPositionCell = { cellX: 0, cellY: 0 },
    backgroundPosition = { x: 0, y: 0 },
  }) {
    super({ spriteImages, startDirection });
    this.mapPositionCell = mapPositionCell;

    this.updatePosition(backgroundPosition);
  }

  updatePosition(backgroundPosition = { x: 0, y: 0 }) {
    const cellCoords = getCoordsByCell(
      this.mapPositionCell.cellX,
      this.mapPositionCell.cellY
    );

    const shiftX = Math.abs(backgroundPosition.x) - Math.abs(cellCoords.x);
    const shiftY = Math.abs(backgroundPosition.y) - Math.abs(cellCoords.y);

    this.position = {
      x: TILES_FROM_CENTER_X * TILE_DIM - shiftX,
      y: TILES_FROM_CENTER_Y * TILE_DIM - shiftY,
    };
  }

  draw() {
    const image = this.image[this.currentDirection];

    let xPos = this.position.x;
    let yPos = this.position.y;

    // console.log(xPos, yPos);

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
}
