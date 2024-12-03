class Character extends Sprite {
  constructor({
    spriteImages,
    startDirection,
    attacks = [],
    characterBattleStats,
  }) {
    super({ spriteImages, startDirection });
    this.attacks = attacks;
    this.stats = characterBattleStats;
  }

  get freeAttacks() {
    return this.attacks.filter((a) => !a.hasCost);
  }

  get costAttacks() {
    return this.attacks.filter((a) => a.hasCost);
  }

  drawStatusEffect() {
    const status = this.stats.currentStatusEffect;
    if (status) {
      status.draw(this.position.x, this.position.y);
    }
  }
}
