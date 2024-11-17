class Dialogue {
  currentDialog = 0;

  constructor({ textBlocks = [] }) {
    this.textBlocks = textBlocks;
  }

  next() {
    this.currentDialog++;
    if (this.currentDialog >= this.textBlocks.length) {
      this.currentDialog = 0;
    }
  }
}
