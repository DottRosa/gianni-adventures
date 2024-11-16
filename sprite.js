class Sprite {
  currentFrame = 0;
  currentDirection = "right";

  constructor({ spriteImages, startDirection = "right", velocity }) {
    this.velocity = velocity;
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

    ctx.drawImage(
      image,
      this.currentFrame * (image.width / 4),
      0,
      image.width,
      image.height * 4,
      CANVAS_WIDTH / 2 - image.width / 4 / 2 + driftX,
      CANVAS_HEIGHT / 2 - image.height / 2 + driftY,
      image.width / 4,
      image.height
    );
  }
}
