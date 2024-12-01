class NPC extends Sprite {
  constructor({
    details,
    startDirection = CONFIG.directions.right,
    mapPositionCell = { cellX: 0, cellY: 0 },
    dialogueManager = null,
    characterBattleStats,
    battleDialogues = [],
    attacks = [],
  }) {
    super({ spriteImages: details.spriteImages, startDirection });
    this.details = details;
    this.mapPositionCell = mapPositionCell;
    this.mapCoords = getCoordsByCell(
      mapPositionCell.cellX,
      mapPositionCell.cellY
    );
    this.attacks = attacks;
    this.dialogueManager = dialogueManager;
    this.characterBattleStats = characterBattleStats;
    this.battleDialogues = battleDialogues;
    if (!battleDialogues.length) {
      this.battleDialogues.push(CONFIG.battle.enemies.standardDialogue);
    }
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

  get name() {
    return this.details.fullName;
  }

  get battleDialogue() {
    const randomIndex = getRandomIndex(this.battleDialogues);
    return this.battleDialogues[randomIndex];
  }
}
