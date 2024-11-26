class Battle {
  constructor({
    background = `${CONFIG.assetsFolder}/battle.jpg`,
    enemies = [],
  }) {
    this.background = new Layer({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: background,
    });
    this.enemies = enemies;
  }

  drawPlayers() {
    players[CONFIG.player.gianni].currentDirection = CONFIG.directions.right;
    players[CONFIG.player.fabrissazzo].currentDirection =
      CONFIG.directions.right;

    players[CONFIG.player.gianni].drawFixed(
      CONFIG.tile.tileDim,
      CONFIG.tile.canvasHeight / 2
    );
    players[CONFIG.player.fabrissazzo].drawFixed(
      CONFIG.tile.tileDim * 2,
      CONFIG.tile.canvasHeight / 2
    );
  }

  drawEnemies() {
    const gap = CONFIG.tile.tileDim;
    for (var i = 0; i < this.enemies.length; i++) {
      this.enemies[i].drawFixed(
        CONFIG.tile.canvasWidth - CONFIG.tile.tileDim * 2 - gap * i,
        CONFIG.tile.canvasHeight / 2
      );
    }
  }

  draw() {
    this.background.draw();
    this.drawPlayers();
    this.drawEnemies();
  }
}
