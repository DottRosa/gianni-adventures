class Map {
  constructor({
    totalTilesX,
    totalTilesY,
    collisions,
    npcs = [],
    doors = [],
    mapObjects = [],
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
    this.mapObjects = mapObjects;
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

  drawBackgrounds() {
    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].draw();
    }
  }

  drawForegrounds() {
    for (let i = 0; i < this.foregrounds.length; i++) {
      this.foregrounds[i].draw();
    }
  }

  drawNpcs() {
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].draw();
    }
  }

  updateLayerPosition(movX, movY) {
    this.currentPosition.x += movX;
    this.currentPosition.y += movY;

    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].updatePosition(this.currentPosition);
    }

    for (let i = 0; i < this.mapObjects.length; i++) {
      this.mapObjects[i].updatePosition(this.currentPosition);
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

  /**
   * Finds the nearest entity the player can interact with
   * @returns an NPC or a MapObject
   */
  findNearestInteractionEntity() {
    return [...this.npcs, ...this.mapObjects].find((entity) => {
      const entityPosition = entity.position;
      const playerPosition = players[CONFIG.player.main].position;

      const deltaX = entityPosition.x - playerPosition.x;
      const deltaY = entityPosition.y - playerPosition.y;

      let entityDirection;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        entityDirection =
          deltaX > 0 ? CONFIG.directions.right : CONFIG.directions.left;
      }

      if (players[CONFIG.player.main].currentDirection !== entityDirection) {
        return false;
      }

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      return distance <= CONFIG.player.interactionArea;
    });
  }
}
