class Map {
  constructor({
    totalTilesX,
    totalTilesY,
    collisions,
    npcs,
    doors,
    backgroundImages = [],
    foregroundImages = [],
    ambientMusic,
    startPosition,
  }) {
    this.totalTilesX = totalTilesX;
    this.totalTilesY = totalTilesY;
    this.collisions = collisions;
    this.npcs = npcs;
    this.doors = doors;
    this.backgroundImages = backgroundImages;
    this.foregroundImages = foregroundImages;
    this.ambientMusic = ambientMusic;
    this.position = startPosition;
  }
}
