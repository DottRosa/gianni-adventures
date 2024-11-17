class Player extends Sprite {
  constructor({ spriteImages, startDirection = "right", name }) {
    super({ spriteImages, startDirection });
    this.name = name;
  }
}
