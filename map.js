class Map {
  constructor({
    totalTilesX,
    totalTilesY,
    collisions,
    npcs = [],
    doors,
    backgroundImages = [],
    foregroundImages = [],
    ambientMusic,
    startPosition,
  }) {
    this.totalTilesX = totalTilesX;
    this.totalTilesY = totalTilesY;
    this.collisionsDetector = new Collision(
      collisions,
      this.totalTilesY,
      this.npcs
    );
    this.npcs = npcs;
    this.doors = doors;
    this.backgroundImages = backgroundImages;
    this.foregroundImages = foregroundImages;
    this.layers = [];
    backgroundImages.forEach((bg) => {
      this.layers.push(
        new Layer({
          position: startPosition,
          imageSrc: bg,
        })
      );
    });
    foregroundImages.forEach((fg) => {
      this.layers.push(
        new Layer({
          position: startPosition,
          imageSrc: fg,
        })
      );
    });
    this.ambientMusic = ambientMusic;
    this.position = startPosition;
  }

  draw() {
    this.layers.forEach((l) => l.draw());
    this.npcs.forEach((n) => n.draw());
  }

  updateLayerPosition(movX, movY) {
    this.layers.forEach((layer) => {
      layer.position.x += movX;
      layer.position.y += movY;
    });

    this.npcs.forEach((npc) => {
      npc.updatePosition(this.currentPosition);
    });
  }

  get currentCell() {
    return getCellByCoords(
      this.layers[0].position.x,
      this.layers[0].position.y
    );
  }

  get currentPosition() {
    return {
      x: this.layers[0].position.x,
      y: this.layers[0].position.y,
    };
  }
}
