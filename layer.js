/**
 * Rapresent a background that moves in the map
 */
class Layer {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
