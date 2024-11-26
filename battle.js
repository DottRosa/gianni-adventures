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

    players[CONFIG.player.gianni].currentDirection = CONFIG.directions.right;
    players[CONFIG.player.fabrissazzo].currentDirection =
      CONFIG.directions.right;

    players[CONFIG.player.gianni].drawFixed(
      CONFIG.tile.tileDim,
      CONFIG.tile.canvasHeight / 2,
      true
    );
    players[CONFIG.player.fabrissazzo].drawFixed(
      CONFIG.tile.tileDim * 2,
      CONFIG.tile.canvasHeight / 2,
      true
    );
  }
}
