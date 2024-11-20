class Door {
  constructor({ cellX, cellY, nextMapId, lockedByEvent }) {
    this.cellX = cellX;
    this.cellY = cellY;
    this.nextMapId = nextMapId;
    this.lockedByEvent = lockedByEvent;
  }

  match(cell) {
    return this.cellX === cell.cellX && this.cellY === cell.cellY;
  }
}
