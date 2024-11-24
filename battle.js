class Battle {
  constructor({ background = `${CONFIG.assetsFolder}/battle.jpg` }) {
    this.background = new Layer({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: background,
    });
  }

  draw() {
    this.background.draw();
  }
}
