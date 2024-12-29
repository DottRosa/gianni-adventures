class Collision {
  constructor({ collisionCells, numberTilesX, npcs = [], mapId }) {
    this.collisionCells = collisionCells;
    this.numberTilesX = numberTilesX;
    this.npcMap = {};
    this.mapId = mapId;
    npcs.forEach((npc) => {
      const key = `${npc.mapPositionCell[mapId].cellX}-${npc.mapPositionCell[mapId].cellY}`;
      this.npcMap[key] = npc;
    });
  }

  isColliding(nextX, nextY) {
    const cell = getCellByCoords(nextX, nextY);

    const key = `${cell.cellX}-${cell.cellY}`;
    if (this.npcMap[key]) {
      return true;
    }

    // const index = cell.cellY * this.numberTilesX + cell.cellX;

    return this.collisionCells[key];
  }
}
