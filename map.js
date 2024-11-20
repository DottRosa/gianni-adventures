class Map {
  constructor({
    totalTilesX,
    totalTilesY,
    collisions,
    npcs = [],
    doors = [],
    backgroundImages = [],
    foregroundImages = [],
    ambientMusic,
    startPosition,
  }) {
    this.totalTilesX = totalTilesX;
    this.totalTilesY = totalTilesY;
    this.collisionsDetector = new Collision(collisions, this.totalTilesY, npcs);
    this.npcs = npcs;
    this.doors = doors;
    this.backgroundImages = backgroundImages;
    this.foregroundImages = foregroundImages;
    this.backgrounds = [];
    backgroundImages.forEach((bg) => {
      this.backgrounds.push(
        new Layer({
          position: startPosition,
          imageSrc: bg,
        })
      );
    });
    this.foregrounds = [];
    foregroundImages.forEach((fg) => {
      this.foregrounds.push(
        new Layer({
          position: startPosition,
          imageSrc: fg,
        })
      );
    });
    this.ambientMusic = ambientMusic;
    // This is shared between backgrounds and foregrounds, so any update to this
    // variable will be reflected to both fore/back grounds.
    this.currentPosition = startPosition;
  }

  draw() {
    this.backgrounds[0].draw();

    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].draw();
    }

    for (let i = 0; i < this.foregrounds.length; i++) {
      this.foregrounds[i].draw();
    }
  }

  updateLayerPosition(movX, movY) {
    this.currentPosition.x += movX;
    this.currentPosition.y += movY;

    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].updatePosition(this.currentPosition);
    }
  }

  get currentCell() {
    return getCellByCoords(this.currentPosition.x, this.currentPosition.y);
  }

  get doorFound() {
    const door = this.doors.find((door) => {
      return door.match(this.currentCell);
    });

    if (door) {
      return door.nextMapId;
    }
    return null;
  }
}
