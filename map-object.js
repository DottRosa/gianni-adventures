class MapObject extends Sprite {
  constructor({
    name,
    spriteImage,
    isObstacle,
    mapPositionCell = { cellX: 0, cellY: 0 },
    dialogues = null,
  }) {
    super({
      spriteImages: {
        right: spriteImage,
        left: spriteImage,
      },
    });
    if (!spriteImage) {
      this.noDraw = true;
    }
    this.name = name;
    this.isObstacle = isObstacle;
    this.mapPositionCell = mapPositionCell;
    this.mapCoords = getCoordsByCell(
      mapPositionCell.cellX,
      mapPositionCell.cellY
    );
    this.dialogues = dialogues;
  }

  updatePosition(position) {
    const shiftX = position.x - this.mapCoords.x;
    const shiftY = position.y - this.mapCoords.y;

    this.position = {
      x: CONFIG.tile.tilesFromCenterX * CONFIG.tile.tileDim + shiftX,
      y: CONFIG.tile.tilesFromCenterY * CONFIG.tile.tileDim + shiftY,
    };
  }

  draw() {
    if (this.noDraw) {
      return;
    }
    const image = this.image[this.currentDirection];

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
}
