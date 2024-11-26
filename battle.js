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

  get charactersQuantity() {
    return Object.values(players).length + this.enemies.length;
  }
}
