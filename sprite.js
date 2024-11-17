class Sprite {
  currentFrame = 0;
  currentDirection = "right";
  position = {
    x: 0,
    y: 0,
  };

  constructor({ spriteImages, startDirection = "right" }) {
    this.currentDirection = startDirection;

    this.image = {
      left: new Image(),
      right: new Image(),
    };

    Object.keys(spriteImages).forEach((direction) => {
      this.image[direction].src = spriteImages[direction];
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

    this.position.x =
      CANVAS_WIDTH / 2 - this.image[this.currentDirection].width / 4 / 2;
    this.position.y =
      CANVAS_HEIGHT / 2 - this.image[this.currentDirection].height / 2;

    let xPos = this.position.x + driftX;
    let yPos = this.position.y + driftY;

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
