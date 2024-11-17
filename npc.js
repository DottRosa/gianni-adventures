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
    dialogue = null,
    name = "Unknown",
  }) {
    super({ spriteImages, startDirection });
    this.mapPositionCell = mapPositionCell;
    this.mapCoords = getCoordsByCell(
      mapPositionCell.cellX,
      mapPositionCell.cellY
    );
    this.background = background;
    this.dialogue = dialogue;
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

  continueDialogue() {
    this.dialogue.next();
  }

  get dialogIsEnded() {
    if (this.dialogue.ended) {
      this.dialogue.ended = false;

      return true;
    }
    return false;
  }

  drawDialogue() {
    const boxHeight = 60;
    const boxX = this.position.x + 20;
    const boxY = this.position.y - boxHeight;

    ctx.fillStyle = NPC_DIALOGUE_BALLOON_COLOR;
    ctx.fillRect(boxX, boxY, 100, boxHeight);

    ctx.strokeStyle = NPC_DIALOGUE_BALLOON_BORDER_COLOR;
    ctx.strokeRect(boxX, boxY, 100, boxHeight);

    ctx.textAlign = "left";
    ctx.font = NPC_DIALOGUE_FONT_BOLD;
    ctx.fillStyle = NPC_DIALOGUE_NAME_COLOR;
    ctx.fillText(this.name, boxX + 5, boxY + 5, boxY + boxHeight / 2);

    ctx.font = NPC_DIALOGUE_FONT_NORMAL;
    ctx.fillStyle = NPC_DIALOGUE_TEXT_COLOR;
    ctx.fillText(this.dialogue.text, boxX + 5, boxY + 20, boxY + boxHeight / 2);
  }
}
