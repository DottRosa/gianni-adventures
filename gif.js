class GIF {
  cooldown = 0;
  currentFrame = 0;

  constructor({
    folderName,
    totalFrames,
    width,
    height,
    driftX = 0,
    driftY = 0,
  }) {
    this.folderName = folderName;
    this.totalFrames = totalFrames;
    this.width = width;
    this.height = height;
    this.frames = [];
    this.currentFrame = 0;
    this.driftX = driftX;
    this.driftY = driftY;

    const folder = `${CONFIG.assets.attacks}/${folderName}`;

    // Caricamento dei frame
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `${folder}/${i}.gif`; // I frame della GIF separati
      this.frames.push(img);
    }
  }

  animate(
    x,
    y,
    propagation = {
      quantity: 0,
      amount: 0,
    }
  ) {
    const now = Date.now();

    ctx.drawImage(
      this.frames[this.currentFrame],
      x - this.width / 2 + this.driftX,
      y - this.height / 2 + this.driftY,
      this.width,
      this.height
    );

    if (propagation.quantity) {
      for (var i = 0; i < propagation.quantity; i++) {
        ctx.drawImage(
          this.frames[this.currentFrame],
          x - this.width / 2 + this.driftX + propagation.amount,
          y - this.height / 2 + this.driftY,
          this.width,
          this.height
        );
      }
    }

    // Avanza al frame successivo
    if (now > this.cooldown) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
      this.cooldown = now + CONFIG.keyboard.animationCooldown;
    }
  }

  get finished() {
    return this.currentFrame >= this.totalFrames - 1;
  }

  reset() {
    this.currentFrame = 0;
  }
}

const GIF_IDS = {
  heal: "heal",
  aura: "aura",
  beast: "beast",
  punch: "punch",
};

const GIFS = {
  [GIF_IDS.heal]: new GIF({
    folderName: "heal",
    totalFrames: 16,
    width: 50,
    height: 100,
    driftX: 28,
    driftY: 25,
  }),
  [GIF_IDS.aura]: new GIF({
    folderName: "aura",
    totalFrames: 4,
    width: 100,
    height: 100,
  }),
  [GIF_IDS.beast]: new GIF({
    folderName: "beast",
    totalFrames: 11,
    width: 400,
    height: 200,
  }),
  [GIF_IDS.punch]: new GIF({
    folderName: "punch",
    totalFrames: 6,
    width: 200,
    height: 200,
    driftX: 30,
    driftY: 25,
  }),
};
