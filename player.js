class Player extends Sprite {
  constructor({
    spriteImages,
    startDirection = CONFIG.directions.right,
    name,
  }) {
    super({ spriteImages, startDirection });
    this.name = name;
  }
}
