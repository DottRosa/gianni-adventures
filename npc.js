const NPC_DIALOGUE_FONT_SIZE = 12;
const NPC_DIALOGUE_FONT_FAMILY = "Comic Sans MS";

const NPC_DIALOGUE_FONT_NORMAL = `${NPC_DIALOGUE_FONT_SIZE}px ${NPC_DIALOGUE_FONT_FAMILY}`;
const NPC_DIALOGUE_FONT_BOLD = `bold ${NPC_DIALOGUE_FONT_SIZE}px ${NPC_DIALOGUE_FONT_FAMILY}`;

const NPC_DIALOGUE_NAME_COLOR = "red";
const NPC_DIALOGUE_TEXT_COLOR = "black";

const NPC_DIALOGUE_BALLOON_COLOR = "white";
const NPC_DIALOGUE_BALLOON_BORDER_COLOR = "black";

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
