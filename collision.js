class Collision {
  constructor({ dataArray, numberTilesX, npcs = [], mapId }) {
    this.dataArray = dataArray;
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

    const index = cell.cellY * this.numberTilesX + cell.cellX;

    return this.dataArray[index] !== 0;
  }
}
