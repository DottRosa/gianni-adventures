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

    const folder = `${CONFIG.assets.animations}/${folderName}`;

    // Caricamento dei frame
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = `${folder}/${i}.gif`; // I frame della GIF separati
      this.frames.push(img);
    }
  }

  animate(x, y, propagations = []) {
    const now = Date.now();

    if (!propagations.length) {
      ctx.drawImage(
        this.frames[this.currentFrame],
        x - this.width / 2 + this.driftX,
        y - this.height / 2 + this.driftY,
        this.width,
        this.height
      );
    } else {
      propagations.forEach((propagation) => {
        ctx.drawImage(
          this.frames[this.currentFrame],
          propagation.startX - this.width / 2 + this.driftX,
          propagation.startY - this.height / 2 + this.driftY,
          this.width,
          this.height
        );

        for (var i = 0; i < propagation.quantity; i++) {
          ctx.drawImage(
            this.frames[this.currentFrame],
            propagation.startX -
              this.width / 2 +
              this.driftX +
              propagation.amount,
            propagation.startY - this.height / 2 + this.driftY,
            this.width,
            this.height
          );
        }
      });
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
  aura: "aura",
  "dark-blood": "dark-blood",
  healing: "healing",
  sparkle: "sparkle",
  blood: "blood",
  dragon: "dragon",
  punch: "punch",
  sparks: "sparks",
  "blue-chain": "blue-chain",
  dust: "dust",
  "purple-aura": "purple-aura",
  spell: "spell",
  "blue-electricity": "blue-electricity",
  explosion: "explosion",
  slash: "slash",
  star: "star",
  "blue-explosion": "blue-explosion",
  fire: "fire",
  slice: "slice",
};

const GIFS = {
  [GIF_IDS.healing]: new GIF({
    folderName: GIF_IDS.healing,
    totalFrames: 11,
    width: 50,
    height: 100,
    driftX: 28,
    driftY: 25,
  }),
  [GIF_IDS.aura]: new GIF({
    folderName: GIF_IDS.aura,
    totalFrames: 4,
    width: 100,
    height: 150,
    driftX: 25,
    driftY: 20,
  }),
  [GIF_IDS.dragon]: new GIF({
    folderName: GIF_IDS.dragon,
    totalFrames: 11,
    width: 400,
    height: 200,
    driftX: 150,
  }),
  [GIF_IDS.punch]: new GIF({
    folderName: GIF_IDS.punch,
    totalFrames: 6,
    width: 200,
    height: 200,
    driftX: 30,
    driftY: 25,
  }),
  [GIF_IDS.dust]: new GIF({
    folderName: GIF_IDS.dust,
    totalFrames: 16,
    width: 50,
    height: 50,
    driftX: 15,
    driftY: 15,
  }),
};
