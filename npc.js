class NPC extends Sprite {
  constructor({
    details,
    startDirection = CONFIG.directions.right,
    mapPositionCell = { cellX: 0, cellY: 0 },
    dialogueManager = null,
    characterBattleStats,
  }) {
    super({ spriteImages: details.spriteImages, startDirection });
    this.details = details;
    this.mapPositionCell = mapPositionCell;
    this.mapCoords = getCoordsByCell(
      mapPositionCell.cellX,
      mapPositionCell.cellY
    );
    this.dialogueManager = dialogueManager;
    this.characterBattleStats = characterBattleStats;
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

  drawFixed(posX, posY) {
    const image = this.image[this.currentDirection];

    ctx.drawImage(
      image,
      this.currentFrame * (image.width / 4),
      0,
      image.width / 4,
      image.height,
      posX,
      posY,
      image.width / 4,
      image.height
    );
  }

  changeChoice(goToNext = true) {
    if (goToNext) {
      this.dialogueManager.nextChoice();
    } else {
      this.dialogueManager.previousChoice();
    }
  }

  drawDialogue({ players, partnerDrift }) {
    this.dialogueManager.draw({
      position: this.position,
      name: this.details.nickname[CONFIG.player.main],
      players,
      partnerDrift,
    });
  }
}
