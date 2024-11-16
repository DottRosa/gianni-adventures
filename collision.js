class Collision {
  constructor(dataArray, numberTilesX) {
    this.dataArray = dataArray;
    this.numberTilesX = numberTilesX;
  }

  isColliding(nextX, nextY) {
    const cell = getCellByCoords(nextX, nextY);
    const index = cell.cellY * this.numberTilesX + cell.cellX;

    return this.dataArray[index] !== 0;
  }
}
