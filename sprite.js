class Sprite {
  currentFrame = 0;
  currentDirection = CONFIG.directions.right;
  position = {
    x: 0,
    y: 0,
  };

  constructor({ spriteImages, startDirection = CONFIG.directions.right }) {
    this.currentDirection = startDirection;

    this.image = {
      left: new Image(),
      right: new Image(),
    };

    Object.keys(spriteImages).forEach((direction) => {
      if (spriteImages[direction]) {
        this.image[direction].src = spriteImages[direction];
      }
    });
  }

  /**
   * Set the new direction to apply to the sprite
   * @param {string} direction can be "left" or "right"
   */
  set direction(direction) {
    this.currentDirection = direction;
  }

  nextFrame() {
    if (this.currentFrame === 1) {
      this.currentFrame = 0;
    } else {
      this.currentFrame++;
    }
  }

  draw(driftX = 0, driftY = 0) {
    const image = this.image[this.currentDirection];

    let xPos, yPos;

    this.position.x =
      CONFIG.tile.canvasWidth / 2 -
      this.image[this.currentDirection].width / 4 / 2;
    this.position.y =
      CONFIG.tile.canvasHeight / 2 -
      this.image[this.currentDirection].height / 2;

    xPos = this.position.x + driftX;
    yPos = this.position.y + driftY;

    ctx.drawImage(
      image,
      this.currentFrame * this.displayedWidth,
      0,
      this.displayedWidth,
      image.height,
      xPos,
      yPos,
      this.displayedWidth,
      image.height
    );
  }

  drawAtPosition(posX, posY) {
    const image = this.image[this.currentDirection];

    ctx.drawImage(
      image,
      this.currentFrame * this.displayedWidth,
      0,
      this.displayedWidth,
      image.height,
      posX,
      posY,
      this.displayedWidth,
      image.height
    );
  }

  get displayedWidth() {
    return this.image[this.currentDirection].width / 4;
  }
}
