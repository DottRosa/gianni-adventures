class Collision {
  constructor(dataArray, numberTilesX, npcList = []) {
    this.dataArray = dataArray;
    this.numberTilesX = numberTilesX;
    this.npcMap = {};
    npcList.forEach((npc) => {
      const key = `${npc.mapPositionCell.cellX}-${npc.mapPositionCell.cellY}`;
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
