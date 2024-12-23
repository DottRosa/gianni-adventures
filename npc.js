class NPC extends Character {
  constructor({
    details,
    startDirection = CONFIG.directions.right,
    mapPositionCell = { cellX: 0, cellY: 0 },
    dialogues = null,
    characterBattleStats,
    battleDialogues = [],
    attacks = [],
  }) {
    super({
      spriteImages: details.spriteImages,
      startDirection,
      attacks,
      characterBattleStats,
    });
    this.details = details;
    this.id = this.name.toLowerCase().replace(" ", "-");
    this.mapPositionCell = mapPositionCell;
    this.mapCoords = getCoordsByCell(
      mapPositionCell.cellX,
      mapPositionCell.cellY
    );
    this.dialogues = dialogues;
    this.battleDialogues = battleDialogues;
    if (!battleDialogues.length) {
      this.battleDialogues.push(CONFIG.battle.enemies.standardDialogue);
    }
  }

  updatePosition(position, mapId) {
    this.mapCoords = getCoordsByCell(
      this.mapPositionCell[mapId].cellX,
      this.mapPositionCell[mapId].cellY
    );
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

  changeChoice(goToNext = true) {
    if (goToNext) {
      this.dialogueManager.nextChoice();
    } else {
      this.dialogueManager.previousChoice();
    }
  }

  drawDialogue({ players, partnerDrift }) {
    this.dialogueManager.draw2({
      position: this.position,
      name: this.details.nickname[CONFIG.player.main],
      players,
      partnerDrift,
    });
  }

  get name() {
    return `${this.details.firstName} ${this.details.lastName}`;
  }

  get battleDialogue() {
    const randomIndex = getRandomIndex(this.battleDialogues);
    return this.battleDialogues[randomIndex];
  }
}
