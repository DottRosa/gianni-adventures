class GIF {
  cooldown = 0;
  currentFrame = 0;

  constructor({ folderName, totalFrames }) {
    this.folderName = folderName;
    this.totalFrames = totalFrames;
    this.frames = [];
    this.currentFrame = 0;

    const folder = `${CONFIG.assets.attacks}/${folderName}`;

    // Caricamento dei frame
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `${folder}/frame_${i}.gif`; // I frame della GIF separati
      this.frames.push(img);
    }
  }

  animate(x, y) {
    const now = Date.now();
    ctx.drawImage(this.frames[this.currentFrame], x, y, 50, 50);

    // Avanza al frame successivo
    if (now > this.cooldown) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.cooldown = now + CONFIG.keyboard.animationCooldown;
    }
    console.log(this.currentFrame);
  }

  get finished() {
    return this.currentFrame >= this.totalFrames - 1;
  }

  reset() {
    this.currentFrame = 0;
  }
}
