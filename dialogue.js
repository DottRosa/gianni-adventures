class Dialogue {
  currentDialog = 0;
  ended = false;

  constructor({ textBlocks = [] }) {
    this.textBlocks = textBlocks;
  }

  next() {
    this.currentDialog++;

    if (this.currentDialog >= this.textBlocks.length) {
      this.currentDialog = 0;
      this.ended = true;
    }
  }

  get text() {
    return this.textBlocks[this.currentDialog];
  }
}
