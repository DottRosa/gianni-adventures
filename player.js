const PLAYER_FABRISSAZZO = "fabrissazzo";
const PLAYER_GIANNI = "gianni";

class Player extends Sprite {
  constructor({ spriteImages, startDirection = "right", name }) {
    super({ spriteImages, startDirection });
    this.name = name;
  }
}
